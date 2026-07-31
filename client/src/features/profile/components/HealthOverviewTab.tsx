"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { ProfileHealthOverviewSchema } from "../../../lib/validations/profileValidations";
import ProfileFormFooter from "./ProfileFormFooter";

type ProfileHealthOverviewValues = z.infer<typeof ProfileHealthOverviewSchema>;

const sugarLevelOptions = [
	{ label: "Low", value: "low" },
	{ label: "Normal", value: "normal" },
	{ label: "High", value: "high" },
];

const medicationOptions = [
	{ label: "None", value: "none" },
	{ label: "Antibiotics", value: "antibiotics" },
	{ label: "Antihypertensives", value: "antihypertensives" },
	{ label: "Insulin", value: "insulin" },
	{ label: "Painkillers", value: "painkillers" },
	{ label: "Other", value: "other" },
];

const allergyOptions = [
	{ label: "None", value: "none" },
	{ label: "Food Allergies", value: "food_allergies" },
	{ label: "Drug Allergies", value: "drug_allergies" },
	{ label: "Environmental Allergies", value: "environmental_allergies" },
	{ label: "Other", value: "other" },
];

const hivStatusOptions = [
	{ label: "Negative", value: "negative" },
	{ label: "Positive", value: "positive" },
	{ label: "Unknown", value: "unknown" },
];

export default function HealthOverviewTab() {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<ProfileHealthOverviewValues>({
		resolver: zodResolver(ProfileHealthOverviewSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			body_weight: "89kg",
			sugar_level: "normal",
			medication: "antibiotics",
			allergies: "food_allergies",
			allergic_to: "Milk, peanut",
			hiv_status: "negative",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;

	const onSubmit = (values: ProfileHealthOverviewValues) => {
		console.log(values);
		setIsLoading(true);

		setTimeout(() => {
			toast.success("Health overview updated successfully");
			setIsLoading(false);
			setIsEditing(false);
		}, 1500);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 my-5 sm:max-w-115"
			>
				<FormField
					control={form.control}
					name="body_weight"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<InputField
									{...field}
									label="Body weight"
									placeholder="e.g. 70kg"
									type="text"
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
					name="sugar_level"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<SelectField
									name={field.name}
									label="Sugar Level"
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									disabled={disabled}
									options={sugarLevelOptions}
									error={fieldState.error?.message ?? null}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="medication"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<SelectField
									name={field.name}
									label="Medication"
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									disabled={disabled}
									options={medicationOptions}
									error={fieldState.error?.message ?? null}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="allergies"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										label="Allergies"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={disabled}
										options={allergyOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="allergic_to"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Things Allergic to?"
										placeholder="e.g. Milk, peanut"
										type="text"
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
					name="hiv_status"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<SelectField
									name={field.name}
									label="HIV Status last know"
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									disabled={disabled}
									options={hivStatusOptions}
									error={fieldState.error?.message ?? null}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<ProfileFormFooter
					isEditing={isEditing}
					onEdit={() => setIsEditing(true)}
					isLoading={isLoading}
					disabled={disabled || !isValid || isSubmitting}
				/>
			</form>
		</Form>
	);
}
