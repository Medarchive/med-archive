"use client";
import { useEffect } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
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
import { pageRoutes } from "../../../lib/config/routes";
import { useMedicalProfile, useUpdateMedicalProfile } from "../../medical-profile/hooks";
import { bloodGroupLabels, BloodGroup, Genotype } from "../../medical-profile/types";

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

export default function MedicalProfileForm() {
	const router = useRouter();
	// In case they've already filled this in and hit back — pre-fill rather
	// than show a blank form over data that's already saved.
	const { data: medicalProfile } = useMedicalProfile();
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

	const onSubmit = (values: MedicalProfileValues) => {
		updateMedicalProfile(
			{
				bloodGroup: values.blood_group,
				genotype: values.genotype,
				heightCm: Number(values.height_cm),
				weightKg: Number(values.weight_kg),
				currentlyTakingMedication: values.currently_taking_medication === "yes",
			},
			{ onSuccess: () => router.push(pageRoutes.authRoutes.GET_STARTED) },
		);
	};

	const handleSkip = () => router.push(pageRoutes.authRoutes.GET_STARTED);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-5">
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
										className="accent-primary size-4"
									/>
									No
								</label>
							</div>

							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>

				{/* Existing conditions (diabetes, hypertension, etc.) live on your
				    account under Profile → Medical History once you're signed in —
				    the backend's condition catalog isn't ready to collect that here. */}

				<div className="flex flex-col gap-2 pt-2 sm:flex-row-reverse">
					<Button
						type="submit"
						isLoading={isPending}
						disabled={!isValid || isSubmitting}
						className="flex-1"
					>
						Continue
					</Button>

					<Button
						type="button"
						variant="ghost"
						onClick={handleSkip}
						disabled={isPending}
						className="flex-1"
					>
						Skip for now
					</Button>
				</div>
			</form>
		</Form>
	);
}
