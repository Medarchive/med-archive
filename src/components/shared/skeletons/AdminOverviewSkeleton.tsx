import Skeleton from "../../ui/custom/Skeleton";

export default function AdminOverviewSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-56" />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 7 }).map((_, i) => (
					<Skeleton key={i} className="h-24 rounded-[12px]" />
				))}
			</div>

			<div>
				<Skeleton className="mb-3 h-5 w-28" />

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-24 rounded-[12px]" />
					))}
				</div>
			</div>
		</div>
	);
}
