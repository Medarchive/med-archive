import { create } from "zustand";
import Cookies from "js-cookie";
import { getQueryClient } from "../../components/providers/ReactQueryProvider";
import { AuthTokensData, UserProfileData } from "../../types/api";

const ACCESS_TOKEN_COOKIE = "ma_access_token";
const REFRESH_TOKEN_COOKIE = "ma_refresh_token";
const SESSION_EXPIRES_AT_COOKIE = "ma_session_expires_at";

// This is a medical records app — sessions are capped at 1 day *from login*,
// full stop, regardless of activity. A token refresh keeps the user signed
// in for the rest of that window but never pushes the cap further out; once
// it passes, they must re-enter their password. Don't "helpfully" bump this
// on refresh — that would silently turn it back into an indefinitely
// renewable session, which is exactly what this is guarding against.
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

// The API is a separate origin with no way for this app to set httpOnly
// cookies, so the tokens have to live in a cookie the client can read to
// attach the Authorization header itself.
const cookieOptions = { secure: true, sameSite: "strict" as const };

const msToDays = (ms: number) => ms / 86_400_000;

interface AuthState {
	user: UserProfileData | null;
	accessToken: string | null;
	refreshToken: string | null;
	sessionExpiresAt: number | null;
	isAuthenticated: boolean;
	isInitialized: boolean;
	login: (tokens: AuthTokensData, user?: UserProfileData) => void;
	setTokens: (tokens: AuthTokensData) => void;
	setUser: (user: UserProfileData) => void;
	logout: () => void;
	initializeAuth: () => void;
}

// `isNewLogin: true` starts a fresh 1-day clock (real sign-in). `false`
// (a token refresh) reuses whatever's already on the clock — capped to
// however much of the original day is left, never extended.
const persistTokens = (tokens: AuthTokensData, isNewLogin: boolean) => {
	const existingExpiry = Number(Cookies.get(SESSION_EXPIRES_AT_COOKIE));
	const sessionExpiresAt =
		isNewLogin || !existingExpiry ? Date.now() + SESSION_MAX_AGE_MS : existingExpiry;

	const remainingMs = Math.max(sessionExpiresAt - Date.now(), 0);
	const remainingDays = msToDays(remainingMs);

	Cookies.set(SESSION_EXPIRES_AT_COOKIE, String(sessionExpiresAt), {
		...cookieOptions,
		expires: remainingDays,
	});
	Cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
		...cookieOptions,
		expires: Math.min(msToDays(tokens.expiresIn * 1000), remainingDays),
	});
	Cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
		...cookieOptions,
		expires: remainingDays,
	});

	return sessionExpiresAt;
};

// Every trace of the signed-out user, from wherever logout was triggered
// (the Logout button, a failed silent refresh, an expired session found at
// boot) — cookies, in-memory auth state, and the React Query cache. Medical
// records are sensitive enough that nothing from one account should be
// visible, even briefly, after that account signs out (e.g. a second person
// using the same device+browser right after).
const clearSession = () => {
	Cookies.remove(ACCESS_TOKEN_COOKIE);
	Cookies.remove(REFRESH_TOKEN_COOKIE);
	Cookies.remove(SESSION_EXPIRES_AT_COOKIE);

	getQueryClient().clear();

	if (typeof window !== "undefined") {
		window.sessionStorage.clear();
		window.localStorage.clear();
	}
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	sessionExpiresAt: null,
	isAuthenticated: false,
	isInitialized: false,

	login: (tokens, user) => {
		const sessionExpiresAt = persistTokens(tokens, true);
		set({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			sessionExpiresAt,
			user: user ?? null,
			isAuthenticated: true,
		});
	},

	setTokens: (tokens) => {
		const sessionExpiresAt = persistTokens(tokens, false);
		set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, sessionExpiresAt });
	},

	setUser: (user) => set({ user }),

	logout: () => {
		clearSession();
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			sessionExpiresAt: null,
			isAuthenticated: false,
		});
	},

	initializeAuth: () => {
		const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
		const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;
		const sessionExpiresAt = Number(Cookies.get(SESSION_EXPIRES_AT_COOKIE)) || null;

		// Belt-and-suspenders: the cookies themselves carry a matching
		// `expires`, so the browser normally clears them on its own — but if
		// the tab's been open continuously since before the cap, the cookie
		// jar won't self-update mid-session, so check the timestamp directly
		// too rather than trusting the cookies' mere presence.
		if (sessionExpiresAt && sessionExpiresAt <= Date.now()) {
			clearSession();
			set({
				user: null,
				accessToken: null,
				refreshToken: null,
				sessionExpiresAt: null,
				isAuthenticated: false,
				isInitialized: true,
			});
			return;
		}

		set({
			accessToken,
			refreshToken,
			sessionExpiresAt,
			isAuthenticated: !!accessToken,
			isInitialized: true,
		});
	},
}));

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useLogout = () => useAuthStore((state) => state.logout);
