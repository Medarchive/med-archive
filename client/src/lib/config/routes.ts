export const pageRoutes = {
	HOME: "/",
	authRoutes: {
		SIGN_IN: "/auth/sign-in",
		SIGN_UP: "/auth/sign-up",
		FORGOT_PASSWORD: "/auth/forgot-password",
		RESET_PASSWORD: "/auth/reset-password",
		// encodeURIComponent matters here — a literal "+" in a query string
		// means "space" per application/x-www-form-urlencoded, so an
		// unencoded "tag+test@example.com" comes back as "tag test@example.com"
		// on the other end. Must be %2B, not a bare "+".
		VERIFY_OTP: (email: string) => `/auth/sign-up/verify-otp?email=${encodeURIComponent(email)}`,
		PERSONAL_INFO: "/auth/sign-up/personal-info",
		MEDICAL_PROFILE: "/auth/sign-up/medical-profile",
		GET_STARTED: "/auth/sign-up/get-started",
		UPLOAD_RECORD: "/auth/sign-up/upload-record",
	},
	dashboardRoutes: {
		DASHBOARD: "/dashboard",
		PROFILE: "/dashboard/profile",
		CARE_ID: "/dashboard/care-id",
		RECORDS: "/dashboard/records",
		PROVIDER_REQUEST: "/dashboard/provider-request",
		MEDICAL_TIMELINE: "/dashboard/medical-timeline",
		WALLET: "/dashboard/wallet",
	},
};
