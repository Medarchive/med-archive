import InfoListCard from "../../../components/shared/InfoListCard";

const healthOverview = [
	{ label: "Blood Group", value: "O+" },
	{ label: "Allergies", value: "None" },
	{ label: "Conditions", value: "Normal" },
	{ label: "Medication", value: "ART Treatment" },
	{ label: "Test", value: "RVS" },
	{ label: "Scan", value: "CT Scan" },
];

export default function HealthOverviewCard() {
	return (
		<InfoListCard
			title="Health Overview"
			items={healthOverview}
			footer="Last Updated: Today"
		/>
	);
}
