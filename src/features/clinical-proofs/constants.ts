import { ClinicalProofType } from "./types";

// Display names for the proof types GET /clinical-proofs/types returns.
export const CLINICAL_PROOF_TYPE_LABELS: Record<ClinicalProofType, string> = {
	DIAGNOSIS_CATEGORY: "Diagnosis category",
	ALLERGY_CONFIRMATION: "Allergy confirmation",
	PRIOR_PRESCRIPTION_PATTERN: "Prior prescription pattern",
	BLOOD_GROUP: "Blood group",
	GENOTYPE: "Genotype",
	CHRONIC_CONDITION: "Chronic condition",
};

export const getClinicalProofTypeLabel = (proofType: string) =>
	CLINICAL_PROOF_TYPE_LABELS[proofType as ClinicalProofType] ?? proofType;
