import Link from "next/link";
import Modal from "../../../components/ui/custom/Modal";
import { Button } from "../../../components/ui/button";
import { AccessRequestData } from "../types";
import StatusBadge from "./StatusBadge";
import { describeRequestedItem } from "../utils";
import { pageRoutes } from "../../../lib/config/routes";
import { getClinicalProofTypeLabel } from "../../clinical-proofs/constants";

interface ProviderRequestDetailModalProps {
	request: AccessRequestData | null;
	onClose: () => void;
	onDecision: (id: string, approved: boolean) => void;
	onRevoke: (id: string) => void;
	isResponding: boolean;
	isRevoking: boolean;
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
	onRevoke,
	isResponding,
	isRevoking,
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

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Requested Item</p>
						<p className="text-right text-sm text-[#9B9B9B]">
							{describeRequestedItem(request) ?? "Any matching records"}
						</p>
					</div>

					{/* The provider verifies a proof the patient generates themselves —
					    approving alone doesn't create one. */}
					{request.proofType &&
						(request.status === "PENDING" || request.status === "APPROVED") && (
							<p className="rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm text-[#9B9B9B]">
								This provider is asking for a{" "}
								{getClinicalProofTypeLabel(request.proofType).toLowerCase()} proof.
								Once you approve, generate one on{" "}
								<Link
									href={pageRoutes.dashboardRoutes.CLINICAL_PROOFS}
									className="font-semibold text-primary underline"
								>
									Clinical Proofs
								</Link>{" "}
								if you haven&apos;t already — they&apos;ll only see that one fact.
							</p>
						)}

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
						// PATCH .../access-requests/{id}/revoke, confirmed live — only
						// shown for APPROVED (DECLINED/REVOKED have nothing left to
						// revoke).
						<div className="flex items-center justify-between gap-4">
							<p className="text-sm font-semibold">Status</p>
							<div className="flex items-center gap-2">
								<StatusBadge status={request.status} />
								{request.status === "APPROVED" && (
									<Button
										size="sm"
										variant="destructive"
										isLoading={isRevoking}
										onClick={() => onRevoke(request.id)}
									>
										Revoke Access
									</Button>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</Modal>
	);
}
