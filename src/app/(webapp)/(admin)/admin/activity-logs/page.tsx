import ActivityLogsTable from "../../../../../features/admin/components/ActivityLogsTable";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Activity Logs</h1>
			<ActivityLogsTable />
		</div>
	);
}
