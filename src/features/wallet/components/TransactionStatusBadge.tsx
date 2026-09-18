import StatusBadge, { BadgeVariant } from "../../../components/shared/StatusBadge";

// Real status values aren't documented — map common terms defensively and
// fall back to a neutral badge showing whatever string comes back.
const variantFor = (status?: string): BadgeVariant => {
	const normalized = status?.toLowerCase() ?? "";
	if (["success", "successful", "completed", "verified"].includes(normalized)) {
		return "success";
	}
	if (["failed", "failure", "declined", "error"].includes(normalized)) {
		return "error";
	}
	return "warning";
};

export default function TransactionStatusBadge({ status }: { status?: string }) {
	if (!status) return <span className="text-sm text-[#9B9B9B]">—</span>;

	return <StatusBadge variant={variantFor(status)} label={status} />;
}
