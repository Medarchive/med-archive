import Skeleton from "../../../../../components/ui/custom/Skeleton";
import TableSkeleton from "../../../../../components/shared/skeletons/TableSkeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>

				<div className="flex gap-2">
					<Skeleton className="h-8 w-28 rounded-[8px]" />
					<Skeleton className="h-8 w-32 rounded-[8px]" />
				</div>
			</div>

			<TableSkeleton rows={8} columns={5} />
		</div>
	);
}
