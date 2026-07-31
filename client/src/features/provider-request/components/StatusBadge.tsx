import { Check, X, Clock } from "lucide-react";
import { RequestStatus } from "../types";

const statusConfig: Record<
	RequestStatus,
	{ label: string; icon: typeof Check; className: string }
> = {
	approved: {
		label: "Approved",
		icon: Check,
		className: "bg-primary/10 text-primary",
	},
	declined: {
		label: "Declined",
		icon: X,
		className: "bg-error/10 text-error",
	},
	pending: {
		label: "Pending",
		icon: Clock,
		className: "bg-amber-100 text-amber-700",
	},
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
	const { label, icon: Icon, className } = statusConfig[status];

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
		>
			<Icon className="size-3" />
			{label}
		</span>
	);
}
