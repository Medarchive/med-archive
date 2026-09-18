import Skeleton from "../../ui/custom/Skeleton";

export default function ProviderOverviewSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-64" />

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-20 rounded-[12px]" />
				))}
			</div>

			<div>
				<Skeleton className="mb-3 h-5 w-28" />

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<Skeleton key={i} className="h-24 rounded-[12px]" />
					))}
				</div>
			</div>
		</div>
	);
}
