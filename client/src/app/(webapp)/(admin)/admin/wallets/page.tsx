import WalletsTable from "../../../../../features/admin/components/WalletsTable";

export default function Page() {
	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Wallets</h1>
			<WalletsTable />
		</div>
	);
}
