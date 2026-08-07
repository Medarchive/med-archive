export const apiRoutes = {
	health: "/health",

	auth: {
		REGISTER: "/api/v1/auth/register",
		LOGIN: "/api/v1/auth/login",
		VALIDATE_OTP: "/api/v1/auth/validate-otp",
		RESEND_OTP: "/api/v1/auth/resend-otp",
		FORGOT_PASSWORD: "/api/v1/auth/forgot-password",
		RESET_PASSWORD: "/api/v1/auth/reset-password",
		WALLET_NONCE: "/api/v1/auth/wallet-nonce",
		USE_WALLET: "/api/v1/auth/use-wallet",
		REFRESH: "/api/v1/auth/refresh",
		ACTIVATE: "/api/v1/auth/activate",
		LOGOUT: "/api/v1/auth/logout",
	},

	activity: "/api/v1/activity",

	wallet: {
		BASE: "/api/v1/wallet",
		VERIFY: "/api/v1/wallet/verify",
		TRANSACTIONS: "/api/v1/wallet/transactions",
	},

	users: {
		ME: "/api/v1/users/me",
		LIST: "/api/v1/users",
		BY_ID: (id: string) => `/api/v1/users/${id}`,
		VERIFY_PROVIDER: (id: string) => `/api/v1/users/${id}/verify-provider`,
	},

	admin: {
		STATS: "/api/v1/admin/stats",
		DELETE_USER: (id: string) => `/api/v1/admin/users/${id}`,
		INVITES: "/api/v1/admin/invites",
		INVITE_BY_ID: (id: string) => `/api/v1/admin/invites/${id}`,
		ACCESS_REQUESTS: "/api/v1/admin/access-requests",
		WALLETS: "/api/v1/admin/wallets",
		ACTIVITY_LOGS: "/api/v1/admin/activity-logs",
		BROADCAST_NOTIFICATION: "/api/v1/admin/notifications/broadcast",
	},

	personalInfo: "/api/v1/personal-info",
	medHistory: "/api/v1/med-history",
	medicalConditions: "/api/v1/medical-conditions",
	medicalProfile: "/api/v1/medical-profile",
	dashboard: "/api/v1/dashboard",

	careId: {
		BASE: "/api/v1/care-id",
		SHARE_LINK: "/api/v1/care-id/share-link",
		VIEW: (token: string) => `/api/v1/care-id/view/${token}`,
	},

	healthRecords: {
		BASE: "/api/v1/health-records",
		BY_ID: (id: string) => `/api/v1/health-records/${id}`,
		PROOF: (id: string) => `/api/v1/health-records/${id}/proof`,
		VERIFY_PROOF: (id: string) => `/api/v1/health-records/${id}/verify-proof`,
		ACCESS_REQUESTS: "/api/v1/health-records/access-requests",
		ACCESS_REQUEST_BY_ID: (id: string) =>
			`/api/v1/health-records/access-requests/${id}`,
	},

	emergencyContacts: {
		BASE: "/api/v1/emergency-contacts",
		BY_ID: (id: string) => `/api/v1/emergency-contacts/${id}`,
	},

	providerProfile: {
		BASE: "/api/v1/provider/profile",
		PICTURE: "/api/v1/provider/profile/picture",
		PATIENT_RECORDS: "/api/v1/provider/profile/patients/records",
		RECORD_REQUESTS: "/api/v1/provider/profile/record-requests",
	},

	notifications: {
		BASE: "/api/v1/notifications",
		BY_ID: (id: string) => `/api/v1/notifications/${id}`,
	},
};
