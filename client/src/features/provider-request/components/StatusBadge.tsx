import SharedStatusBadge, {
	BadgeVariant,
} from "../../../components/shared/StatusBadge";
import { RequestStatus } from "../types";

const statusConfig: Record<RequestStatus, { label: string; variant: BadgeVariant }> = {
	APPROVED: { label: "Approved", variant: "success" },
	DECLINED: { label: "Declined", variant: "error" },
	PENDING: { label: "Pending", variant: "warning" },
};

export default function StatusBadge({ status }: { status: RequestStatus }) {
	const { label, variant } = statusConfig[status];

	return <SharedStatusBadge variant={variant} label={label} />;
}
