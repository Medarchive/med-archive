"use client";

import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TriangleAlert } from "lucide-react";
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
import { pageRoutes } from "../../../lib/config/routes";
import { useWallet } from "../../wallet/hooks";
import { useCreateServiceOrder } from "../hooks";

const CreateServiceOrderSchema = z.object({
	description: z
		.string()
		.trim()
		.min(2, "Describe the service")
		.max(200, "Too long"),
	// Same rule as the API: a plain decimal string with at most 7 places
	// (Stellar's precision) — kept as a string end to end, never a float.
	amount: z
		.string()
		.trim()
		.regex(/^\d+(\.\d{1,7})?$/, "Enter an amount like 25 or 25.50 (up to 7 decimals)")
		.refine((value) => /[1-9]/.test(value), "Amount must be more than 0"),
});

type CreateServiceOrderValues = z.infer<typeof CreateServiceOrderSchema>;

interface CreateServiceOrderModalProps {
	open: boolean;
	onClose: () => void;
	patientId: string;
	patientName: string;
	onCreated?: (orderId: string) => void;
}

export default function CreateServiceOrderModal({
	open,
	onClose,
	patientId,
	patientName,
	onCreated,
}: CreateServiceOrderModalProps) {
	const { data: wallet, isLoading: isWalletLoading } = useWallet();
	const { mutate: createOrder, isPending } = useCreateServiceOrder();

	const form = useForm<CreateServiceOrderValues>({
		resolver: zodResolver(CreateServiceOrderSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { description: "", amount: "" },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	// Payment goes to the provider's own wallet, snapshotted onto the order
	// — so there has to be a verified one before an order can exist.
	const walletReady = !!wallet?.verifiedAt;

	const onSubmit = (values: CreateServiceOrderValues) => {
		createOrder(
			{ patientId, description: values.description, amount: values.amount },
			{
				onSuccess: (data) => {
					form.reset();
					onClose();
					onCreated?.(data.data.id);
				},
			},
		);
	};

	return (
		<Modal open={open} onClose={onClose} title="New Service Order">
			<div className="mb-4 rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm">
				<span className="text-[#9B9B9B]">Billing </span>
				<span className="font-semibold">{patientName}</span>
				<span className="text-[#9B9B9B]"> — paid in USDC to your wallet.</span>
			</div>

			{!isWalletLoading && !walletReady && (
				<div className="mb-4 flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
					<TriangleAlert className="mt-0.5 size-4 shrink-0" />
					<p>
						You need a verified wallet to receive payments.{" "}
						<Link
							href={pageRoutes.providerRoutes.WALLET}
							className="font-semibold underline"
						>
							Set up your wallet
						</Link>
					</p>
				</div>
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="description"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Service"
										placeholder="e.g. Consultation — General Checkup"
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
						name="amount"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Amount (USDC)"
										placeholder="e.g. 25.50"
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
						disabled={!isValid || isSubmitting || !walletReady}
						className="w-full"
					>
						Create Order
					</Button>
				</form>
			</Form>
		</Modal>
	);
}
