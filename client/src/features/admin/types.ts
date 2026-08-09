import { UserRole } from "../../types/api";
import { RequestStatus } from "../provider-request/types";

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

// Only meaningful for PROVIDER rows — null for patients/admins. Added to
// GET /users (admin list) after this type was first modeled; confirmed by
// the user directly (not yet seen in a pasted raw response), so trusted the
// same way a real response would be.
export type AdminProviderStatus = "VERIFIED" | "PENDING" | null;

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
	providerStatus: AdminProviderStatus;
	emailVerifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

// Confirmed against a real GET /admin/invites response. "PENDING" is
// inferred (the natural pre-acceptance state) — only "USED" has actually
// been observed so far. No userId/acceptedUserId field — an accepted
// invite has to be cross-referenced against the users list by email if you
// need the resulting account.
export type InviteStatus = "PENDING" | "USED" | (string & {});

export interface InviteData {
	id: string;
	email: string;
	name: string;
	status: InviteStatus;
	expiresAt: string;
	usedAt: string | null;
	createdById: string;
	createdAt: string;
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

// Confirmed against a real GET /admin/access-requests response — a
// different shape from the patient-side inbox
// (features/provider-request/types.ts's AccessRequestData): nested
// patient/provider identity objects (id/fullName/email only, no
// profile-picture/organization/type enrichment), plus a recordId the
// patient-facing shape doesn't have. Confirmed these two endpoints do NOT
// share one DTO despite representing the same underlying resource.
export interface AdminAccessRequestData {
	id: string;
	patientId: string;
	providerId: string;
	recordId: string | null;
	requestType: string;
	note: string | null;
	status: RequestStatus;
	createdAt: string;
	updatedAt: string;
	patient: {
		id: string;
		fullName: string;
		email: string;
	};
	provider: {
		id: string;
		fullName: string;
		email: string;
	};
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
