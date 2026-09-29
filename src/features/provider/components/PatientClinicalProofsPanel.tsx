"use client";

import { useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "../../../components/ui/button";
import ZkProofBadge from "../../records/components/ZkProofBadge";
import { useMedicalConditions } from "../../med-history/hooks";
import { getClinicalProofTypeLabel } from "../../clinical-proofs/constants";
import {
	ClinicalProofType,
	ClinicalProofVerification,
} from "../../clinical-proofs/types";
import { describeClaim } from "../../clinical-proofs/utils";
import { usePatientClinicalProofs, useVerifyClinicalProof } from "../hooks";

interface PatientClinicalProofsPanelProps {
	patientId: string;
	// Narrows the list to one type — e.g. the request detail modal only
	// shows proofs for the type that request asked for.
	proofType?: ClinicalProofType | null;
	// Rendered as a standalone card (lookup page) or bare (inside a modal).
	variant?: "card" | "inline";
}

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export default function PatientClinicalProofsPanel({
	patientId,
	proofType,
	variant = "card",
}: PatientClinicalProofsPanelProps) {
	const { data, isLoading } = usePatientClinicalProofs(patientId);
	const { mutate: verify } = useVerifyClinicalProof();
	// Only needed to name the condition in a CHRONIC_CONDITION result.
	const { data: conditionsData } = useMedicalConditions({ take: 100 });
	const [verifyingId, setVerifyingId] = useState<string | null>(null);
	// Kept for this view only — the disclosed fact is fetched on demand and
	// deliberately not cached anywhere longer-lived.
	const [results, setResults] = useState<Record<string, ClinicalProofVerification>>({});

	const proofs = (data ?? []).filter((proof) => !proofType || proof.proofType === proofType);

	const handleVerify = (proofId: string) => {
		setVerifyingId(proofId);
		verify(proofId, {
			onSuccess: (result) => setResults((prev) => ({ ...prev, [proofId]: result })),
			onSettled: () => setVerifyingId(null),
		});
	};

	const content = isLoading ? (
		<p className="py-3 text-sm text-[#9B9B9B]">Checking clinical proofs...</p>
	) : proofs.length === 0 ? (
		<p className="py-6 text-center text-sm text-[#9B9B9B]">
			{proofType
				? `The patient hasn't generated a ${getClinicalProofTypeLabel(proofType).toLowerCase()} proof yet.`
				: "No proofs to verify yet — request a clinical proof above, then check back once the patient has approved it and generated the proof."}
		</p>
	) : (
		<div className="space-y-2">
			{proofs.map((proof) => {
				const result = results[proof.id];

				return (
					<div
						key={proof.id}
						className="space-y-2 rounded-[8px] border border-[#F5F5F5] px-3 py-2"
					>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium">
									{getClinicalProofTypeLabel(proof.proofType)}
								</span>
								<ZkProofBadge status={proof.status} />
								<span className="text-xs text-[#9B9B9B]">
									{formatDate(proof.generatedAt ?? proof.createdAt)}
								</span>
							</div>

							{/* PENDING/FAILED proofs 400 on verify, so the button
							    only appears once there's something to check. */}
							{proof.status === "GENERATED" && !result && (
								<Button
									size="sm"
									variant="ghost"
									isLoading={verifyingId === proof.id}
									disabled={!!verifyingId}
									onClick={() => handleVerify(proof.id)}
								>
									<ShieldCheck className="size-3.5" />
									Verify
								</Button>
							)}
						</div>

						{result &&
							(result.valid ? (
								<p className="flex items-center gap-2 rounded-[6px] bg-primary/10 px-2 py-1.5 text-sm text-primary">
									<ShieldCheck className="size-4 shrink-0" />
									Verified: {describeClaim(result, { conditions: conditionsData?.data })}
								</p>
							) : (
								<p className="flex items-center gap-2 rounded-[6px] bg-error/10 px-2 py-1.5 text-sm text-error">
									<ShieldX className="size-4 shrink-0" />
									This proof didn&apos;t verify — don&apos;t rely on it.
								</p>
							))}
					</div>
				);
			})}
		</div>
	);

	if (variant === "inline") return content;

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<p className="font-semibold">Clinical Proofs</p>
			<p className="mb-3 text-sm text-[#9B9B9B]">
				Proofs this patient has shared with you. Verifying one reveals only the
				fact it proves.
			</p>
			{content}
		</div>
	);
}
