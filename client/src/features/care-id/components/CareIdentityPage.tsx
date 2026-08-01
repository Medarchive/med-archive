"use client";

import InfoListCard from "../../../components/shared/InfoListCard";
import CareIdHeroCard from "./CareIdHeroCard";
import RecordsTable from "./RecordsTable";
import CareIdSkeleton from "../../../components/shared/skeletons/CareIdSkeleton";
import { useCareId } from "../hooks";
import { useHasMounted } from "../../../hooks/useHasMounted";

const healthOverview = [
	{ label: "Blood Group", value: "O+" },
	{ label: "Allergies", value: "Emergency Epinephrine" },
	{ label: "Conditions", value: "Normal" },
	{ label: "Medication", value: "Ibuprofen (Advil) BID" },
	{ label: "Lab Report", value: "Urinalysis (UA)" },
];

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
					footer="Last Updated: Today"
				/>

				<div className="xl:col-span-2">
					<RecordsTable />
				</div>
			</div>
		</div>
	);
}
