// Confirmed against the live OpenAPI spec (GET/PATCH /api/v1/medical-profile)
// — field names/enums match the PATCH DTO exactly. GET's `data` schema isn't
// explicitly typed in the spec (generic object), but a profile GET/PATCH
// pair sharing one shape is the safe assumption; adjust if a real GET
// response turns out to differ.
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
	heightCm?: number;
	weightKg?: number;
	currentlyTakingMedication?: boolean;
	// "Active conditions" is part of this endpoint's stated description, but
	// /api/v1/medical-conditions (its natural source) is documented as
	// "Stub — not yet implemented" on the backend — this field may just
	// never be populated until that lands. Key name is an undocumented guess.
	activeConditions?: string[];
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
