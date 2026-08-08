"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { useCreateMedicalCondition } from "../hooks";
import { useMedicalConditions } from "../../med-history/hooks";

const ConditionSchema = z.object({
	name: z.string().trim().min(2, "Name is required").max(150, "Name is too long"),
	description: z
		.string()
		.trim()
		.max(500, "Description is too long")
		.optional()
		.or(z.literal("")),
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
		defaultValues: { name: "", description: "" },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: ConditionValues) => {
		createCondition(
			{ name: values.name, description: values.description || undefined },
			{ onSuccess: () => form.reset() },
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
					. Listing and creating are both live; creation&apos;s exact
					request fields aren&apos;t published though, so the form below
					is a best guess.
				</p>
			</div>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 sm:max-w-115"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<FormItem>
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
							name="description"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<InputField
											{...field}
											label="Description (optional)"
											placeholder="Brief description shown to patients"
											type="text"
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
							className="w-full sm:w-fit"
						>
							Create Condition
						</Button>
					</form>
				</Form>
			</div>

			{isLoading ? (
				<TableSkeleton rows={6} columns={2} />
			) : (
				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<p className="mb-3 font-semibold">Active Conditions</p>

					{conditions.length === 0 ? (
						<p className="py-6 text-center text-sm text-[#9B9B9B]">
							No conditions created yet
						</p>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full min-w-100 text-sm">
								<thead>
									<tr className="text-left text-xs text-[#9B9B9B]">
										<th className="whitespace-nowrap pb-3 pr-4 font-normal">
											Name
										</th>
										<th className="whitespace-nowrap pb-3 font-normal">
											Description
										</th>
									</tr>
								</thead>

								<tbody className="divide-y divide-[#F5F5F5]">
									{conditions.map((condition) => (
										<tr key={condition.id}>
											<td className="whitespace-nowrap py-3 pr-4 font-medium">
												{condition.name}
											</td>
											<td className="py-3 text-[#9B9B9B]">
												{condition.description ?? "—"}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
