"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Buffer } from "buffer";
import { isAxiosError } from "axios";
import { axiosPublic } from "../../../lib/config/axios";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { pageRoutes } from "../../../lib/config/routes";
import { useAuthStore } from "../../../lib/stores/userAuthStore";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse, AuthTokensData } from "../../../types/api";

// Login doesn't tell us whether onboarding is complete, so check for an
// existing personal-info record and route accordingly: straight to the
// dashboard if it exists, into the onboarding flow if it 404s.
const redirectAfterLogin = async (
	router: ReturnType<typeof useRouter>,
	axiosAuth: ReturnType<typeof useAxiosAuth>,
) => {
	try {
		await axiosAuth.get(apiRoutes.personalInfo);
		router.push(pageRoutes.dashboardRoutes.DASHBOARD);
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			router.push(pageRoutes.authRoutes.PERSONAL_INFO);
		} else {
			router.push(pageRoutes.dashboardRoutes.DASHBOARD);
		}
	}
};

interface RegisterPayload {
	fullName: string;
	email: string;
	phone?: string;
	password: string;
	role: "PATIENT" | "PROVIDER";
}

export const useRegister = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (values: RegisterPayload) => {
			// const res = await axiosPublic.post<
			// 	ApiSuccessResponse<{ resendAfterSeconds: number }>
			// >(apiRoutes.auth.REGISTER, values);
			const { data } = await axiosPublic.post<
				ApiSuccessResponse<{ resendAfterSeconds: number }>
			>(apiRoutes.auth.REGISTER, values);

			// console.log(res);
			return data;
		},
		onSuccess: (data, variables) => {
			toast.success(data.message);
			router.push(pageRoutes.authRoutes.VERIFY_OTP(variables.email));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useValidateOtp = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (values: { email: string; otp: string }) => {
			const { data } = await axiosPublic.post<ApiSuccessResponse<unknown>>(
				apiRoutes.auth.VALIDATE_OTP,
				values,
			);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
			router.push(pageRoutes.authRoutes.SIGN_IN);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useResendOtp = () => {
	return useMutation({
		mutationFn: async (values: { email: string }) => {
			const { data } = await axiosPublic.post<
				ApiSuccessResponse<{ resendAfterSeconds: number }>
			>(apiRoutes.auth.RESEND_OTP, values);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useLogin = () => {
	const router = useRouter();
	const axiosAuth = useAxiosAuth();
	const login = useAuthStore((state) => state.login);

	return useMutation({
		mutationFn: async (values: { email: string; password: string }) => {
			const { data } = await axiosPublic.post<
				ApiSuccessResponse<AuthTokensData>
			>(apiRoutes.auth.LOGIN, values);

			return data;
		},
		onSuccess: async (data) => {
			login(data.data);
			toast.success(data.message);
			await redirectAfterLogin(router, axiosAuth);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

// Freighter can return the signed message as a hex Buffer (older extension
// versions) or a plain string (current) — normalize to the hex string the
// API expects either way.
const getSignatureHex = (signedMessage: string | Buffer | null) => {
	if (!signedMessage) return "";
	if (typeof signedMessage === "string") return signedMessage;
	return Buffer.from(signedMessage).toString("hex");
};

export const useWalletLogin = () => {
	const router = useRouter();
	const axiosAuth = useAxiosAuth();
	const login = useAuthStore((state) => state.login);

	return useMutation({
		mutationFn: async () => {
			// Loaded dynamically since it touches `window` and is only needed
			// for this one, rarely-used sign-in path.
			const freighter = await import("@stellar/freighter-api");

			const connection = await freighter.isConnected();
			if (connection.error || !connection.isConnected) {
				throw new Error(
					"Freighter wallet extension isn't installed. Get it from freighter.app to sign in with your wallet.",
				);
			}

			const access = await freighter.requestAccess();
			if (access.error || !access.address) {
				throw new Error(access.error?.message ?? "Wallet access was denied");
			}

			const address = access.address;

			const { data: nonceRes } = await axiosPublic.post<
				ApiSuccessResponse<{ nonce: string }>
			>(apiRoutes.auth.WALLET_NONCE, { address });

			const nonce = nonceRes.data.nonce;

			const signed = await freighter.signMessage(nonce, { address });
			if (signed.error || !signed.signedMessage) {
				throw new Error(
					signed.error?.message ?? "Failed to sign the wallet nonce",
				);
			}

			const { data } = await axiosPublic.post<
				ApiSuccessResponse<AuthTokensData>
			>(apiRoutes.auth.USE_WALLET, {
				address,
				nonce,
				signature: getSignatureHex(signed.signedMessage),
			});

			return data;
		},
		onSuccess: async (data) => {
			login(data.data);
			toast.success(data.message || "Wallet login successful");
			await redirectAfterLogin(router, axiosAuth);
		},
		onError: (error) => {
			toast.error(
				error instanceof Error ? error.message : getApiErrorMessage(error),
			);
		},
	});
};

export const useForgotPassword = () => {
	return useMutation({
		mutationFn: async (values: { email: string }) => {
			const { data } = await axiosPublic.post<ApiSuccessResponse<unknown>>(
				apiRoutes.auth.FORGOT_PASSWORD,
				values,
			);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useLogoutMutation = () => {
	const router = useRouter();
	const axiosAuth = useAxiosAuth();
	const refreshToken = useAuthStore((state) => state.refreshToken);
	const logout = useAuthStore((state) => state.logout);

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<unknown>>(
				apiRoutes.auth.LOGOUT,
				{ refreshToken },
			);

			return data;
		},
		onSuccess: () => {
			logout();
			toast.success("Logged out successfully");
			router.push(pageRoutes.authRoutes.SIGN_IN);
		},
		onError: () => {
			// Clear local state regardless so the user isn't stuck signed in
			// just because the network call failed.
			logout();
			router.push(pageRoutes.authRoutes.SIGN_IN);
		},
	});
};
