import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from "axios";
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

// ---------------------------------------------------------------------
// Console logging for every API call, success or error — every request
// this app makes goes through axiosPublic/axiosAuth, so hooking logging
// in here is enough to cover the whole app. Useful for catching and
// reporting real backend bugs (500s, unexpected validation errors, etc.)
// without having to dig through the Network tab each time.
// ---------------------------------------------------------------------
type TimedConfig = InternalAxiosRequestConfig & { __startedAt?: number };

const REDACTED_KEYS = [
	"password",
	"newPassword",
	"currentPassword",
	"confirmPassword",
	"signature",
];

// Don't print raw passwords/signatures to the console even though this is
// dev-facing logging.
const redact = (data: unknown) => {
	if (!data || typeof data !== "object") return data;
	if (typeof FormData !== "undefined" && data instanceof FormData) {
		return "[FormData]";
	}

	const clone = { ...(data as Record<string, unknown>) };
	for (const key of REDACTED_KEYS) {
		if (key in clone) clone[key] = "••••••";
	}
	return clone;
};

// Registered as the *first* interceptor on each instance (attached right
// after axios.create, before the auth/refresh interceptors below) so it
// sits innermost: it sees and logs the original request/response of every
// HTTP call axios actually makes, including a 401 that later gets silently
// retried after a token refresh — that retry is a separate logged call,
// rather than the 401 being swallowed and never logged at all.
const attachApiLogging = (instance: AxiosInstance, label: string) => {
	instance.interceptors.request.use((config) => {
		(config as TimedConfig).__startedAt = Date.now();
		return config;
	});

	instance.interceptors.response.use(
		(response) => {
			const config = response.config as TimedConfig;
			const duration = config.__startedAt ? Date.now() - config.__startedAt : undefined;

			console.groupCollapsed(
				`%c[api:${label}] %c${response.status} %c${(config.method ?? "get").toUpperCase()} ${config.url}%c ${duration ?? "?"}ms`,
				"color:#9B9B9B",
				"color:#16a34a;font-weight:600",
				"color:inherit",
				"color:#9B9B9B",
			);
			if (config.data) console.log("request:", redact(config.data));
			if (config.params) console.log("params:", config.params);
			console.log("response:", response.data);
			console.groupEnd();

			return response;
		},
		(error: AxiosError) => {
			const config = error.config as TimedConfig | undefined;
			const duration = config?.__startedAt ? Date.now() - config.__startedAt : undefined;

			console.groupCollapsed(
				`%c[api:${label}] %c${error.response?.status ?? "ERR"} %c${(config?.method ?? "?").toUpperCase()} ${config?.url ?? "unknown"}%c ${duration ?? "?"}ms`,
				"color:#9B9B9B",
				"color:#dc2626;font-weight:600",
				"color:inherit",
				"color:#9B9B9B",
			);
			if (config?.data) console.log("request:", redact(config.data));
			if (config?.params) console.log("params:", config.params);
			console.error("error response:", error.response?.data ?? error.message);
			console.groupEnd();

			return Promise.reject(error);
		},
	);
};

attachApiLogging(axiosPublic, "public");
attachApiLogging(axiosAuth, "auth");

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
