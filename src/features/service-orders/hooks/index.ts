"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import {
	assertCorrectNetwork,
	connectWallet,
	getWalletErrorMessage,
} from "../../../lib/wallet/kit";
import { submitPayment } from "../../../lib/wallet/payment";
import {
	ApiSuccessResponse,
	PaginatedData,
	PaginationParams,
} from "../../../types/api";
import { WALLET_QUERY_KEY } from "../../wallet/hooks";
import {
	CreateServiceOrderPayload,
	PaymentIntentData,
	ServiceOrderData,
} from "../types";

export const SERVICE_ORDERS_QUERY_KEY = ["service-orders"];

// Same list for both roles — the backend returns whichever orders the
// caller is the patient or the provider on.
export const useServiceOrders = (params: PaginationParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...SERVICE_ORDERS_QUERY_KEY, "list", params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<ServiceOrderData>>
			>(apiRoutes.serviceOrders.BASE, { params });

			return data.data;
		},
	});
};

export const useServiceOrder = (id: string | null) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...SERVICE_ORDERS_QUERY_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ServiceOrderData>>(
				apiRoutes.serviceOrders.BY_ID(id as string),
			);

			return data.data;
		},
		enabled: !!id,
	});
};

// PROVIDER only. A 400 means the provider's own wallet isn't ready to
// receive (not verified, or no USDC trustline yet) — the backend says which.
export const useCreateServiceOrder = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateServiceOrderPayload) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<ServiceOrderData>>(
				apiRoutes.serviceOrders.BASE,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: SERVICE_ORDERS_QUERY_KEY });
			toast.success(data.message || "Service order created");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Couldn't create this order — try again"));
		},
	});
};

/**
 * Thrown when the transaction reached the network but the backend's check
 * didn't confirm it. The hash is kept so the UI can retry verification
 * instead of asking the patient to pay a second time.
 */
export class PaymentVerificationError extends Error {
	txHash: string;

	constructor(message: string, txHash: string) {
		super(message);
		this.name = "PaymentVerificationError";
		this.txHash = txHash;
	}
}

const verifyPayment = async (
	axiosAuth: ReturnType<typeof useAxiosAuth>,
	orderId: string,
	txHash: string,
) => {
	try {
		const { data } = await axiosAuth.post<ApiSuccessResponse<Partial<ServiceOrderData>>>(
			apiRoutes.serviceOrders.VERIFY_PAYMENT(orderId),
			{ txHash },
		);

		return data;
	} catch (error) {
		// 409 covers "this order was already paid by a concurrent request" —
		// e.g. the backend's own 5-minute sweep beat us to it. Confirm by
		// re-reading the order rather than trusting the status code alone.
		if (isAxiosError(error) && error.response?.status === 409) {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ServiceOrderData>>(
				apiRoutes.serviceOrders.BY_ID(orderId),
			);
			if (data.data.status === "PAID") return data;
		}

		throw new PaymentVerificationError(
			getApiErrorMessage(
				error,
				"Your payment was sent, but we couldn't confirm it yet.",
			),
			txHash,
		);
	}
};

interface PayServiceOrderVariables {
	orderId: string;
	// The patient's linked (and verified) wallet — the only address the
	// payment may come from.
	linkedAddress: string;
	// Set when retrying: the payment already went through, only the
	// backend confirmation is left, so nothing is signed or sent again.
	txHash?: string;
}

// PATIENT only. The full flow: payment details from the backend → the
// patient picks their wallet in the kit → build, sign and submit the USDC
// payment → ask the backend to verify the hash.
export const usePayServiceOrder = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ orderId, linkedAddress, txHash }: PayServiceOrderVariables) => {
			if (txHash) return verifyPayment(axiosAuth, orderId, txHash);

			const { data: intentRes } = await axiosAuth.get<
				ApiSuccessResponse<PaymentIntentData>
			>(apiRoutes.serviceOrders.PAYMENT_INTENT(orderId));

			const address = await connectWallet();
			await assertCorrectNetwork();

			// The wallet picker lets someone choose any address, but only the
			// linked one has the trustline the backend checked, and paying from
			// another would leave no trail back to this account.
			if (address !== linkedAddress) {
				throw new Error(
					`Choose your linked wallet (${linkedAddress.slice(0, 4)}…${linkedAddress.slice(-4)}) to pay — the one you picked isn't linked to this account.`,
				);
			}

			const hash = await submitPayment(intentRes.data, address);

			return verifyPayment(axiosAuth, orderId, hash);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: SERVICE_ORDERS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
			toast.success(data.message || "Payment confirmed");
		},
		onError: (error) => {
			// Money may already have moved here, so the message has to say so
			// — the UI keeps the hash and offers to retry verification.
			if (error instanceof PaymentVerificationError) {
				toast.error(error.message);
				return;
			}

			toast.error(getWalletErrorMessage(error, "Couldn't complete this payment"));
		},
	});
};
