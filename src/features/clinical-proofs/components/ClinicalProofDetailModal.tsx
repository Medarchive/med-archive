"use client";

import { Loader2 } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import ZkProofBadge from "../../records/components/ZkProofBadge";
import { useMedicalConditions } from "../../med-history/hooks";
import { useHealthRecords } from "../../records/hooks";
import { useClinicalProof } from "../hooks";
import { getClinicalProofTypeLabel } from "../constants";
import { describeClaim } from "../utils";

interface ClinicalProofDetailModalProps {
	proofId: string | null;
	onClose: () => void;
}

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function ClinicalProofDetailModal({
	proofId,
	onClose,
}: ClinicalProofDetailModalProps) {
	return (
		<Modal open={!!proofId} onClose={onClose} title="Clinical Proof">
			{proofId && <ClinicalProofDetail proofId={proofId} />}
		</Modal>
	);
}

function ClinicalProofDetail({ proofId }: { proofId: string }) {
	const { data: proof, isLoading } = useClinicalProof(proofId);
	const { data: conditionsData } = useMedicalConditions({ take: 100 });
	const { data: allergyData } = useHealthRecords({ recordType: "ALLERGY", take: 100 });

	if (isLoading || !proof) {
		return (
			<div className="flex justify-center py-10">
				<Loader2 className="size-5 animate-spin text-[#9B9B9B]" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<p className="text-sm font-semibold">Proof type</p>
				<p className="text-sm text-[#9B9B9B]">
					{getClinicalProofTypeLabel(proof.proofType)}
				</p>
			</div>

			<div className="flex items-start justify-between gap-4">
				<p className="text-sm font-semibold">Discloses</p>
				<p className="max-w-70 text-right text-sm text-[#9B9B9B]">
					{describeClaim(proof, {
						conditions: conditionsData?.data,
						allergyRecords: allergyData?.data,
					})}
				</p>
			</div>

			<div className="flex items-center justify-between gap-4">
				<p className="text-sm font-semibold">Status</p>
				<ZkProofBadge status={proof.status} />
			</div>

			<div className="flex items-center justify-between gap-4">
				<p className="text-sm font-semibold">Requested</p>
				<p className="text-sm text-[#9B9B9B]">{formatDate(proof.createdAt)}</p>
			</div>

			{proof.status === "PENDING" && (
				<p className="flex items-center gap-2 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
					<Loader2 className="size-4 shrink-0 animate-spin" />
					Generating your proof — this usually takes a few seconds.
				</p>
			)}

			{proof.status === "GENERATED" && (
				<>
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Generated</p>
						<p className="text-sm text-[#9B9B9B]">{formatDate(proof.generatedAt)}</p>
					</div>

					{proof.commitment && (
						<div className="space-y-1">
							<p className="text-sm font-semibold">Commitment</p>
							<p className="break-all rounded-[8px] bg-[#FAFAFA] px-3 py-2 font-mono text-xs text-[#9B9B9B]">
								{proof.commitment}
							</p>
						</div>
					)}

					<p className="text-xs text-[#9B9B9B]">
						Providers you approve for this proof type can verify it. They only
						ever see the fact above — never the records behind it.
					</p>
				</>
			)}

			{proof.status === "FAILED" && (
				<p className="rounded-[8px] border border-error/20 bg-error/10 px-3 py-2 text-sm text-error">
					{proof.error || "Proof generation failed. Try generating it again."}
				</p>
			)}
		</div>
	);
}
