export type RecordType =
	| "BLOOD_TEST"
	| "LAB_TEST"
	| "PRESCRIPTION"
	| "MEDICATION"
	| "ALLERGY"
	| "SCAN"
	| "REPORT"
	| "OTHER";

export type AllergyType =
	| "FOOD"
	| "DRUG"
	| "ENVIRONMENTAL"
	| "INSECT"
	| "LATEX"
	| "OTHER";

// The API docs don't actually define a proofStatus enum (the endpoint's
// response schema is just the generic envelope with no data shape) — these
// are our best-guess known values, but treat any other string as possible
// too rather than assuming this is exhaustive.
export type ProofStatus = "PENDING" | "GENERATED" | "FAILED";

// Matches a real GET /api/v1/health-records response exactly (confirmed
// against a live sample, not just the OpenAPI spec — that endpoint's data
// schema wasn't detailed there either).
export interface RecordFile {
	id: string;
	healthRecordId: string;
	fileName: string;
	fileType: string;
	fileSize: number;
	s3Key: string;
	// Presigned S3 URL — expires (fileUrlExpiresAt), so don't cache/store it
	// past this fetch.
	fileUrl: string;
	fileUrlExpiresAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface HealthRecordData {
	id: string;
	userId: string;
	title: string;
	recordType: RecordType;
	recordDate?: string | null;
	description?: string | null;
	zkVerified: boolean;
	files: RecordFile[];
	createdAt: string;
	updatedAt: string;
	// Type-specific fields — present depending on `recordType`, null (not
	// undefined) when not applicable.
	testName?: string | null;
	referredBy?: string | null;
	prescribedBy?: string | null;
	drugClass?: string | null;
	drug?: string | null;
	dosage?: string | null;
	frequency?: string | null;
	endDate?: string | null;
	allergyType?: AllergyType | null;
	cause?: string | null;
	management?: string | null;
}

export interface RecordProofData {
	// Widened past the known ProofStatus union since the API doesn't
	// document the actual set of values — render defensively.
	proofStatus?: ProofStatus | (string & {});
	// The proof worker has used both names across API versions. Accept either
	// field so a valid GENERATED status never renders as "Unknown".
	status?: ProofStatus | (string & {});
	zkProofStatus?: ProofStatus | (string & {});
	proofHash?: string;
	generatedAt?: string;
}

export interface FieldConfig {
	key: string;
	label: string;
}

// The "primary" type-specific field shown as the second table column and
// modal detail for each record type, plus the tab label.
export const recordTypeConfig: Record<
	RecordType,
	{ tabLabel: string; primaryField?: FieldConfig }
> = {
	LAB_TEST: { tabLabel: "Lab Test", primaryField: { key: "testName", label: "Test Name" } },
	PRESCRIPTION: { tabLabel: "Prescription", primaryField: { key: "drugClass", label: "Drug Class" } },
	MEDICATION: { tabLabel: "Medication", primaryField: { key: "drug", label: "Drug" } },
	ALLERGY: { tabLabel: "Allergy", primaryField: { key: "cause", label: "Cause" } },
	BLOOD_TEST: { tabLabel: "Blood Test" },
	SCAN: { tabLabel: "Scan" },
	REPORT: { tabLabel: "Report" },
	OTHER: { tabLabel: "Other" },
};

export const recordTypeOrder: RecordType[] = [
	"LAB_TEST",
	"BLOOD_TEST",
	"PRESCRIPTION",
	"MEDICATION",
	"ALLERGY",
	"SCAN",
	"REPORT",
	"OTHER",
];
