"use client";

import InfoListCard from "../../../components/shared/InfoListCard";
import { useMedicalProfile } from "../../medical-profile/hooks";
import { bloodGroupLabels } from "../../medical-profile/types";

export default function HealthOverviewCard() {
	const { data: medicalProfile } = useMedicalProfile();

	const healthOverview = [
		{
			label: "Blood Group",
			value: medicalProfile?.bloodGroup
				? bloodGroupLabels[medicalProfile.bloodGroup]
				: "Not recorded",
		},
		{ label: "Genotype", value: medicalProfile?.genotype ?? "Not recorded" },
		{
			label: "Height",
			value: medicalProfile?.heightCm ? `${medicalProfile.heightCm} cm` : "Not recorded",
		},
		{
			label: "Weight",
			value: medicalProfile?.weightKg ? `${medicalProfile.weightKg} kg` : "Not recorded",
		},
		{
			label: "Medication",
			value:
				medicalProfile?.currentlyTakingMedication === undefined
					? "Not recorded"
					: medicalProfile.currentlyTakingMedication
						? "Currently on medication"
						: "Not on medication",
		},
		{
			label: "Conditions",
			value: medicalProfile?.conditions?.length
				? medicalProfile.conditions.map((condition) => condition.name).join(", ")
				: "None recorded",
		},
	];

	return (
		<InfoListCard
			title="Health Overview"
			items={healthOverview}
			footer={
				medicalProfile?.updatedAt
					? `Last Updated: ${new Date(medicalProfile.updatedAt).toLocaleDateString()}`
					: undefined
			}
		/>
	);
}
