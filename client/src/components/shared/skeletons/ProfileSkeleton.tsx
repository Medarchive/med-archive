import Skeleton from "../../ui/custom/Skeleton";

export default function ProfileSkeleton() {
	return (
		<div>
			<Skeleton className="h-8 w-32" />

			<div className="mt-4 flex gap-2">
				<Skeleton className="h-8 w-36 rounded-[8px]" />
				<Skeleton className="h-8 w-36 rounded-[8px]" />
				<Skeleton className="h-8 w-32 rounded-[8px]" />
			</div>

			<div className="mt-6 max-w-155 space-y-4">
				<div className="grid gap-4 sm:grid-cols-2">
					<Skeleton className="h-12 rounded-[6px]" />
					<Skeleton className="h-12 rounded-[6px]" />
				</div>

				<Skeleton className="h-12 rounded-[6px]" />

				<div className="grid gap-4 sm:grid-cols-2">
					<Skeleton className="h-12 rounded-[6px]" />
					<Skeleton className="h-12 rounded-[6px]" />
				</div>

				<Skeleton className="h-12 rounded-[6px]" />
				<Skeleton className="h-12 rounded-[6px]" />

				<Skeleton className="mt-4 h-10 w-90 max-w-full rounded-[8px]" />
			</div>
		</div>
	);
}
