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
	signNonce,
} from "../../../lib/wallet/kit";
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

// Full connect flow: pick a wallet in the kit's modal, link its address
// (which returns a nonce), sign that nonce, then verify — same
// nonce-signature pattern as wallet sign-in, just scoped to linking a wallet
// to an existing account. `label` is the optional display name from POST
// /wallet's documented body (e.g. "My main wallet") — purely cosmetic on the
// backend, so an empty string is just omitted rather than sent.
export const useConnectWallet = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (label?: string) => {
			const address = await connectWallet();

			// Testnet-only for now (env-controlled) — reject rather than
			// silently relabel, so a mainnet wallet never gets linked as if it
			// were testnet or vice versa. This check stays client-side only:
			// the live API 400s with "property network should not exist" if
			// it's included in the request body at all, despite the docs'
			// example showing it.
			await assertCorrectNetwork();

			const linkPayload = { address, label: label || undefined };

			let nonce: string;
			try {
				const { data: linkRes } = await axiosAuth.post<
					ApiSuccessResponse<LinkWalletResponseData>
				>(apiRoutes.wallet.BASE, linkPayload);

				nonce = linkRes.data.nonce;
			} catch (error) {
				// "Wallet already linked" — most likely a previous attempt linked
				// but never got signed/verified (closed the wallet prompt,
				// dropped connection, etc.), leaving a stuck linked-but-unverified
				// wallet with no way to fetch its original nonce again (there's no
				// regenerate-nonce endpoint). Self-heal by unlinking and relinking
				// to get a fresh nonce, rather than dead-ending here.
				if (isAxiosError(error) && error.response?.status === 409) {
					await axiosAuth.delete(apiRoutes.wallet.BASE);

					const { data: relinkRes } = await axiosAuth.post<
						ApiSuccessResponse<LinkWalletResponseData>
					>(apiRoutes.wallet.BASE, linkPayload);

					nonce = relinkRes.data.nonce;
				} else {
					throw error;
				}
			}

			const signature = await signNonce(nonce, address);

			const { data } = await axiosAuth.post<ApiSuccessResponse<WalletData>>(
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
			toast.error(getWalletErrorMessage(error));
		},
	});
};

// For people without a Stellar wallet of their own: the server generates
// and funds one (testnet) and marks it verified straight away — it holds the
// key, so there's no ownership signature to collect. 409 means a wallet is
// already linked.
export const useCreateCustodialWallet = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<WalletData>>(
				apiRoutes.wallet.CREATE,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
			toast.success(data.message || "Wallet created");
		},
		onError: (error) => {
			toast.error(
				isAxiosError(error) && error.response?.status === 409
					? "A wallet is already linked to this account."
					: getApiErrorMessage(error, "Couldn't create a wallet — try again"),
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
