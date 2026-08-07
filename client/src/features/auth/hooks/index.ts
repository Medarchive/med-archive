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
import { buildFreighterUnavailableError, FreighterUnavailableError } from "../../../lib/utils/freighter";
import { ApiErrorResponse, ApiSuccessResponse, AuthTokensData } from "../../../types/api";

// Login doesn't tell us whether onboarding is complete, so check for an
// existing personal-info record and route accordingly: straight to the
// dashboard if it's actually populated, into the onboarding flow otherwise.
// The endpoint's docs only list 200/401 (no 404), and in practice it
// returns 200 with an empty/null body rather than 404 when nothing has
// been submitted yet — so we can't rely on the request throwing at all,
// we have to check whether the payload is actually there.
const redirectAfterLogin = async (
	router: ReturnType<typeof useRouter>,
	axiosAuth: ReturnType<typeof useAxiosAuth>,
) => {
	try {
		const { data } = await axiosAuth.get<
			ApiSuccessResponse<{ firstName?: string } | null>
		>(apiRoutes.personalInfo);

		const hasPersonalInfo = Boolean(data.data?.firstName);
		router.push(
			hasPersonalInfo
				? pageRoutes.dashboardRoutes.DASHBOARD
				: pageRoutes.authRoutes.PERSONAL_INFO,
		);
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

			console.log(data);
			return data;
		},
		onSuccess: (data, variables) => {
			toast.success(data.message);
			console.log(data);
			router.push(pageRoutes.authRoutes.VERIFY_OTP(variables.email));
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
			console.log(error);
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

// POST /auth/login's docs list a single 401 for *both* "invalid credentials"
// and "email not verified" — same status code, no separate error code, the
// only thing that can possibly tell them apart is the message text. (If the
// backend sends its now-familiar empty error body here too, this can't
// fire and login just falls through to the generic invalid-credentials
// toast — a backend-side limitation, not something fixable from here.)
const UNVERIFIED_EMAIL_PATTERN = /not verified|unverified|verify.*email/i;

const isUnverifiedEmailError = (error: unknown) => {
	if (!isAxiosError<ApiErrorResponse>(error) || error.response?.status !== 401) {
		return false;
	}

	const message = error.response.data?.message;
	const text = Array.isArray(message) ? message.join(" ") : message;

	return !!text && UNVERIFIED_EMAIL_PATTERN.test(text);
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
		onError: (error, variables) => {
			if (isUnverifiedEmailError(error)) {
				toast.message("Please verify your email to continue");

				// A fresh code, since whatever was sent at registration may
				// well have expired by now — best-effort, login should still
				// redirect to the verify screen even if this fails (they can
				// hit "Resend" manually there).
				axiosPublic
					.post(apiRoutes.auth.RESEND_OTP, { email: variables.email })
					.catch(() => {});

				router.push(pageRoutes.authRoutes.VERIFY_OTP(variables.email));
				return;
			}

			// The backend responds to bad credentials with a 401 and an empty
			// body (no `message`), so the generic fallback would otherwise show
			// — give login specifically a fallback that actually tells the
			// user what went wrong.
			const status = isAxiosError(error) ? error.response?.status : undefined;
			toast.error(
				getApiErrorMessage(
					error,
					status === 401 ? "Invalid email or password" : undefined,
				),
			);
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
				throw buildFreighterUnavailableError();
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
			if (error instanceof FreighterUnavailableError) {
				toast.error(error.message, {
					action: {
						label: error.installLabel,
						onClick: () => window.open(error.installUrl, "_blank", "noopener,noreferrer"),
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

export const useResetPassword = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: async (values: { token: string; newPassword: string }) => {
			const { data } = await axiosPublic.post<ApiSuccessResponse<unknown>>(
				apiRoutes.auth.RESET_PASSWORD,
				values,
			);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Password reset successfully");
			router.push(pageRoutes.authRoutes.SIGN_IN);
		},
		onError: (error) => {
			// The token expires in 15 minutes, so a 400 here is very likely
			// "Invalid or expired token" — the backend's own message already
			// says exactly that, just surface it as-is.
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
