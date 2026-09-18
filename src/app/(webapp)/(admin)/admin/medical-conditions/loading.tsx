import Skeleton from "../../../../../components/ui/custom/Skeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-64" />

			<Skeleton className="h-14 rounded-[8px]" />

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<div className="flex flex-col gap-3 sm:max-w-150 sm:flex-row sm:items-end">
					<Skeleton className="h-12 flex-1 rounded-[6px]" />
					<Skeleton className="h-12 w-full rounded-[6px] sm:w-40" />
					<Skeleton className="h-10 w-36 rounded-[8px]" />
				</div>
			</div>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<Skeleton className="mb-3 h-5 w-36" />

				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-8 w-28 rounded-full" />
					<Skeleton className="h-8 w-32 rounded-full" />
					<Skeleton className="h-8 w-24 rounded-full" />
				</div>
			</div>
		</div>
	);
}
