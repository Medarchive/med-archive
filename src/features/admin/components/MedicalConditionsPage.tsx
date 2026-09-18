"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import ConfirmModal from "../../../components/ui/custom/ConfirmModal";
import Modal from "../../../components/ui/custom/Modal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import SelectField from "../../../components/ui/custom/SelectField";
import {
	useCreateMedicalCondition,
	useDeactivateMedicalCondition,
	useUpdateMedicalCondition,
} from "../hooks";
import { useMedicalConditions } from "../../med-history/hooks";
import { ConditionCategory, ConditionData } from "../../med-history/types";

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

// Separate from ConditionSchema — sortOrder only makes sense to touch once a
// condition already exists (create defaults it to 0 server-side). Kept as a
// string field (same pattern as height/weight elsewhere in this app) and
// converted to a number on submit, rather than z.coerce — mixing an
// input/output type mismatch into a react-hook-form resolver here trips up
// its generic inference.
const EditConditionSchema = ConditionSchema.extend({
	sortOrder: z
		.string()
		.trim()
		.regex(/^-?\d+$/, "Whole numbers only"),
});

type EditConditionValues = z.infer<typeof EditConditionSchema>;

function EditConditionModal({
	condition,
	onClose,
}: {
	condition: ConditionData | null;
	onClose: () => void;
}) {
	const { mutate: updateCondition, isPending } = useUpdateMedicalCondition();

	const form = useForm<EditConditionValues>({
		resolver: zodResolver(EditConditionSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { name: "", category: undefined, sortOrder: "0" },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	useEffect(() => {
		if (!condition) return;

		form.reset({
			name: condition.name,
			category: condition.category,
			sortOrder: String(condition.sortOrder),
		});
	}, [condition, form]);

	const onSubmit = (values: EditConditionValues) => {
		if (!condition) return;

		updateCondition(
			{
				id: condition.id,
				payload: {
					name: values.name,
					category: values.category,
					sortOrder: Number(values.sortOrder),
				},
			},
			{ onSuccess: onClose },
		);
	};

	return (
		<Modal open={!!condition} onClose={onClose} title="Edit Condition">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Condition Name"
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
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										label="Category"
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

					<FormField
						control={form.control}
						name="sortOrder"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Sort Order"
										type="number"
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
						className="w-full"
					>
						Save Changes
					</Button>
				</form>
			</Form>
		</Modal>
	);
}

export default function MedicalConditionsPage() {
	const [editingCondition, setEditingCondition] = useState<ConditionData | null>(null);
	const [deactivatingId, setDeactivatingId] = useState<string | null>(null);

	const { data, isLoading } = useMedicalConditions({ take: 50 });
	const { mutate: createCondition, isPending } = useCreateMedicalCondition();
	const { mutate: deactivateCondition, isPending: isDeactivating } =
		useDeactivateMedicalCondition();

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
					Deactivating a condition is a soft-delete — it stops appearing
					here immediately (the list only ever shows active conditions),
					and there&apos;s no way to bring it back through this screen.
					A description field was tried on create and confirmed rejected
					by the API — name, category and sort order are the only fields
					in play.
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

			<div className="min-w-0 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<p className="mb-3 font-semibold">Active Conditions</p>

				{isLoading ? (
					<TableSkeleton rows={5} columns={4} />
				) : conditions.length === 0 ? (
					<p className="py-6 text-center text-sm text-[#9B9B9B]">
						No conditions created yet
					</p>
				) : (
					<div className="min-w-0 overflow-x-auto">
						<table className="w-full min-w-140 text-sm">
							<thead>
								<tr className="text-left text-xs text-[#9B9B9B]">
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">
										Name
									</th>
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">
										Category
									</th>
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">
										Sort Order
									</th>
									<th className="whitespace-nowrap pb-3 font-normal text-right">
										Actions
									</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-[#F5F5F5]">
								{conditions.map((condition) => (
									<tr key={condition.id}>
										<td className="whitespace-nowrap py-3 pr-4 font-medium">
											{condition.name}
										</td>
										<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
											{condition.category}
										</td>
										<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
											{condition.sortOrder}
										</td>
										<td className="whitespace-nowrap py-3 text-right">
											<div className="flex justify-end gap-2">
												<Button
													size="sm"
													variant="ghost"
													onClick={() => setEditingCondition(condition)}
												>
													<Pencil className="size-3.5" />
													Edit
												</Button>

												<Button
													size="sm"
													variant="destructive"
													onClick={() => setDeactivatingId(condition.id)}
												>
													<Trash2 className="size-3.5" />
													Deactivate
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			<EditConditionModal
				condition={editingCondition}
				onClose={() => setEditingCondition(null)}
			/>

			<ConfirmModal
				open={!!deactivatingId}
				message="Deactivate this condition? It will no longer appear in this list or in condition pickers."
				isLoading={isDeactivating}
				onConfirm={() => {
					if (!deactivatingId) return;
					deactivateCondition(deactivatingId, {
						onSuccess: () => setDeactivatingId(null),
					});
				}}
				onCancel={() => setDeactivatingId(null)}
			/>
		</div>
	);
}
