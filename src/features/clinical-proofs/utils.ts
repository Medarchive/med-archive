import { bloodGroupLabels, BloodGroup } from "../medical-profile/types";
import { ConditionData } from "../med-history/types";
import { HealthRecordData } from "../records/types";
import { ClinicalProofData } from "./types";

interface ClaimLookups {
	conditions?: ConditionData[];
	allergyRecords?: HealthRecordData[];
}

const asString = (value: unknown) => (typeof value === "string" ? value : undefined);

// The fact a proof discloses, in words — e.g. "Blood group O+" or "Does not
// have Asthma". claimData only carries ids for conditions and allergy
// records, so those resolve through lookups when available and fall back to
// something generic rather than showing a raw UUID.
export const describeClaim = (
	proof: Pick<ClinicalProofData, "proofType" | "claimData">,
	lookups: ClaimLookups = {},
): string => {
	const claim = proof.claimData ?? {};

	switch (proof.proofType) {
		case "BLOOD_GROUP": {
			const value = asString(claim.bloodGroup);
			return `Blood group ${value ? (bloodGroupLabels[value as BloodGroup] ?? value) : "—"}`;
		}
		case "GENOTYPE":
			return `Genotype ${asString(claim.genotype) ?? "—"}`;
		case "DIAGNOSIS_CATEGORY": {
			const category = asString(claim.category)?.toLowerCase();
			return category ? `Has a recorded ${category}` : "Has a recorded diagnosis";
		}
		case "CHRONIC_CONDITION": {
			const conditionId = asString(claim.conditionId);
			const name =
				lookups.conditions?.find((condition) => condition.id === conditionId)?.name ??
				"a listed condition";
			return claim.hasCondition === false ? `Does not have ${name}` : `Has ${name}`;
		}
		case "ALLERGY_CONFIRMATION": {
			const recordId = asString(claim.healthRecordId);
			const title = lookups.allergyRecords?.find((record) => record.id === recordId)?.title;
			return title ? `Allergy: ${title}` : "Has a recorded allergy";
		}
		case "PRIOR_PRESCRIPTION_PATTERN": {
			const drugClass = asString(claim.drugClass);
			return drugClass ? `Previously prescribed ${drugClass}` : "Prior prescription";
		}
		default:
			return "—";
	}
};
