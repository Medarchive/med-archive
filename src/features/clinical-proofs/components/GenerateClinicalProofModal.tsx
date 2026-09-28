"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Modal from "../../../components/ui/custom/Modal";
import SelectField from "../../../components/ui/custom/SelectField";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";
import { useMedicalProfile } from "../../medical-profile/hooks";
import { bloodGroupLabels } from "../../medical-profile/types";
import { useMedicalConditions } from "../../med-history/hooks";
import { useHealthRecords } from "../../records/hooks";
import { useClinicalProofTypes, useCreateClinicalProof } from "../hooks";
import { CLINICAL_PROOF_TYPE_LABELS, getClinicalProofTypeLabel } from "../constants";
import { ClinicalProofClaim, ClinicalProofType } from "../types";

// What each proof lets a provider learn — shown under the type picker so
// the patient knows exactly what they're about to disclose.
const PROOF_TYPE_DESCRIPTIONS: Record<ClinicalProofType, string> = {
	BLOOD_GROUP: "Proves your blood group, and nothing else from your medical profile.",
	GENOTYPE: "Proves your genotype, and nothing else from your medical profile.",
	DIAGNOSIS_CATEGORY:
		"Proves you have at least one recorded condition in a category — without revealing which condition.",
	CHRONIC_CONDITION:
		"Proves whether or not you have one specific condition from the medical conditions list.",
	ALLERGY_CONFIRMATION: "Proves one of your recorded allergies.",
	PRIOR_PRESCRIPTION_PATTERN:
		"Proves you've previously been prescribed a class of drug, without sharing the prescription itself.",
};

const CATEGORY_LABELS = {
	DISEASE: "Disease",
	ALLERGY: "Allergy",
	CONDITION: "Condition",
} as const;

interface GenerateClinicalProofModalProps {
	open: boolean;
	onClose: () => void;
	onCreated: (proofId: string) => void;
}

export default function GenerateClinicalProofModal({
	open,
	onClose,
	onCreated,
}: GenerateClinicalProofModalProps) {
	// The form lives in its own component so its queries only run while the
	// modal is open — Modal renders nothing (so mounts nothing) when closed.
	return (
		<Modal open={open} onClose={onClose} title="Generate Clinical Proof">
			<GenerateClinicalProofForm onCreated={onCreated} />
		</Modal>
	);
}

function MissingData({ message, href, linkLabel }: {
	message: string;
	href: string;
	linkLabel: string;
}) {
	return (
		<p className="rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm text-[#9B9B9B]">
			{message}{" "}
			<Link href={href} className="font-semibold text-primary underline">
				{linkLabel}
			</Link>
		</p>
	);
}

function GenerateClinicalProofForm({ onCreated }: { onCreated: (proofId: string) => void }) {
	const [proofType, setProofType] = useState<ClinicalProofType | "">("");
	const [category, setCategory] = useState("");
	const [conditionId, setConditionId] = useState("");
	const [healthRecordId, setHealthRecordId] = useState("");
	const [drugClass, setDrugClass] = useState("");

	const { data: proofTypes } = useClinicalProofTypes();
	const { data: profile, isLoading: isProfileLoading } = useMedicalProfile();
	const { data: conditionsData } = useMedicalConditions({ take: 100 });
	const { data: allergyData } = useHealthRecords({ recordType: "ALLERGY", take: 100 });
	const { data: prescriptionData } = useHealthRecords({
		recordType: "PRESCRIPTION",
		take: 100,
	});
	const { data: medicationData } = useHealthRecords({ recordType: "MEDICATION", take: 100 });
	const { mutate: createProof, isPending } = useCreateClinicalProof();

	const conditions = conditionsData?.data ?? [];
	const allergyRecords = allergyData?.data ?? [];

	// A claim has to be true for the patient's own records or the backend
	// rejects it, so every option below is drawn from those records rather
	// than offering values that could only ever fail.
	const ownConditionIds = useMemo(
		() => new Set((profile?.conditions ?? []).map((condition) => condition.id)),
		[profile],
	);

	const ownCategories = useMemo(
		() => [...new Set((profile?.conditions ?? []).map((condition) => condition.category))],
		[profile],
	);

	const drugClasses = useMemo(() => {
		const records = [...(prescriptionData?.data ?? []), ...(medicationData?.data ?? [])];
		return [
			...new Set(
				records
					.map((record) => record.drugClass?.trim())
					.filter((value): value is string => !!value),
			),
		].sort((a, b) => a.localeCompare(b));
	}, [prescriptionData, medicationData]);

	const buildClaim = (): ClinicalProofClaim | null => {
		switch (proofType) {
			case "BLOOD_GROUP":
				return profile?.bloodGroup ? { bloodGroup: profile.bloodGroup } : null;
			case "GENOTYPE":
				return profile?.genotype ? { genotype: profile.genotype } : null;
			case "DIAGNOSIS_CATEGORY":
				return category
					? { category: category as keyof typeof CATEGORY_LABELS }
					: null;
			case "CHRONIC_CONDITION":
				// Presence or absence is decided by the patient's own history,
				// not picked — the other answer would just be rejected.
				return conditionId
					? { conditionId, hasCondition: ownConditionIds.has(conditionId) }
					: null;
			case "ALLERGY_CONFIRMATION":
				return healthRecordId ? { healthRecordId } : null;
			case "PRIOR_PRESCRIPTION_PATTERN":
				return drugClass ? { drugClass } : null;
			default:
				return null;
		}
	};

	const claim = buildClaim();

	const handleSubmit = () => {
		if (!proofType || !claim) return;

		createProof(
			{ proofType, claimData: claim },
			{ onSuccess: (data) => onCreated(data.data.id) },
		);
	};

	const selectedCondition = conditions.find((condition) => condition.id === conditionId);

	return (
		<div className="space-y-4">
			<SelectField
				name="proofType"
				label="What do you want to prove?"
				placeholder="Select a proof type"
				value={proofType}
				// Falls back to the known types if the reference list is still
				// loading or failed, so the picker is never empty.
				options={(
					proofTypes ?? (Object.keys(CLINICAL_PROOF_TYPE_LABELS) as ClinicalProofType[])
				).map((type) => ({
					value: type,
					label: getClinicalProofTypeLabel(type),
				}))}
				onChange={(e) => setProofType(e.target.value as ClinicalProofType)}
			/>

			{proofType && (
				<p className="text-sm text-[#9B9B9B]">
					{PROOF_TYPE_DESCRIPTIONS[proofType] ??
						`Proves your ${CLINICAL_PROOF_TYPE_LABELS[proofType] ?? "claim"}.`}
				</p>
			)}

			{proofType === "BLOOD_GROUP" &&
				!isProfileLoading &&
				(profile?.bloodGroup ? (
					<SelectField
						name="bloodGroup"
						label="Blood group (from your medical profile)"
						value={profile.bloodGroup}
						options={[
							{ value: profile.bloodGroup, label: bloodGroupLabels[profile.bloodGroup] },
						]}
						disabled
					/>
				) : (
					<MissingData
						message="Your medical profile has no blood group yet."
						href={pageRoutes.dashboardRoutes.PROFILE}
						linkLabel="Add it to your profile"
					/>
				))}

			{proofType === "GENOTYPE" &&
				!isProfileLoading &&
				(profile?.genotype ? (
					<SelectField
						name="genotype"
						label="Genotype (from your medical profile)"
						value={profile.genotype}
						options={[{ value: profile.genotype, label: profile.genotype }]}
						disabled
					/>
				) : (
					<MissingData
						message="Your medical profile has no genotype yet."
						href={pageRoutes.dashboardRoutes.PROFILE}
						linkLabel="Add it to your profile"
					/>
				))}

			{proofType === "DIAGNOSIS_CATEGORY" &&
				!isProfileLoading &&
				(ownCategories.length > 0 ? (
					<SelectField
						name="category"
						label="Category"
						placeholder="Select a category"
						value={category}
						options={ownCategories.map((value) => ({
							value,
							label: CATEGORY_LABELS[value] ?? value,
						}))}
						onChange={(e) => setCategory(e.target.value)}
					/>
				) : (
					<MissingData
						message="You have no recorded conditions yet."
						href={pageRoutes.dashboardRoutes.PROFILE}
						linkLabel="Update your medical history"
					/>
				))}

			{proofType === "CHRONIC_CONDITION" && (
				<>
					<SelectField
						name="conditionId"
						label="Condition"
						placeholder="Select a condition"
						value={conditionId}
						options={conditions.map((condition) => ({
							value: condition.id,
							label: condition.name,
						}))}
						onChange={(e) => setConditionId(e.target.value)}
					/>

					{selectedCondition && (
						<p className="rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm">
							This proves you{" "}
							<span className="font-semibold">
								{ownConditionIds.has(selectedCondition.id) ? "have" : "don't have"}
							</span>{" "}
							{selectedCondition.name}, based on your medical history.
						</p>
					)}
				</>
			)}

			{proofType === "ALLERGY_CONFIRMATION" &&
				(allergyRecords.length > 0 ? (
					<SelectField
						name="healthRecordId"
						label="Allergy record"
						placeholder="Select an allergy record"
						value={healthRecordId}
						options={allergyRecords.map((record) => ({
							value: record.id,
							label: record.cause ? `${record.title} (${record.cause})` : record.title,
						}))}
						onChange={(e) => setHealthRecordId(e.target.value)}
					/>
				) : (
					<MissingData
						message="You have no allergy records yet."
						href={pageRoutes.dashboardRoutes.RECORDS}
						linkLabel="Upload one"
					/>
				))}

			{proofType === "PRIOR_PRESCRIPTION_PATTERN" &&
				(drugClasses.length > 0 ? (
					<SelectField
						name="drugClass"
						label="Drug class"
						placeholder="Select a drug class"
						value={drugClass}
						options={drugClasses.map((value) => ({ value, label: value }))}
						onChange={(e) => setDrugClass(e.target.value)}
					/>
				) : (
					<MissingData
						message="None of your prescription or medication records has a drug class yet."
						href={pageRoutes.dashboardRoutes.RECORDS}
						linkLabel="Go to records"
					/>
				))}

			<Button
				className="w-full"
				isLoading={isPending}
				disabled={!claim || isPending}
				onClick={handleSubmit}
			>
				Generate Proof
			</Button>
		</div>
	);
}
