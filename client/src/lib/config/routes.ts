export const pageRoutes = {
	authRoutes: {
		SIGN_IN: "/auth/sign-in",
		SIGN_UP: "/auth/sign-up",
		VERIFY_OTP: (email: string) => `/auth/sign-up/verify-otp?email=${email}`,
	},
};
