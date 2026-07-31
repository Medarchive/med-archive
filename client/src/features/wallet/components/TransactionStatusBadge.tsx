import StatusBadge, { BadgeVariant } from "../../../components/shared/StatusBadge";
import { TransactionStatus } from "../types";

const statusConfig: Record<TransactionStatus, { label: string; variant: BadgeVariant }> = {
	approved: { label: "Successful", variant: "success" },
	declined: { label: "Failed", variant: "error" },
	pending: { label: "Pending", variant: "warning" },
};

export default function TransactionStatusBadge({
	status,
}: {
	status: TransactionStatus;
}) {
	const { label, variant } = statusConfig[status];

	return <StatusBadge variant={variant} label={label} />;
}
