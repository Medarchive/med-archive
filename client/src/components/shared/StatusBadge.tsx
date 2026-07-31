import { Check, X, Clock, LucideIcon } from "lucide-react";

export type BadgeVariant = "success" | "error" | "warning";

const variantConfig: Record<BadgeVariant, { icon: LucideIcon; className: string }> = {
	success: { icon: Check, className: "bg-primary/10 text-primary" },
	error: { icon: X, className: "bg-error/10 text-error" },
	warning: { icon: Clock, className: "bg-amber-100 text-amber-700" },
};

interface StatusBadgeProps {
	variant: BadgeVariant;
	label: string;
}

export default function StatusBadge({ variant, label }: StatusBadgeProps) {
	const { icon: Icon, className } = variantConfig[variant];

	return (
		<span
			className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
		>
			<Icon className="size-3" />
			{label}
		</span>
	);
}
