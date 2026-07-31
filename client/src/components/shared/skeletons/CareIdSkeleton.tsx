import Skeleton from "../../ui/custom/Skeleton";
import TableSkeleton from "./TableSkeleton";

export default function CareIdSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-56" />

			<Skeleton className="h-56 rounded-[12px] sm:h-44" />

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<Skeleton className="h-72 rounded-[12px]" />

				<div className="lg:col-span-2">
					<TableSkeleton rows={5} columns={3} showTabs />
				</div>
			</div>
		</div>
	);
}
