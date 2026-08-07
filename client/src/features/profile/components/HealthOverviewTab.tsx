"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { MedicalProfileSchema } from "../../../lib/validations/profileValidations";
import { useMedicalProfile, useUpdateMedicalProfile } from "../../medical-profile/hooks";
import { bloodGroupLabels, BloodGroup, Genotype } from "../../medical-profile/types";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileSkeleton from "../../../components/shared/skeletons/ProfileSkeleton";

type MedicalProfileValues = z.infer<typeof MedicalProfileSchema>;

const bloodGroupOptions = (Object.keys(bloodGroupLabels) as BloodGroup[]).map((value) => ({
	label: bloodGroupLabels[value],
	value,
}));

const genotypeOptions: { label: string; value: Genotype }[] = [
	{ label: "AA", value: "AA" },
	{ label: "AS", value: "AS" },
	{ label: "SS", value: "SS" },
	{ label: "AC", value: "AC" },
	{ label: "SC", value: "SC" },
];

const emptyDefaults: MedicalProfileValues = {
	blood_group: "" as MedicalProfileValues["blood_group"],
	genotype: "" as MedicalProfileValues["genotype"],
	height_cm: "",
	weight_kg: "",
	currently_taking_medication: "" as MedicalProfileValues["currently_taking_medication"],
};

export default function HealthOverviewTab() {
	const [isEditing, setIsEditing] = useState(false);
	const { data: medicalProfile, isLoading } = useMedicalProfile();
	const { mutate: updateMedicalProfile, isPending } = useUpdateMedicalProfile();

	const form = useForm<MedicalProfileValues>({
		resolver: zodResolver(MedicalProfileSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		if (!medicalProfile) return;

		form.reset({
			blood_group: medicalProfile.bloodGroup ?? emptyDefaults.blood_group,
			genotype: medicalProfile.genotype ?? emptyDefaults.genotype,
			height_cm: medicalProfile.heightCm ? String(medicalProfile.heightCm) : "",
			weight_kg: medicalProfile.weightKg ? String(medicalProfile.weightKg) : "",
			currently_taking_medication:
				medicalProfile.currentlyTakingMedication === undefined
					? emptyDefaults.currently_taking_medication
					: medicalProfile.currentlyTakingMedication
						? "yes"
						: "no",
		});
	}, [medicalProfile, form]);

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;

	const onSubmit = (values: MedicalProfileValues) => {
		updateMedicalProfile(
			{
				bloodGroup: values.blood_group,
				genotype: values.genotype,
				heightCm: Number(values.height_cm),
				weightKg: Number(values.weight_kg),
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
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="blood_group"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										label="Blood Group"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={disabled}
										options={bloodGroupOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="genotype"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										label="Genotype"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={disabled}
										options={genotypeOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="height_cm"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Height (cm)"
										placeholder="e.g. 170.5"
										type="number"
										disabled={disabled}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="weight_kg"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Weight (kg)"
										placeholder="e.g. 68"
										type="number"
										disabled={disabled}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

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

				{/* "Active conditions" is part of the medical profile shown
				    elsewhere in the app, but /api/v1/medical-conditions (the
				    endpoint that would manage them) is documented as
				    "Stub — not yet implemented" on the backend — no form for it
				    here until that lands. */}

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
