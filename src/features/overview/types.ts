import { CareIdData } from "../care-id/types";
import { ClinicalProofData } from "../clinical-proofs/types";
import { EmergencyContactData } from "../emergency-contacts/types";
import { MedicalProfileData } from "../medical-profile/types";
import { HealthRecordData } from "../records/types";
import { WalletData } from "../wallet/types";

// GET /dashboard — built from the OpenAPI example, not yet confirmed against
// a real response. Only `recentClinicalProofs` is read so far; the rest is
// typed so the overview can move onto this one request later instead of
// the separate per-card queries it makes today.
export interface DashboardData {
	healthOverview: MedicalProfileData | null;
	// Last 6 records.
	recentRecords: HealthRecordData[];
	careId: Pick<CareIdData, "careId" | "status"> | null;
	emergencyContacts: EmergencyContactData[];
	wallet: WalletData | null;
	// 5 most recent, any status — no commitment or other proof material.
	recentClinicalProofs: ClinicalProofData[];
}
