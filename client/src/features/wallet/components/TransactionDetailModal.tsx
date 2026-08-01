import Modal from "../../../components/ui/custom/Modal";
import { WalletTransaction } from "../types";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface TransactionDetailModalProps {
	transaction: WalletTransaction | null;
	onClose: () => void;
}

export default function TransactionDetailModal({
	transaction,
	onClose,
}: TransactionDetailModalProps) {
	return (
		<Modal open={!!transaction} onClose={onClose}>
			{transaction && (
				<div className="space-y-4">
					<div className="flex items-start justify-between gap-4">
						<p className="text-sm font-semibold">Transaction ID</p>
						<p className="max-w-55 text-right text-sm text-[#9B9B9B] break-all">
							{transaction.id ?? transaction.hash ?? "—"}
						</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Type</p>
						<p className="text-sm text-[#9B9B9B]">{transaction.type ?? "—"}</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Amount</p>
						<p className="text-sm text-[#9B9B9B]">
							{transaction.amount !== undefined
								? `${transaction.amount} XLM`
								: "—"}
						</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Status</p>
						<TransactionStatusBadge status={transaction.status} />
					</div>
				</div>
			)}
		</Modal>
	);
}
