import Skeleton from "../../ui/custom/Skeleton";

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	showTabs?: boolean;
}

export default function TableSkeleton({
	rows = 6,
	columns = 4,
	showTabs = false,
}: TableSkeletonProps) {
	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			{showTabs && (
				<div className="flex gap-2">
					<Skeleton className="h-7 w-24 rounded-[8px]" />
					<Skeleton className="h-7 w-20 rounded-[8px]" />
					<Skeleton className="h-7 w-24 rounded-[8px]" />
					<Skeleton className="h-7 w-20 rounded-[8px]" />
				</div>
			)}

			<div className={showTabs ? "mt-4 space-y-4" : "space-y-4"}>
				<div className="flex gap-6">
					{Array.from({ length: columns }).map((_, i) => (
						<Skeleton key={i} className="h-3 flex-1" />
					))}
				</div>

				{Array.from({ length: rows }).map((_, row) => (
					<div key={row} className="flex items-center gap-6">
						{Array.from({ length: columns }).map((_, col) => (
							<Skeleton key={col} className="h-5 flex-1" />
						))}
					</div>
				))}
			</div>
		</div>
	);
}
