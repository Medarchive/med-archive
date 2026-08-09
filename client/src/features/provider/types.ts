import { HealthRecordData } from "../records/types";
import { RequestStatus } from "../provider-request/types";

// Confirmed against a real GET /provider/profile response.
export type ProviderType =
	| "LAB"
	| "HOSPITAL"
	| "CLINIC"
	| "PHARMACY"
	| "SPECIALIST"
	| "OTHER";

export interface ProviderProfileData {
	id: string;
	userId: string;
	title?: string | null;
	firstName?: string | null;
	lastName?: string | null;
	organizationName?: string | null;
	workAddress?: string | null;
	providerType?: ProviderType | null;
	specialty?: string | null;
	licenseNumber?: string | null;
	// Presigned S3 URL — expires, so don't cache/store it past this fetch.
	profilePictureUrl?: string | null;
	profilePictureS3Key?: string | null;
	verifiedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface UpdateProviderProfilePayload {
	title?: string;
	firstName?: string;
	lastName?: string;
	organizationName?: string;
	workAddress?: string;
	providerType?: ProviderType;
	specialty?: string;
	licenseNumber?: string;
}

// Confirmed against a real GET /provider/profile/patients/records
// response — identity is nested under `patient`, not flattened, and it
// only carries id/fullName/email (no careId). `records` matches
// HealthRecordData field-for-field, same resource used everywhere else in
// the app, just pre-filtered to what's been approved.
export interface PatientLookupResult {
	patient: {
		id: string;
		fullName: string;
		email: string;
	};
	records: HealthRecordData[];
}

export interface RequestRecordAccessPayload {
	patientId?: string;
	careId?: string;
	email?: string;
	recordId?: string;
	requestType: string;
	note?: string;
}

// Response schema for POST /provider/profile/record-requests isn't detailed
// either — best guess, matching the shape of the patient-facing
// AccessRequestData this presumably becomes once the patient sees it.
export interface ProviderRecordRequestData {
	id: string;
	status: RequestStatus;
	requestType: string;
	note?: string | null;
	createdAt: string;
	updatedAt?: string;
	// Revoked requests deliberately retain their audit row, while the backend
	// returns `record: null` so the provider cannot read record data.
	record: HealthRecordData | null;
	patient?: {
		id: string;
		fullName?: string;
		email?: string;
	} | null;
}
