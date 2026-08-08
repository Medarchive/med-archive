"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import Skeleton from "../../../components/ui/custom/Skeleton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import SelectField from "../../../components/ui/custom/SelectField";
import { useCreateMedicalCondition } from "../hooks";
import { useMedicalConditions } from "../../med-history/hooks";
import { ConditionCategory } from "../../med-history/types";

const categoryOptions: { label: string; value: ConditionCategory }[] = [
	{ label: "Disease", value: "DISEASE" },
	{ label: "Allergy", value: "ALLERGY" },
	{ label: "Condition", value: "CONDITION" },
];

const ConditionSchema = z.object({
	name: z.string().trim().min(2, "Name is required").max(150, "Name is too long"),
	category: z.enum(["DISEASE", "ALLERGY", "CONDITION"], {
		message: "Category is required",
	}),
});

type ConditionValues = z.infer<typeof ConditionSchema>;

export default function MedicalConditionsPage() {
	const { data, isLoading } = useMedicalConditions({ take: 50 });
	const { mutate: createCondition, isPending } = useCreateMedicalCondition();

	const conditions = data?.data ?? [];

	const form = useForm<ConditionValues>({
		resolver: zodResolver(ConditionSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { name: "", category: undefined },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: ConditionValues) => {
		createCondition(
			{ name: values.name, category: values.category },
			{ onSuccess: () => form.reset({ name: "", category: undefined }) },
		);
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Medical Conditions</h1>

			<div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
				<TriangleAlert className="mt-0.5 size-4 shrink-0" />
				<p>
					Editing or deactivating a condition isn&apos;t possible yet —
					those endpoints are still documented as{" "}
					<span className="font-semibold">
						&quot;Stub — not yet implemented&quot;
					</span>
					. Listing and creating are both live — creation takes a name and
					a category (a description field was tried and confirmed
					rejected by the API).
				</p>
			</div>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-3 sm:max-w-150 sm:flex-row sm:items-end"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<FormItem className="flex-1">
									<FormControl>
										<InputField
											{...field}
											label="Condition Name"
											placeholder="e.g. Type 2 Diabetes"
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
							name="category"
							render={({ field, fieldState }) => (
								<FormItem className="w-full sm:w-40">
									<FormControl>
										<SelectField
											name={field.name}
											label="Category"
											placeholder="Select"
											value={field.value ?? ""}
											onChange={(e) => field.onChange(e.target.value)}
											options={categoryOptions}
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							isLoading={isPending}
							disabled={!isValid || isSubmitting}
						>
							Create Condition
						</Button>
					</form>
				</Form>
			</div>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<p className="mb-3 font-semibold">Active Conditions</p>

				{isLoading ? (
					<div className="flex flex-wrap gap-2">
						<Skeleton className="h-8 w-28 rounded-full" />
						<Skeleton className="h-8 w-32 rounded-full" />
						<Skeleton className="h-8 w-24 rounded-full" />
					</div>
				) : conditions.length === 0 ? (
					<p className="py-6 text-center text-sm text-[#9B9B9B]">
						No conditions created yet
					</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{conditions.map((condition) => (
							<span
								key={condition.id}
								className="flex items-center gap-1.5 rounded-full border border-[#E5E5E5] px-3 py-1.5 text-sm font-medium"
							>
								{condition.name}
								<span className="text-xs font-normal text-[#9B9B9B]">
									{condition.category}
								</span>
							</span>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
