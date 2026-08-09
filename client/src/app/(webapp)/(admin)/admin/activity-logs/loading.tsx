import Skeleton from "../../../../../components/ui/custom/Skeleton";
import TableSkeleton from "../../../../../components/shared/skeletons/TableSkeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-44" />
			<TableSkeleton rows={10} columns={4} />
		</div>
	);
}
