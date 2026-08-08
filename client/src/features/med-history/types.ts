// Confirmed against the live OpenAPI spec for POST/PATCH/DELETE
// /api/v1/med-history. `conditionIds` references records from
// /api/v1/medical-conditions — GET on that path is now real ("List all
// active medical conditions", not admin-gated), though the individual
// condition object's schema still isn't detailed in the spec. Best-guess
// fields below, same treatment as other unconfirmed response shapes
// elsewhere in this codebase.
export interface UpdateMedHistoryPayload {
	conditionIds: string[];
	currentlyTakingMedication: boolean;
}

// Confirmed against a real GET /api/v1/medical-conditions response — full
// shape below is real, not guessed. `category` was separately confirmed via
// the live CreateMedicalConditionDto schema (a real 400's error text named
// the field but not its values, so the docs were pulled to get the actual
// enum). `description` is confirmed rejected outright on create ("property
// description should not exist") — not just unsupported, real evidence this
// resource doesn't have one at all. Dropped from the read shape too.
export type ConditionCategory = "DISEASE" | "ALLERGY" | "CONDITION";

export interface ConditionData {
	id: string;
	name: string;
	category: ConditionCategory;
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateConditionPayload {
	name: string;
	category: ConditionCategory;
	sortOrder?: number;
}
