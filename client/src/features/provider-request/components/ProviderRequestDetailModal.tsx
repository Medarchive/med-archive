import Modal from "../../../components/ui/custom/Modal";
import { Button } from "../../../components/ui/button";
import { AccessRequestData } from "../types";
import StatusBadge from "./StatusBadge";

interface ProviderRequestDetailModalProps {
	request: AccessRequestData | null;
	onClose: () => void;
	onDecision: (id: string, approved: boolean) => void;
	isResponding: boolean;
}

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function ProviderRequestDetailModal({
	request,
	onClose,
	onDecision,
	isResponding,
}: ProviderRequestDetailModalProps) {
	return (
		<Modal open={!!request} onClose={onClose}>
			{request && (
				<div className="space-y-4">
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Provider Name</p>

						<div className="flex items-center gap-2">
							{request.providerProfilePictureUrl ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={request.providerProfilePictureUrl}
									alt=""
									className="size-8 shrink-0 rounded-full object-cover"
								/>
							) : (
								<span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
									{request.providerName
										.replace(/^Dr\.\s*/i, "")
										.slice(0, 2)
										.toUpperCase()}
								</span>
							)}
							<span className="text-sm text-[#9B9B9B]">
								{request.providerName}
							</span>
						</div>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Organization</p>
						<p className="text-sm text-[#9B9B9B]">
							{request.organizationName ?? "—"}
						</p>
					</div>

					{request.providerType && (
						<div className="flex items-center justify-between gap-4">
							<p className="text-sm font-semibold">Provider Type</p>
							<p className="text-sm text-[#9B9B9B]">{request.providerType}</p>
						</div>
					)}

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Request</p>
						<p className="text-sm text-[#9B9B9B]">{request.requestType}</p>
					</div>

					{request.note && (
						<div className="flex items-start justify-between gap-4">
							<p className="text-sm font-semibold">Note</p>
							<p className="max-w-70 text-right text-sm text-[#9B9B9B]">
								{request.note}
							</p>
						</div>
					)}

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Date</p>
						<p className="text-sm text-[#9B9B9B]">
							{formatDate(request.createdAt)}
						</p>
					</div>

					{request.status === "PENDING" ? (
						<div className="flex justify-end gap-2 pt-2">
							<Button
								size="sm"
								isLoading={isResponding}
								onClick={() => onDecision(request.id, true)}
							>
								Approve
							</Button>

							<Button
								size="sm"
								variant="destructive"
								isLoading={isResponding}
								onClick={() => onDecision(request.id, false)}
							>
								Decline
							</Button>
						</div>
					) : (
						// No revoke action here even for APPROVED — confirmed the API
						// has no mechanism for it at all (PATCH .../access-requests/{id}
						// only ever accepts APPROVED/DECLINED, no REVOKED, no DELETE).
						// Add one the moment that lands; a button with nothing to call
						// would be worse than not having it.
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
