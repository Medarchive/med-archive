import Modal from "../../../components/ui/custom/Modal";
import { Button } from "../../../components/ui/button";
import { ProviderRequest } from "../types";
import StatusBadge from "./StatusBadge";

interface ProviderRequestDetailModalProps {
	request: ProviderRequest | null;
	onClose: () => void;
	onDecision: (id: string, approved: boolean) => void;
}

export default function ProviderRequestDetailModal({
	request,
	onClose,
	onDecision,
}: ProviderRequestDetailModalProps) {
	return (
		<Modal open={!!request} onClose={onClose}>
			{request && (
				<div className="space-y-4">
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Provider Name</p>

						<div className="flex items-center gap-2">
							<span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
								{request.providerName
									.replace(/^Dr\.\s*/i, "")
									.slice(0, 2)
									.toUpperCase()}
							</span>
							<span className="text-sm text-[#9B9B9B]">
								{request.providerName}
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Request</p>
						<p className="text-sm text-[#9B9B9B]">{request.request}</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Hospital</p>
						<p className="text-sm text-[#9B9B9B]">{request.hospital}</p>
					</div>

					<div className="flex items-start justify-between gap-4">
						<p className="text-sm font-semibold">Note</p>
						<p className="max-w-70 text-right text-sm text-[#9B9B9B]">
							{request.note}
						</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Date</p>
						<p className="text-sm text-[#9B9B9B]">{request.date}</p>
					</div>

					{request.status === "pending" ? (
						<div className="flex justify-end gap-2 pt-2">
							<Button size="sm" onClick={() => onDecision(request.id, true)}>
								Approve
							</Button>

							<Button
								size="sm"
								variant="destructive"
								onClick={() => onDecision(request.id, false)}
							>
								Decline
							</Button>
						</div>
					) : (
						<div className="flex items-center justify-between gap-4">
							<p className="text-sm font-semibold">Status</p>
							<StatusBadge status={request.status} />
						</div>
					)}
				</div>
			)}
		</Modal>
	);
}
