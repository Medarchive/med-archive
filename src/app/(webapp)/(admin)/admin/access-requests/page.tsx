import AccessRequestsTable from "../../../../../features/admin/components/AccessRequestsTable";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Access Requests</h1>
			<AccessRequestsTable />
		</div>
	);
}
