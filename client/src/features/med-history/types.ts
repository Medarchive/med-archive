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

export interface ConditionData {
	id: string;
	name: string;
	description?: string | null;
	createdAt?: string;
}
