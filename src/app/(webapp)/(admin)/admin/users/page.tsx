import UsersTable from "../../../../../features/admin/components/UsersTable";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Users</h1>
			<UsersTable />
		</div>
	);
}
