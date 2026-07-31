import InfoListCard from "../../../components/shared/InfoListCard";
import CareIdHeroCard from "./CareIdHeroCard";
import RecordsTable from "./RecordsTable";

const healthOverview = [
	{ label: "Blood Group", value: "O+" },
	{ label: "Allergies", value: "Emergency Epinephrine" },
	{ label: "Conditions", value: "Normal" },
	{ label: "Medication", value: "Ibuprofen (Advil) BID" },
	{ label: "Lab Report", value: "Urinalysis (UA)" },
];

export default function CareIdentityPage() {
	return (
		<div className="space-y-6 max-w-400">
			<h1 className="text-2xl font-bold sm:text-3xl">Your Care Identity</h1>

			<CareIdHeroCard
				careId="MA-002394"
				status="Verified"
				walletAddress="GDXT...6WGG"
				createdDate="16-06-2026"
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
