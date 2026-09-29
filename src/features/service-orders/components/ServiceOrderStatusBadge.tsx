import StatusBadge from "../../../components/shared/StatusBadge";
import { ServiceOrderStatus } from "../types";

export default function ServiceOrderStatusBadge({ status }: { status: ServiceOrderStatus }) {
	return status === "PAID" ? (
		<StatusBadge variant="success" label="Paid" />
	) : (
		<StatusBadge variant="warning" label="Awaiting payment" />
	);
}
