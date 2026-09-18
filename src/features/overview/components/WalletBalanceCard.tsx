import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";

interface WalletBalanceCardProps {
	balance: string | null;
	address: string;
}

export default function WalletBalanceCard({
	balance,
	address,
}: WalletBalanceCardProps) {
	return (
		<div className="flex flex-col justify-between rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex items-start justify-between gap-2">
				<p className="text-sm text-[#9B9B9B]">Wallet balance</p>

				<Button
					href={pageRoutes.dashboardRoutes.WALLET}
					size="sm"
					className="min-w-0"
				>
					{address ? "View Wallet" : "Connect"}
				</Button>
			</div>

			<p className="mt-4 text-2xl font-bold">
				{balance ? `${balance} XLM` : address ? "Unfunded" : "Not connected"}
			</p>

			<div className="mt-6">
				<p className="text-sm text-[#9B9B9B]">Address</p>
				<p className="truncate text-sm font-medium text-[#9B9B9B]">
					{address || "—"}
				</p>
			</div>
		</div>
	);
}
