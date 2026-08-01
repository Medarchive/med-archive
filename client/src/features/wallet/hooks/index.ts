"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Buffer } from "buffer";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import {
	ApiSuccessResponse,
	PaginatedData,
	PaginationParams,
} from "../../../types/api";
import { LinkWalletResponseData, WalletData, WalletTransaction } from "../types";

export const WALLET_QUERY_KEY = ["wallet"];

export const useWallet = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: WALLET_QUERY_KEY,
		queryFn: async () => {
			try {
				const { data } = await axiosAuth.get<ApiSuccessResponse<WalletData>>(
					apiRoutes.wallet.BASE,
				);

				return data.data;
			} catch (error) {
				if (isAxiosError(error) && error.response?.status === 404) {
					return null;
				}

				throw error;
			}
		},
	});
};

// Full connect flow: get the address from Freighter, link it (which returns
// a nonce), sign that nonce, then verify — same nonce-signature pattern as
// wallet sign-in, just scoped to linking a wallet to an existing account.
export const useConnectWallet = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const freighter = await import("@stellar/freighter-api");

			const connection = await freighter.isConnected();
			if (connection.error || !connection.isConnected) {
				throw new Error(
					"Freighter wallet extension isn't installed. Get it from freighter.app to connect your wallet.",
				);
			}

			const access = await freighter.requestAccess();
			if (access.error || !access.address) {
				throw new Error(access.error?.message ?? "Wallet access was denied");
			}

			const { data: linkRes } = await axiosAuth.post<
				ApiSuccessResponse<LinkWalletResponseData>
			>(apiRoutes.wallet.BASE, { address: access.address });

			const nonce = linkRes.data.nonce;

			const signed = await freighter.signMessage(nonce, {
				address: access.address,
			});
			if (signed.error || !signed.signedMessage) {
				throw new Error(
					signed.error?.message ?? "Failed to sign the wallet nonce",
				);
			}

			const signature =
				typeof signed.signedMessage === "string"
					? signed.signedMessage
					: Buffer.from(signed.signedMessage).toString("hex");

			const { data } = await axiosAuth.post<ApiSuccessResponse<unknown>>(
				apiRoutes.wallet.VERIFY,
				{ nonce, signature },
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
			toast.success(data.message || "Wallet connected successfully");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : getApiErrorMessage(error),
			);
		},
	});
};

export const useUnlinkWallet = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.wallet.BASE,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
			toast.success(data.message || "Wallet unlinked");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useWalletTransactions = (params: PaginationParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...WALLET_QUERY_KEY, "transactions", params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<WalletTransaction>>
			>(apiRoutes.wallet.TRANSACTIONS, { params });

			return data.data;
		},
	});
};
