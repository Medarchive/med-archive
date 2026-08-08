export type RequestStatus = "PENDING" | "APPROVED" | "DECLINED";

// Confirmed against a real GET /health-records/access-requests response
// (the patient's own inbox). This is a DIFFERENT shape from the admin
// oversight endpoint (GET /admin/access-requests, see
// features/admin/types.ts's AdminAccessRequestData) — flat provider fields
// enriched for the patient's trust decision (name, picture, org, type),
// no nested patient/provider objects, no recordId. Don't assume these two
// endpoints share a DTO — confirmed they don't.
export interface AccessRequestData {
	id: string;
	patientId: string;
	providerId: string;
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
