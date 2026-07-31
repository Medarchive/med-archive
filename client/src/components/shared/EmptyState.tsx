import { FolderX, LucideIcon } from "lucide-react";

interface EmptyStateProps {
	message: string;
	icon?: LucideIcon;
}

export default function EmptyState({ message, icon: Icon = FolderX }: EmptyStateProps) {
	return (
		<div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
			<span className="flex size-16 items-center justify-center rounded-[10px] bg-[#FAFAFA] text-[#9B9B9B]">
				<Icon className="size-8" />
			</span>

			<p className="text-[#9B9B9B]">{message}</p>
		</div>
	);
}
