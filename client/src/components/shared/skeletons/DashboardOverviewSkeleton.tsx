import Skeleton from "../../ui/custom/Skeleton";

export default function DashboardOverviewSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-2">
					<Skeleton className="h-8 w-56" />
					<Skeleton className="h-4 w-72" />
				</div>

				<Skeleton className="h-10 w-36 rounded-[8px]" />
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Skeleton className="h-40 rounded-[12px]" />
				<Skeleton className="h-40 rounded-[12px]" />
				<Skeleton className="h-40 rounded-[12px]" />
				<Skeleton className="h-40 rounded-[12px]" />

				<Skeleton className="h-64 rounded-[12px] md:col-span-2 lg:col-span-1" />
				<Skeleton className="h-64 rounded-[12px] md:col-span-2 lg:col-span-2" />

				<div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
					<Skeleton className="h-36 rounded-[12px]" />
					<Skeleton className="h-36 rounded-[12px]" />
				</div>
			</div>
		</div>
	);
}
