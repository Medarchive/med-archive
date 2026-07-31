"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MedicalHistorySchema } from "../../../lib/validations/onboardingValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { toast } from "sonner";
import { pageRoutes } from "../../../lib/config/routes";

type MedicalHistoryValues = z.infer<typeof MedicalHistorySchema>;

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

export default function MedicalHistoryForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<MedicalHistoryValues>({
		resolver: zodResolver(MedicalHistorySchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			body_weight: "",
			sugar_level: undefined,
			medication: undefined,
			allergies: undefined,
			hiv_status: undefined,
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: MedicalHistoryValues) => {
		console.log(values);
		setIsLoading(true);

		setTimeout(() => {
			toast.success("Submitted Successfully");
			setIsLoading(false);
			router.push(pageRoutes.authRoutes.GET_STARTED);
		}, 2000);
	};

	return (
		<div>
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
										options={medicationOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
										options={hivStatusOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						isLoading={isLoading}
						disabled={!isValid || isSubmitting}
						className="w-full mt-4"
					>
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
}
