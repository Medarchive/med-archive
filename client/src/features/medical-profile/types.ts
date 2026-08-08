import { ConditionData } from "../med-history/types";

// Confirmed against a real GET /api/v1/medical-profile response. Two
// corrections from the earlier guessed shape: `heightCm`/`weightKg` come
// back as decimal-formatted strings ("150.00"), not numbers — harmless
// everywhere they're currently read (String()/template-literal usages
// coerce fine either way) but now typed accurately. And the conditions
// field is named `conditions`, not `activeConditions`, and holds full
// condition objects (same shape as /api/v1/medical-conditions), not an
// array of IDs/strings.
export type BloodGroup =
	| "A_POSITIVE"
	| "A_NEGATIVE"
	| "B_POSITIVE"
	| "B_NEGATIVE"
	| "AB_POSITIVE"
	| "AB_NEGATIVE"
	| "O_POSITIVE"
	| "O_NEGATIVE";

export type Genotype = "AA" | "AS" | "SS" | "AC" | "SC";

export interface MedicalProfileData {
	bloodGroup?: BloodGroup;
	genotype?: Genotype;
	heightCm?: string;
	weightKg?: string;
	currentlyTakingMedication?: boolean;
	conditions?: ConditionData[];
	updatedAt?: string;
}

export interface UpdateMedicalProfilePayload {
	bloodGroup?: BloodGroup;
	genotype?: Genotype;
	heightCm?: number;
	weightKg?: number;
	currentlyTakingMedication?: boolean;
}

export const bloodGroupLabels: Record<BloodGroup, string> = {
	A_POSITIVE: "A+",
	A_NEGATIVE: "A-",
	B_POSITIVE: "B+",
	B_NEGATIVE: "B-",
	AB_POSITIVE: "AB+",
	AB_NEGATIVE: "AB-",
	O_POSITIVE: "O+",
	O_NEGATIVE: "O-",
};
