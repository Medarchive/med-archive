import StatusBadge from "../../../components/shared/StatusBadge";

export default function ZkProofBadge({
	status,
}: {
	status: "verified" | "unverified";
}) {
	return (
		<StatusBadge
			variant={status === "verified" ? "success" : "error"}
			label={status === "verified" ? "Verified" : "Unverified"}
		/>
	);
}
