import StatusBadge, { BadgeVariant } from "../../../components/shared/StatusBadge";
import { ProofStatus } from "../types";

const config: Record<ProofStatus, { label: string; variant: BadgeVariant }> = {
	VERIFIED: { label: "Verified", variant: "success" },
	FAILED: { label: "Failed", variant: "error" },
	PENDING: { label: "Pending", variant: "warning" },
};

export default function ZkProofBadge({ status }: { status: ProofStatus }) {
	const { label, variant } = config[status];

	return <StatusBadge variant={variant} label={label} />;
}
