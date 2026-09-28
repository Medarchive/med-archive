"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import EmptyState from "../../../components/shared/EmptyState";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import ZkProofBadge from "../../records/components/ZkProofBadge";
import { useMedicalConditions } from "../../med-history/hooks";
import { useHealthRecords } from "../../records/hooks";
import { useClinicalProofs } from "../hooks";
import { getClinicalProofTypeLabel } from "../constants";
import { describeClaim } from "../utils";
import GenerateClinicalProofModal from "./GenerateClinicalProofModal";
import ClinicalProofDetailModal from "./ClinicalProofDetailModal";

const formatDate = (value: string) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export default function ClinicalProofsPage() {
	const [showGenerateModal, setShowGenerateModal] = useState(false);
	const [selectedProofId, setSelectedProofId] = useState<string | null>(null);

	const { data: proofs, isLoading } = useClinicalProofs();
	const { data: conditionsData } = useMedicalConditions({ take: 100 });
	const { data: allergyData } = useHealthRecords({ recordType: "ALLERGY", take: 100 });

	const handleCreated = (proofId: string) => {
		setShowGenerateModal(false);
		// Straight into the detail view, which polls until generation lands.
		setSelectedProofId(proofId);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Clinical Proofs</h1>
					<p className="text-[#9B9B9B]">
						Prove one specific fact to a provider without sharing your records.
					</p>
				</div>

				<Button onClick={() => setShowGenerateModal(true)}>
					<Plus className="size-4" />
					Generate Proof
				</Button>
			</div>

			{isLoading ? (
				<TableSkeleton rows={5} columns={4} />
			) : !proofs || proofs.length === 0 ? (
				<EmptyState
					icon={ShieldCheck}
					message="You haven't generated any clinical proofs yet."
				/>
			) : (
				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<div className="overflow-x-auto">
						<table className="w-full min-w-140 text-sm">
							<thead>
								<tr className="text-left text-xs text-[#9B9B9B]">
									<th className="pb-3 font-normal">Proof type</th>
									<th className="pb-3 font-normal">Discloses</th>
									<th className="pb-3 font-normal">Status</th>
									<th className="pb-3 font-normal">Requested</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#F5F5F5]">
								{proofs.map((proof) => (
									<tr
										key={proof.id}
										onClick={() => setSelectedProofId(proof.id)}
										className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
									>
										<td className="py-3 font-medium">
											{getClinicalProofTypeLabel(proof.proofType)}
										</td>
										<td className="py-3 text-[#9B9B9B]">
											{describeClaim(proof, {
												conditions: conditionsData?.data,
												allergyRecords: allergyData?.data,
											})}
										</td>
										<td className="py-3">
											<ZkProofBadge status={proof.status} />
										</td>
										<td className="py-3 text-[#9B9B9B]">
											{formatDate(proof.createdAt)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<GenerateClinicalProofModal
				open={showGenerateModal}
				onClose={() => setShowGenerateModal(false)}
				onCreated={handleCreated}
			/>

			<ClinicalProofDetailModal
				proofId={selectedProofId}
				onClose={() => setSelectedProofId(null)}
			/>
		</div>
	);
}
