import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../stores/userAuthStore";
import { apiRoutes } from "./apiRoutes";
import { pageRoutes } from "./routes";
import { ApiSuccessResponse, AuthTokensData } from "../../types/api";

// Same-origin proxy (see src/app/api/proxy/[...path]/route.ts) — the real
// API host and the HMAC signing secret it requires both live server-side
// only. The browser never talks to host.medarchive.africa directly.
const PROXY_BASE_URL = "/api/proxy";

// No auth header — for register/login/otp/etc, and for the token refresh
// call itself (must not go through axiosAuth or a failed refresh loops).
export const axiosPublic = axios.create({
	baseURL: PROXY_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

// Attaches the bearer token and retries once with a refreshed token on 401.
export const axiosAuth = axios.create({
	baseURL: PROXY_BASE_URL,
	headers: { "Content-Type": "application/json" },
});

axiosAuth.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

// Shared across concurrent 401s so a burst of requests triggers one refresh
// call instead of one per request.
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async () => {
	const refreshToken = useAuthStore.getState().refreshToken;

	if (!refreshToken) return null;

	try {
		const { data } = await axiosPublic.post<ApiSuccessResponse<AuthTokensData>>(
			apiRoutes.auth.REFRESH,
			{ refreshToken },
		);

		useAuthStore.getState().setTokens(data.data);
		return data.data.accessToken;
	} catch {
		useAuthStore.getState().logout();
		return null;
	}
};

axiosAuth.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as
			| (InternalAxiosRequestConfig & { _retry?: boolean })
			| undefined;

		if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			refreshPromise ??= refreshAccessToken().finally(() => {
				refreshPromise = null;
			});

			const newToken = await refreshPromise;

			if (newToken) {
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axiosAuth(originalRequest);
			}

			if (typeof window !== "undefined") {
				window.location.href = pageRoutes.authRoutes.SIGN_IN;
			}
		}

		return Promise.reject(error);
	},
);
