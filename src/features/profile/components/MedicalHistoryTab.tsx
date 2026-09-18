"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { useMedicalProfile } from "../../medical-profile/hooks";
import { useMedicalConditions, useUpdateMedHistory } from "../../med-history/hooks";
import { ConditionData } from "../../med-history/types";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileSkeleton from "../../../components/shared/skeletons/ProfileSkeleton";

const MedicalHistorySchema = z.object({
	currently_taking_medication: z.enum(["yes", "no"], {
		error: "Please select an option",
	}),
});

type MedicalHistoryValues = z.infer<typeof MedicalHistorySchema>;

export default function MedicalHistoryTab() {
	const [isEditing, setIsEditing] = useState(false);
	const [selectedConditionIds, setSelectedConditionIds] = useState<string[]>([]);
	// Tracks which server-side `conditions` value selectedConditionIds was
	// last synced from, so the render-phase sync below (React's recommended
	// "adjust state when a prop changes" pattern — no effect needed, avoids
	// the cascading-render lint warning a useEffect+setState here would hit)
	// only fires once per real data change, not every render.
	const [syncedConditions, setSyncedConditions] = useState<ConditionData[] | undefined>(
		undefined,
	);

	// There's no GET for med-history itself, but medical-profile mirrors the
	// same `currentlyTakingMedication` flag — reuse that to prefill instead
	// of always defaulting to blank.
	const { data: medicalProfile, isLoading: isProfileLoading } = useMedicalProfile();
	const { data: conditionsData, isLoading: isConditionsLoading } = useMedicalConditions({
		take: 100,
	});
	const { mutate: updateMedHistory, isPending } = useUpdateMedHistory();

	const conditions = conditionsData?.data ?? [];

	// GET /api/v1/medical-profile returns a `conditions` array (full condition
	// objects, confirmed via a real response) — that's the actual source of
	// truth for what's already on file, so previously saved conditions now
	// show pre-checked instead of always starting blank.
	if (medicalProfile?.conditions !== syncedConditions) {
		setSyncedConditions(medicalProfile?.conditions);
		setSelectedConditionIds(
			medicalProfile?.conditions?.map((condition) => condition.id) ?? [],
		);
	}

	const form = useForm<MedicalHistoryValues>({
		resolver: zodResolver(MedicalHistorySchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			currently_taking_medication: undefined,
		},
	});

	useEffect(() => {
		if (medicalProfile?.currentlyTakingMedication === undefined) return;

		form.reset({
			currently_taking_medication: medicalProfile.currentlyTakingMedication
				? "yes"
				: "no",
		});
	}, [medicalProfile, form]);

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;

	const toggleCondition = (id: string) => {
		if (disabled) return;

		setSelectedConditionIds((prev) =>
			prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id],
		);
	};

	const onSubmit = (values: MedicalHistoryValues) => {
		updateMedHistory(
			{
				conditionIds: selectedConditionIds,
				currentlyTakingMedication: values.currently_taking_medication === "yes",
			},
			{
				// selectedConditionIds isn't reset here — the medical-profile
				// invalidation this triggers refetches `conditions`, and the
				// effect above re-syncs the picker from that real data.
				onSuccess: () => setIsEditing(false),
			},
		);
	};

	if (isProfileLoading) {
		return <ProfileSkeleton />;
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 my-5 sm:max-w-115"
			>
				<FormField
					control={form.control}
					name="currently_taking_medication"
					render={({ field, fieldState }) => (
						<FormItem>
							<label className="text-sm font-medium">
								Currently taking medication?
							</label>

							<div className="flex items-center gap-6">
								<label className="flex items-center gap-2 text-sm cursor-pointer">
									<input
										type="radio"
										value="yes"
										checked={field.value === "yes"}
										onChange={field.onChange}
										disabled={disabled}
										className="accent-primary size-4"
									/>
									Yes
								</label>

								<label className="flex items-center gap-2 text-sm cursor-pointer">
									<input
										type="radio"
										value="no"
										checked={field.value === "no"}
										onChange={field.onChange}
										disabled={disabled}
										className="accent-primary size-4"
									/>
									No
								</label>
							</div>

							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>

				<div>
					<label className="text-sm font-medium">Existing Conditions</label>

					{/* There's no GET for med-history itself, but GET
					    /medical-profile returns a real `conditions` list — used
					    above to pre-check what's already on file. Note: saving
					    only appends (confirmed via the docs), so unchecking an
					    already-saved condition here won't remove it server-side
					    yet — no PATCH/DELETE call is wired up for that. */}
					<p className="mt-1 text-xs text-[#9B9B9B]">
						Select any that apply. Previously saved conditions show
						pre-checked; re-selecting them won&apos;t cause duplicates.
					</p>

					{isConditionsLoading ? (
						<p className="mt-3 text-sm text-[#9B9B9B]">Loading conditions...</p>
					) : conditions.length === 0 ? (
						<p className="mt-3 text-sm text-[#9B9B9B]">
							No conditions available to select yet.
						</p>
					) : (
						<div className="mt-3 grid gap-2 sm:grid-cols-2">
							{conditions.map((condition) => (
								<label
									key={condition.id}
									className="flex items-center gap-2 text-sm cursor-pointer"
								>
									<input
										type="checkbox"
										checked={selectedConditionIds.includes(condition.id)}
										onChange={() => toggleCondition(condition.id)}
										disabled={disabled}
										className="accent-primary size-4"
									/>
									{condition.name}
								</label>
							))}
						</div>
					)}
				</div>

				<ProfileFormFooter
					isEditing={isEditing}
					onEdit={() => setIsEditing(true)}
					isLoading={isPending}
					disabled={disabled || !isValid || isSubmitting}
				/>
			</form>
		</Form>
	);
}
