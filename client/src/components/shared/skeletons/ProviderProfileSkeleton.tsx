import Skeleton from "../../ui/custom/Skeleton";

export default function ProviderProfileSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-8 w-48" />

			<div className="flex items-center gap-4 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<Skeleton className="size-16 shrink-0 rounded-full" />

				<div className="space-y-2">
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-3 w-40" />
				</div>
			</div>

			<div className="max-w-155 space-y-4 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<div className="grid gap-4 sm:grid-cols-2">
					<Skeleton className="h-12 rounded-[6px]" />
					<Skeleton className="h-12 rounded-[6px]" />
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<Skeleton className="h-12 rounded-[6px]" />
					<Skeleton className="h-12 rounded-[6px]" />
				</div>

				<Skeleton className="h-12 rounded-[6px]" />
				<Skeleton className="h-12 rounded-[6px]" />

				<div className="grid gap-4 sm:grid-cols-2">
					<Skeleton className="h-12 rounded-[6px]" />
					<Skeleton className="h-12 rounded-[6px]" />
				</div>

				<Skeleton className="mt-4 h-10 w-40 rounded-[8px]" />
			</div>
		</div>
	);
}
