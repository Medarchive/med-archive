import { Pencil } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface ProfileFormFooterProps {
	isEditing: boolean;
	onEdit: () => void;
	isLoading?: boolean;
	disabled?: boolean;
}

export default function ProfileFormFooter({
	isEditing,
	onEdit,
	isLoading,
	disabled,
}: ProfileFormFooterProps) {
	return (
		<div className="mt-8 flex flex-col items-center gap-4">
			{!isEditing && (
				<button
					type="button"
					onClick={onEdit}
					className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
				>
					<Pencil className="size-4" />
					Edit profile
				</button>
			)}

			<Button
				type="submit"
				isLoading={isLoading}
				disabled={disabled}
				className="w-full sm:w-90"
			>
				Save Changes
			</Button>
		</div>
	);
}
