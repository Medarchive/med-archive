import Skeleton from "../../../../../components/ui/custom/Skeleton";
import TableSkeleton from "../../../../../components/shared/skeletons/TableSkeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<Skeleton className="h-8 w-56" />
				<Skeleton className="h-9 w-36 rounded-[8px]" />
			</div>

			<TableSkeleton rows={6} columns={4} />
		</div>
	);
}
