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
import { useUpdateMedHistory } from "../../med-history/hooks";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileSkeleton from "../../../components/shared/skeletons/ProfileSkeleton";

// Only `currentlyTakingMedication` from this endpoint's fields is actually
// usable here. Conditions (diabetes, hypertension, etc.) are the other half
// of what /api/v1/med-history is meant for, but its source catalog
// (/api/v1/medical-conditions) is documented as "Stub — not yet
// implemented" — no GET, admin-only — so there's no real list of conditions
// to build a picker against yet. Revisit once that endpoint is live.
const MedicalHistorySchema = z.object({
	currently_taking_medication: z.enum(["yes", "no"], {
		error: "Please select an option",
	}),
});

type MedicalHistoryValues = z.infer<typeof MedicalHistorySchema>;

export default function MedicalHistoryTab() {
	const [isEditing, setIsEditing] = useState(false);
	// There's no GET for med-history itself, but medical-profile mirrors the
	// same `currentlyTakingMedication` flag — reuse that to prefill instead
	// of always defaulting to blank.
	const { data: medicalProfile, isLoading } = useMedicalProfile();
	const { mutate: updateMedHistory, isPending } = useUpdateMedHistory();

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

	const onSubmit = (values: MedicalHistoryValues) => {
		updateMedHistory(
			{
				conditionIds: [],
				currentlyTakingMedication: values.currently_taking_medication === "yes",
			},
			{ onSuccess: () => setIsEditing(false) },
		);
	};

	if (isLoading) {
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

				<div className="rounded-[8px] border border-dashed border-[#E5E5E5] p-3 text-sm text-[#9B9B9B]">
					Existing conditions (diabetes, hypertension, etc.) will be
					selectable here once that part of the system is switched on —
					it isn&apos;t yet.
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
