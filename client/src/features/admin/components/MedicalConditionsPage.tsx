"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { useCreateMedicalCondition } from "../hooks";

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
	const { mutate: createCondition, isPending } = useCreateMedicalCondition();

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
					The backend for this section is documented as{" "}
					<span className="font-semibold">
						&quot;Stub — not yet implemented&quot;
					</span>{" "}
					with no request/response schema published — the fields below are a
					best guess, not confirmed against a real response. There&apos;s
					also no endpoint yet to list existing conditions, so this is
					create-only for now; editing or deactivating a condition isn&apos;t
					possible until that&apos;s built.
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
		</div>
	);
}
