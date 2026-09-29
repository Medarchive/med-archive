import { ExternalLink } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import { stellarExplorerTxUrl } from "../../../lib/wallet/payment";
import { WalletTransaction } from "../types";
import { stroopsToXlm } from "../utils";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface TransactionDetailModalProps {
	transaction: WalletTransaction | null;
	onClose: () => void;
}

const formatDateTime = (value: string) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4">
			<p className="text-sm font-semibold">{label}</p>
			<div className="max-w-55 text-right text-sm text-[#9B9B9B]">{children}</div>
		</div>
	);
}

export default function TransactionDetailModal({
	transaction,
	onClose,
}: TransactionDetailModalProps) {
	return (
		<Modal open={!!transaction} onClose={onClose} title="Transaction">
			{transaction && (
				<div className="space-y-4">
					<Row label="Hash">
						<a
							href={stellarExplorerTxUrl(transaction.hash)}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-start gap-1 break-all font-mono text-xs text-primary hover:underline"
						>
							{transaction.hash}
							<ExternalLink className="mt-0.5 size-3 shrink-0" />
						</a>
					</Row>

					<Row label="Status">
						<TransactionStatusBadge successful={transaction.successful} />
					</Row>

					<Row label="Date">{formatDateTime(transaction.createdAt)}</Row>

					<Row label="Memo">{transaction.memo ?? "—"}</Row>

					<Row label="Operations">{transaction.operationCount}</Row>

					<Row label="Fee">{stroopsToXlm(transaction.feeCharged)}</Row>

					<Row label="Ledger">{transaction.ledger}</Row>
				</div>
			)}
		</Modal>
	);
}
