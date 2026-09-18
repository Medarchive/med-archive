import Skeleton from "../../ui/custom/Skeleton";
import TableSkeleton from "./TableSkeleton";

export default function ProviderRequestSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-8 w-24 rounded-[8px]" />
			</div>

			<TableSkeleton rows={7} columns={6} />
		</div>
	);
}
