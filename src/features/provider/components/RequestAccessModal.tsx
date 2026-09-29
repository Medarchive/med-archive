"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Modal from "../../../components/ui/custom/Modal";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { useRequestRecordAccess } from "../hooks";
import { ClinicalProofType } from "../../clinical-proofs/types";
import { getClinicalProofTypeLabel } from "../../clinical-proofs/constants";

// A request targets exactly one thing — a specific record, or a clinical
// disclosure proof type (the patient then generates that proof and the
// provider verifies it, seeing only the disclosed fact).
export type RequestTarget =
	| { kind: "record"; recordId: string; title: string }
	| { kind: "proof"; proofType: ClinicalProofType };

const RequestAccessSchema = z.object({
	requestType: z
		.string()
		.trim()
		.min(2, "Describe what you're requesting")
		.max(150, "Too long"),
	note: z.string().trim().max(500, "Note is too long").optional().or(z.literal("")),
});

type RequestAccessValues = z.infer<typeof RequestAccessSchema>;

interface RequestAccessModalProps {
	open: boolean;
	onClose: () => void;
	// The id from the lookup result, rather than whichever identifier the
	// search used — lookup accepts `userId` but this endpoint only takes
	// patientId/careId/email, so passing the search params through broke
	// requests made after a User ID search.
	patientId: string;
	target: RequestTarget;
	onRequested: (requestId: string) => void;
}

export default function RequestAccessModal({
	open,
	onClose,
	patientId,
	target,
	onRequested,
}: RequestAccessModalProps) {
	const targetLabel =
		target.kind === "record"
			? target.title
			: `${getClinicalProofTypeLabel(target.proofType)} proof`;

	const { mutate: requestAccess, isPending } = useRequestRecordAccess();

	const form = useForm<RequestAccessValues>({
		resolver: zodResolver(RequestAccessSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { requestType: "", note: "" },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: RequestAccessValues) => {
		requestAccess(
			{
				patientId,
				...(target.kind === "record"
					? { recordId: target.recordId }
					: { proofType: target.proofType }),
				requestType: values.requestType,
				note: values.note || undefined,
			},
			{
				onSuccess: (data) => {
					onRequested(data.data.id);
					form.reset();
					onClose();
				},
			},
		);
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={target.kind === "record" ? "Request Access" : "Request Clinical Proof"}
		>
			<div className="mb-4 rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm">
				<span className="text-[#9B9B9B]">
					{target.kind === "record" ? "Requesting access to " : "Requesting a "}
				</span>
				<span className="font-semibold">{targetLabel}</span>
				{target.kind === "proof" && (
					<p className="mt-1 text-xs text-[#9B9B9B]">
						You&apos;ll only see the fact the patient proves — not the
						records behind it.
					</p>
				)}
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="requestType"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="What are you requesting?"
										placeholder={
											target.kind === "record"
												? "e.g. Lab results, full history"
												: "e.g. Blood group confirmation"
										}
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
						name="note"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Note (optional)"
										placeholder="Additional context for the patient"
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
						className="w-full"
					>
						Send Request
					</Button>
				</form>
			</Form>
		</Modal>
	);
}
