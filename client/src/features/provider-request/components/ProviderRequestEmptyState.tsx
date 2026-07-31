import { FolderX } from "lucide-react";

export default function ProviderRequestEmptyState() {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
			<span className="flex size-16 items-center justify-center rounded-[10px] bg-[#FAFAFA] text-[#9B9B9B]">
				<FolderX className="size-8" />
			</span>

			<p className="text-[#9B9B9B]">
				There&apos;s nothing yet, upload a new record
			</p>
		</div>
	);
}
