import { ClinicalProofType } from "../clinical-proofs/types";

export type RequestStatus = "PENDING" | "APPROVED" | "DECLINED" | "REVOKED";

// GET /health-records/access-requests (the patient's own inbox). This is a
// DIFFERENT shape from the admin oversight endpoint (GET
// /admin/access-requests, see features/admin/types.ts's
// AdminAccessRequestData) — flat provider fields enriched for the patient's
// trust decision (name, picture, org, type), no nested patient/provider
// objects. Don't assume these two endpoints share a DTO — confirmed they
// don't.
//
// A request targets at most one of: a specific record (`record`), a
// clinical disclosure proof (`proofType`), or neither — a general request
// described only by `requestType`. `record` replaced the old bare
// `recordId`; the spec gives no response schema for this endpoint, so both
// new fields are typed optional until confirmed against a live response.
export interface AccessRequestData {
	id: string;
	patientId: string;
	providerId: string;
	record?: {
		id: string;
		title: string;
	} | null;
	proofType?: ClinicalProofType | null;
	requestType: string;
	note: string | null;
	status: RequestStatus;
	createdAt: string;
	updatedAt: string;
	providerName: string;
	// Presigned S3 URL — expires, so don't cache/store it past this fetch.
	providerProfilePictureUrl?: string | null;
	organizationName?: string | null;
	providerType?: string | null;
}
