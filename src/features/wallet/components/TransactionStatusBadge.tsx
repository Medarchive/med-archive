import StatusBadge from "../../../components/shared/StatusBadge";

export default function TransactionStatusBadge({ successful }: { successful: boolean }) {
	return successful ? (
		<StatusBadge variant="success" label="Successful" />
	) : (
		<StatusBadge variant="error" label="Failed" />
	);
}
