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

// PUT /api/v1/medical-conditions/{id} ("[Admin] Update a medical condition")
// — confirmed via the live UpdateMedicalConditionDto schema. All fields
// optional; `isActive` exists on the DTO but isn't surfaced as an editable
// field in this app's edit form — GET only ever returns active conditions
// ("List all active medical conditions", no isActive/status filter param),
// so a deactivated condition becomes unselectable here the moment it's
// deactivated, making a reactivate-via-edit flow unreachable in this UI.
// Deactivating stays a dedicated action (DELETE, soft-delete) instead.
export interface UpdateConditionPayload {
	name?: string;
	category?: ConditionCategory;
	sortOrder?: number;
}
