import Skeleton from "../../../../../components/ui/custom/Skeleton";

export default function Loading() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-72" />

			<div className="space-y-4 rounded-[12px] border border-[#F5F5F5] bg-white p-5 sm:max-w-115">
				<Skeleton className="h-12 rounded-[6px]" />
				<Skeleton className="h-12 rounded-[6px]" />
				<Skeleton className="h-12 rounded-[6px]" />
				<Skeleton className="h-10 w-full rounded-[8px] sm:w-40" />
			</div>
		</div>
	);
}
