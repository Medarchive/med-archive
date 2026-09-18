import ProviderActivityTable from "../../../../../features/provider/components/ProviderActivityTable";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Activity</h1>
			<ProviderActivityTable />
		</div>
	);
}
