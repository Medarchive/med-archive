export const pageRoutes = {
	HOME: "/",
	authRoutes: {
		SIGN_IN: "/auth/sign-in",
		SIGN_UP: "/auth/sign-up",
		VERIFY_OTP: (email: string) => `/auth/sign-up/verify-otp?email=${email}`,
		PERSONAL_INFO: "/auth/sign-up/personal-info",
		MEDICAL_HISTORY: "/auth/sign-up/medical-history",
		GET_STARTED: "/auth/sign-up/get-started",
		UPLOAD_RECORD: "/auth/sign-up/upload-record",
	},
	dashboardRoutes: {
		DASHBOARD: "/dashboard",
		CARE_ID: "/dashboard/care-id",
		UPLOAD_RECORD: "/dashboard/upload-record",
		PROVIDER_REQUEST: "/dashboard/provider-request",
		MEDICAL_TIMELINE: "/dashboard/medical-timeline",
		WALLET: "/dashboard/wallet",
	},
};
