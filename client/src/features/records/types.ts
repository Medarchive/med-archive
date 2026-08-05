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
export type ProofStatus = "PENDING" | "VERIFIED" | "FAILED";

export interface RecordFile {
	id: string;
	url: string;
}

export interface HealthRecordData {
	id: string;
	title: string;
	recordType: RecordType;
	recordDate?: string | null;
	description?: string | null;
	files: RecordFile[];
	createdAt: string;
	updatedAt: string;
	// Type-specific fields — present depending on `recordType`.
	testName?: string;
	referredBy?: string;
	prescribedBy?: string;
	drugClass?: string;
	drug?: string;
	dosage?: string;
	frequency?: string;
	endDate?: string | null;
	allergyType?: AllergyType;
	cause?: string;
	management?: string;
}

export interface RecordProofData {
	// Widened past the known ProofStatus union since the API doesn't
	// document the actual set of values — render defensively.
	proofStatus: ProofStatus | (string & {});
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
