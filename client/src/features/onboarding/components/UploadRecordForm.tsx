"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import FileDropzone from "../../../components/ui/custom/FileDropzone";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadRecordSchema } from "../../../lib/validations/onboardingValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { toast } from "sonner";
import { pageRoutes } from "../../../lib/config/routes";

type UploadRecordValues = z.infer<typeof UploadRecordSchema>;

const recordTypeOptions = [
	{ label: "Lab test result", value: "lab_test_result" },
	{ label: "Prescription", value: "prescription" },
	{ label: "Vaccination record", value: "vaccination_record" },
	{ label: "Discharge summary", value: "discharge_summary" },
	{ label: "Imaging / Scan", value: "imaging_scan" },
	{ label: "Other", value: "other" },
];

const orderedByOptions = [
	{ label: "Self", value: "self" },
	{ label: "Doctor", value: "doctor" },
	{ label: "Hospital / Clinic", value: "hospital_clinic" },
	{ label: "Other", value: "other" },
];

const facilityOptions = [
	{ label: "General Hospital", value: "general_hospital" },
	{ label: "St. Mary's Clinic", value: "st_marys_clinic" },
	{ label: "City Diagnostics Lab", value: "city_diagnostics_lab" },
	{ label: "Other", value: "other" },
];

export default function UploadRecordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const router = useRouter();

	const form = useForm<UploadRecordValues>({
		resolver: zodResolver(UploadRecordSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			record_type: undefined,
			ordered_by: undefined,
			facility: "",
			description: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: UploadRecordValues) => {
		console.log(values, files);
		setIsLoading(true);

		setTimeout(() => {
			toast.success("Record uploaded successfully");
			setIsLoading(false);
			router.push(pageRoutes.HOME);
		}, 2000);
	};

	return (
		<div className="flex justify-center py-16">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-3 w-full sm:max-w-115"
				>
					<FileDropzone name="media" files={files} onChange={setFiles} />

					<FormField
						control={form.control}
						name="record_type"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										placeholder="Lab test result"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										options={recordTypeOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="ordered_by"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										placeholder="Ordered By"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										options={orderedByOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="facility"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										placeholder="Facility"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										options={facilityOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Description"
										type="text"
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-center pt-2">
						<Button
							type="submit"
							isLoading={isLoading}
							disabled={!isValid || isSubmitting}
						>
							Upload Record
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
