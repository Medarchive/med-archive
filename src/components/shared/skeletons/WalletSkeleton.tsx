import Skeleton from "../../ui/custom/Skeleton";
import TableSkeleton from "./TableSkeleton";

export default function WalletSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-32" />
			<Skeleton className="h-44 rounded-[12px]" />
			<TableSkeleton rows={6} columns={4} />
		</div>
	);
}
