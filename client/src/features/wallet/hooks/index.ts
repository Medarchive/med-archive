"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Buffer } from "buffer";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import {
	ALLOWED_STELLAR_NETWORK,
	assertAllowedFreighterNetwork,
	buildFreighterUnavailableError,
	FreighterUnavailableError,
} from "../../../lib/utils/freighter";
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
// `label` is the optional display name from POST /wallet's documented body
// (e.g. "My main wallet") — purely cosmetic on the backend, so an empty
// string is just omitted rather than sent.
export const useConnectWallet = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (label?: string) => {
			const freighter = await import("@stellar/freighter-api");

			const connection = await freighter.isConnected();
			if (connection.error || !connection.isConnected) {
				throw buildFreighterUnavailableError();
			}

			const access = await freighter.requestAccess();
			if (access.error || !access.address) {
				throw new Error(access.error?.message ?? "Wallet access was denied");
			}

			const address = access.address;

			const { network: freighterNetwork, error: networkError } =
				await freighter.getNetwork();
			if (networkError) {
				throw new Error(
					"Couldn't determine which Stellar network Freighter is on",
				);
			}

			// Testnet-only for now (env-controlled) — reject rather than silently
			// relabel, so a mainnet wallet never gets linked as if it were
			// testnet or vice versa.
			assertAllowedFreighterNetwork(freighterNetwork);

			const linkPayload = {
				address,
				network: ALLOWED_STELLAR_NETWORK,
				label: label || undefined,
			};

			let nonce: string;
			try {
				const { data: linkRes } = await axiosAuth.post<
					ApiSuccessResponse<LinkWalletResponseData>
				>(apiRoutes.wallet.BASE, linkPayload);

				nonce = linkRes.data.nonce;
			} catch (error) {
				// "Wallet already linked" — most likely a previous attempt linked
				// but never got signed/verified (closed the Freighter prompt,
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

			const signed = await freighter.signMessage(nonce, {
				address,
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
			console.log("wallet details from freighter", data);
			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
			toast.success(data.message || "Wallet connected successfully");
		},
		onError: (error) => {
			if (error instanceof FreighterUnavailableError) {
				toast.error(error.message, {
					action: {
						label: error.installLabel,
						onClick: () =>
							window.open(error.installUrl, "_blank", "noopener,noreferrer"),
					},
				});
				return;
			}

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
