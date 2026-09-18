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
import { useRequestRecordAccess, PatientLookupParams } from "../hooks";

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
	// Whichever identifier the lookup was made with — reused as-is so the
	// request targets the same patient without asking the provider to
	// re-enter it.
	patientIdentifier: PatientLookupParams;
	// Scoped to one specific record picked from the lookup's title dropdown
	// — not a blanket "everything" request.
	recordId: string;
	recordTitle: string;
	onRequested: (requestId: string) => void;
}

export default function RequestAccessModal({
	open,
	onClose,
	patientIdentifier,
	recordId,
	recordTitle,
	onRequested,
}: RequestAccessModalProps) {
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
				...patientIdentifier,
				recordId,
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
		<Modal open={open} onClose={onClose} title="Request Access">
			<div className="mb-4 rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm">
				<span className="text-[#9B9B9B]">Requesting access to </span>
				<span className="font-semibold">{recordTitle}</span>
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
										placeholder="e.g. Lab results, full history"
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
