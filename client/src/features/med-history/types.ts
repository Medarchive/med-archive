// Confirmed against the live OpenAPI spec for POST/PATCH/DELETE
// /api/v1/med-history. Note: `conditionIds` references records from
// /api/v1/medical-conditions, which is documented as "Stub — not yet
// implemented" (admin-only, no GET at all) — there is currently no way for
// this app to know what condition IDs exist, so nothing can populate a real
// condition picker yet. See MedicalHistoryTab's comment for how that's
// handled in the UI.
export interface UpdateMedHistoryPayload {
	conditionIds: string[];
	currentlyTakingMedication: boolean;
}
