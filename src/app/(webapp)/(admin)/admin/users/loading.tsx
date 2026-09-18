import Skeleton from "../../../../../components/ui/custom/Skeleton";
import TableSkeleton from "../../../../../components/shared/skeletons/TableSkeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-24" />
			<TableSkeleton rows={8} columns={6} showTabs />
		</div>
	);
}
