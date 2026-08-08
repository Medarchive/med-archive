"use client";

import InfoListCard from "../../../components/shared/InfoListCard";
import CareIdHeroCard from "./CareIdHeroCard";
import RecordsTable from "./RecordsTable";
import CareIdSkeleton from "../../../components/shared/skeletons/CareIdSkeleton";
import { useCareId } from "../hooks";
import { useMedicalProfile } from "../../medical-profile/hooks";
import { bloodGroupLabels } from "../../medical-profile/types";
import { useHasMounted } from "../../../hooks/useHasMounted";

const formatDate = (value?: string) => {
	if (!value) return "—";

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return date.toLocaleDateString(undefined, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

export default function CareIdentityPage() {
	const hasMounted = useHasMounted();
	const { data: careId, isLoading } = useCareId();
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
			label: "Medication Status",
			value:
				medicalProfile?.currentlyTakingMedication === undefined
					? "Not recorded"
					: medicalProfile.currentlyTakingMedication
						? "Currently on medication"
						: "Not on medication",
		},
		{
			label: "Active Conditions",
			value: medicalProfile?.conditions?.length
				? medicalProfile.conditions.map((condition) => condition.name).join(", ")
				: "None recorded",
		},
	];

	if (!hasMounted || isLoading) {
		return <CareIdSkeleton />;
	}

	return (
		<div className="space-y-6 max-w-400">
			<h1 className="text-2xl font-bold sm:text-3xl">Your Care Identity</h1>

			<CareIdHeroCard
				careId={careId?.careId ?? "—"}
				status={careId?.status ?? "Unknown"}
				walletAddress={careId?.walletAddress ?? "Not linked"}
				createdDate={formatDate(careId?.createdAt)}
			/>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
				<InfoListCard
					title="Health Overview"
					items={healthOverview}
					footer={`Last Updated: ${formatDate(medicalProfile?.updatedAt)}`}
				/>

				<div className="xl:col-span-2">
					<RecordsTable />
				</div>
			</div>
		</div>
	);
}
