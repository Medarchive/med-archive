// Built from the OpenAPI examples for /clinical-proofs — not yet confirmed
// against a real response.
export type ClinicalProofType =
	| "DIAGNOSIS_CATEGORY"
	| "ALLERGY_CONFIRMATION"
	| "PRIOR_PRESCRIPTION_PATTERN"
	| "BLOOD_GROUP"
	| "GENOTYPE"
	| "CHRONIC_CONDITION";

export type ClinicalProofStatus = "PENDING" | "GENERATED" | "FAILED";

// The claim the patient chooses to disclose. Its shape depends on the proof
// type, and the backend rejects it (400) unless it's true for the patient's
// own records — see CreateClinicalProofDto in the API docs.
export type ClinicalProofClaim =
	| { category: "DISEASE" | "ALLERGY" | "CONDITION" } // DIAGNOSIS_CATEGORY
	| { healthRecordId: string } // ALLERGY_CONFIRMATION — an ALLERGY-type record
	| { drugClass: string } // PRIOR_PRESCRIPTION_PATTERN
	| { bloodGroup: string } // BLOOD_GROUP — must match the medical profile
	| { genotype: string } // GENOTYPE — must match the medical profile
	| { conditionId: string; hasCondition: boolean }; // CHRONIC_CONDITION

export interface CreateClinicalProofPayload {
	proofType: ClinicalProofType;
	claimData: ClinicalProofClaim;
}

// List/dashboard rows omit userId and commitment; GET /clinical-proofs/:id
// adds `commitment` once GENERATED, or `error` once FAILED.
export interface ClinicalProofData {
	id: string;
	userId?: string;
	proofType: ClinicalProofType;
	claimData: Record<string, unknown>;
	status: ClinicalProofStatus;
	commitment?: string | null;
	error?: string | null;
	generatedAt: string | null;
	createdAt: string;
}

// POST /provider/profile/clinical-proofs/:proofId/verify. `valid` can be
// false even on a 200 — the proof was checked, it just didn't hold.
export interface ClinicalProofVerification {
	valid: boolean;
	proofType: ClinicalProofType;
	claimData: Record<string, unknown>;
}
