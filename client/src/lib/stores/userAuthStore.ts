import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthTokensData, UserProfileData } from "../../types/api";

const ACCESS_TOKEN_COOKIE = "ma_access_token";
const REFRESH_TOKEN_COOKIE = "ma_refresh_token";
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

// The API is a separate origin with no way for this app to set httpOnly
// cookies, so the tokens have to live in a cookie the client can read to
// attach the Authorization header itself.
const cookieOptions = { secure: true, sameSite: "strict" as const };

interface AuthState {
	user: UserProfileData | null;
	accessToken: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isInitialized: boolean;
	login: (tokens: AuthTokensData, user?: UserProfileData) => void;
	setTokens: (tokens: AuthTokensData) => void;
	setUser: (user: UserProfileData) => void;
	logout: () => void;
	initializeAuth: () => void;
}

const persistTokens = (tokens: AuthTokensData) => {
	Cookies.set(ACCESS_TOKEN_COOKIE, tokens.accessToken, {
		...cookieOptions,
		expires: tokens.expiresIn / 86400,
	});
	Cookies.set(REFRESH_TOKEN_COOKIE, tokens.refreshToken, {
		...cookieOptions,
		expires: REFRESH_TOKEN_EXPIRES_DAYS,
	});
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	isInitialized: false,

	login: (tokens, user) => {
		persistTokens(tokens);
		set({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken,
			user: user ?? null,
			isAuthenticated: true,
		});
	},

	setTokens: (tokens) => {
		persistTokens(tokens);
		set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
	},

	setUser: (user) => set({ user }),

	logout: () => {
		Cookies.remove(ACCESS_TOKEN_COOKIE);
		Cookies.remove(REFRESH_TOKEN_COOKIE);
		set({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
		});
	},

	initializeAuth: () => {
		const accessToken = Cookies.get(ACCESS_TOKEN_COOKIE) ?? null;
		const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE) ?? null;

		set({
			accessToken,
			refreshToken,
			isAuthenticated: !!accessToken,
			isInitialized: true,
		});
	},
}));

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useLogout = () => useAuthStore((state) => state.logout);
