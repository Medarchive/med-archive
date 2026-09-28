import Link from "next/link";
import { pageRoutes } from "../../../lib/config/routes";
import ZkProofBadge from "../../records/components/ZkProofBadge";
import { getClinicalProofTypeLabel } from "../../clinical-proofs/constants";
import { describeClaim } from "../../clinical-proofs/utils";
import { useDashboard } from "../hooks";

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function RecentClinicalProofsCard() {
	const { data, isLoading } = useDashboard();

	const proofs = data?.recentClinicalProofs ?? [];

	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Recent Clinical Proofs</h3>

			<div className="mt-4 flex items-center justify-between text-xs text-[#9B9B9B]">
				<span>Proof</span>
				<span>Status</span>
			</div>

			<div className="flex-1 divide-y divide-[#F5F5F5]">
				{isLoading && <p className="py-3 text-sm text-[#9B9B9B]">Loading...</p>}

				{!isLoading && proofs.length === 0 && (
					<p className="py-3 text-sm text-[#9B9B9B]">No clinical proofs yet</p>
				)}

				{proofs.map((proof) => (
					<div key={proof.id} className="flex items-center gap-3 py-3">
						<span className="h-8 w-1.5 shrink-0 rounded-full bg-primary/20" />

						{/* No condition/record lookups here, so claims that only carry
						    an id read generically ("Has a listed condition") — the
						    Clinical Proofs page resolves those names. */}
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium">
								{getClinicalProofTypeLabel(proof.proofType)}
							</p>
							<p className="truncate text-xs text-[#9B9B9B]">
								{describeClaim(proof)} · {formatDate(proof.createdAt)}
							</p>
						</div>

						<ZkProofBadge status={proof.status} />
					</div>
				))}
			</div>

			<Link
				href={pageRoutes.dashboardRoutes.CLINICAL_PROOFS}
				className="mt-4 self-end text-sm font-semibold text-primary hover:underline"
			>
				See all
			</Link>
		</div>
	);
}
