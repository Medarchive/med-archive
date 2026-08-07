import { UserRole } from "../../types/api";

// None of these response shapes are detailed in the OpenAPI spec beyond the
// endpoint's existence and its pagination/filter params — same situation as
// WalletTransaction/RecordProofData elsewhere in this codebase. Best-guess
// field names below; kept loose and rendered defensively, adjust once real
// responses have been seen.

// Confirmed against a real GET /admin/stats response.
export interface AdminStatsData {
	users: {
		patients: number;
		providers: number;
		admins: number;
	};
	wallets: number;
	pendingProviderVerifications: number;
	pendingAccessRequests: number;
}

export type Gender = "MALE" | "FEMALE";

// Confirmed against a real GET /users (admin list) response — deliberately
// separate from types/api.ts's UserProfileData (used for /users/me): this
// endpoint's rows carry no walletAddress or nested profile at all, but do
// carry gender, which /users/me's documented shape doesn't mention. The
// docs claim GET /users/{id} (admin detail) additionally returns
// walletAddress/profile — unconfirmed with a real response yet, so not
// modeled here until one's been seen.
export interface AdminUserSummary {
	id: string;
	fullName: string;
	email: string;
	phone: string | null;
	role: UserRole;
	gender: Gender | null;
	emailVerifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export interface InviteData {
	id: string;
	email: string;
	name: string;
	status?: InviteStatus | (string & {});
	createdAt: string;
	expiresAt?: string | null;
}

// Confirmed against a real GET /admin/wallets response — no balance and no
// embedded owner name/email, just a userId to cross-reference against the
// users list (there's no join). Rendered without a "Balance" column as a
// result — nothing populates it.
export interface AdminWalletSummary {
	id: string;
	userId: string;
	address: string;
	network: string;
	label: string | null;
	verifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

// Confirmed against a real GET /admin/activity-logs response — no
// userEmail/description, just userId + an action code (LOGIN,
// WALLET_LINKED, WALLET_REMOVED confirmed so far, likely not exhaustive)
// plus action-specific metadata and an (currently always-null-in-practice)
// ipAddress.
export interface ActivityLogEntry {
	id: string;
	userId: string;
	action: "LOGIN" | "WALLET_LINKED" | "WALLET_REMOVED" | (string & {});
	metadata: Record<string, unknown> | null;
	ipAddress: string | null;
	createdAt: string;
}
