import StatusBadge, { BadgeVariant } from "../../../components/shared/StatusBadge";
import { ProofStatus } from "../types";

const config: Record<string, { label: string; variant: BadgeVariant }> = {
	VERIFIED: { label: "Verified", variant: "success" },
	FAILED: { label: "Failed", variant: "error" },
	PENDING: { label: "Pending", variant: "warning" },
};

// The API doesn't document its full set of proofStatus values, so any
// status we don't recognize falls back to a readable label instead of
// crashing (this previously threw when `config[status]` was undefined).
const humanize = (value: string) =>
	value
		.toLowerCase()
		.replace(/_/g, " ")
		.replace(/^./, (c) => c.toUpperCase());

export default function ZkProofBadge({
	status,
}: {
	status: ProofStatus | (string & {});
}) {
	const known = status ? config[status.toUpperCase()] : undefined;
	const label = known?.label ?? (status ? humanize(status) : "Unknown");
	const variant = known?.variant ?? "warning";

	return <StatusBadge variant={variant} label={label} />;
}
