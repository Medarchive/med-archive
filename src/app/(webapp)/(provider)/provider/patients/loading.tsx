import Skeleton from "../../../../../components/ui/custom/Skeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-48" />

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
					<Skeleton className="h-12 w-full rounded-[6px] sm:w-48" />
					<Skeleton className="h-12 flex-1 rounded-[6px]" />
					<Skeleton className="h-10 w-full rounded-[8px] sm:w-24" />
				</div>
			</div>
		</div>
	);
}
