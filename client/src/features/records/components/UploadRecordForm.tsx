"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import DateField from "../../../components/ui/custom/DateField";
import FileDropzone from "../../../components/ui/custom/FileDropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
	CreateHealthRecordSchema,
	CreateHealthRecordValues,
} from "../../../lib/validations/recordsValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { useCreateHealthRecord } from "../hooks";
import { recordTypeOrder, recordTypeConfig } from "../types";

interface UploadRecordFormProps {
	onSuccess?: () => void;
}

const recordTypeOptions = recordTypeOrder.map((type) => ({
	label: recordTypeConfig[type].tabLabel,
	value: type,
}));

const allergyTypeOptions = [
	{ label: "Food", value: "FOOD" },
	{ label: "Drug", value: "DRUG" },
	{ label: "Environmental", value: "ENVIRONMENTAL" },
	{ label: "Insect", value: "INSECT" },
	{ label: "Latex", value: "LATEX" },
	{ label: "Other", value: "OTHER" },
];

export default function UploadRecordForm({ onSuccess }: UploadRecordFormProps) {
	const [files, setFiles] = useState<File[]>([]);
	const { mutate: createRecord, isPending } = useCreateHealthRecord();

	const form = useForm<CreateHealthRecordValues>({
		resolver: zodResolver(CreateHealthRecordSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			title: "",
			recordType: undefined,
			recordDate: "",
			description: "",
			testName: "",
			referredBy: "",
			prescribedBy: "",
			drugClass: "",
			drug: "",
			dosage: "",
			frequency: "",
			endDate: "",
			allergyType: undefined,
			cause: "",
			management: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	// eslint-disable-next-line react-hooks/incompatible-library
	const recordType = form.watch("recordType");

	const onSubmit = (values: CreateHealthRecordValues) => {
		const formData = new FormData();
		formData.append("title", values.title);
		formData.append("recordType", values.recordType);

		if (values.recordDate) formData.append("recordDate", values.recordDate);
		if (values.description) formData.append("description", values.description);

		const typeFields: Record<string, string | undefined> = {
			testName: values.testName,
			referredBy: values.referredBy,
			prescribedBy: values.prescribedBy,
			drugClass: values.drugClass,
			drug: values.drug,
			dosage: values.dosage,
			frequency: values.frequency,
			endDate: values.endDate,
			allergyType: values.allergyType,
			cause: values.cause,
			management: values.management,
		};

		Object.entries(typeFields).forEach(([key, value]) => {
			if (value) formData.append(key, value);
		});

		files.forEach((file) => formData.append("files", file));

		createRecord(formData, {
			onSuccess: () => {
				form.reset();
				setFiles([]);
				onSuccess?.();
			},
		});
	};

	return (
		<div className="flex justify-center py-16">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-3 w-full sm:max-w-115"
				>
					<FileDropzone name="files" files={files} onChange={setFiles} />

					<FormField
						control={form.control}
						name="title"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Record title"
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
						name="recordType"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										placeholder="Record type"
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

					{recordType === "LAB_TEST" && (
						<>
							<FormField
								control={form.control}
								name="testName"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Test Name"
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
								name="referredBy"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Referred By"
												type="text"
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{recordType === "PRESCRIPTION" && (
						<>
							<FormField
								control={form.control}
								name="prescribedBy"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Prescribed By"
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
								name="drugClass"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Drug Class"
												type="text"
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					{recordType === "MEDICATION" && (
						<>
							<FormField
								control={form.control}
								name="drug"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Drug"
												type="text"
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid gap-3 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="dosage"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormControl>
												<InputField
													{...field}
													label=""
													placeholder="Dosage"
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
									name="frequency"
									render={({ field, fieldState }) => (
										<FormItem>
											<FormControl>
												<InputField
													{...field}
													label=""
													placeholder="Frequency"
													type="text"
													error={fieldState.error?.message ?? null}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</>
					)}

					{recordType === "ALLERGY" && (
						<>
							<FormField
								control={form.control}
								name="allergyType"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<SelectField
												name={field.name}
												placeholder="Allergy Type"
												value={field.value}
												onChange={field.onChange}
												onBlur={field.onBlur}
												options={allergyTypeOptions}
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="cause"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Cause"
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
								name="management"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Management"
												type="text"
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</>
					)}

					<FormField
						control={form.control}
						name="recordDate"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<DateField
										name={field.name}
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										max={new Date().toISOString().split("T")[0]}
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
							isLoading={isPending}
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
