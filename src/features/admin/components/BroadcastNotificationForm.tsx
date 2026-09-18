"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { useBroadcastNotification } from "../hooks";

const BroadcastSchema = z.object({
	title: z.string().trim().min(2, "Title is required").max(150, "Title is too long"),
	body: z.string().trim().min(2, "Message is required").max(1000, "Message is too long"),
	role: z.enum(["ALL", "PATIENT", "PROVIDER", "ADMIN"]),
});

type BroadcastValues = z.infer<typeof BroadcastSchema>;

const roleOptions = [
	{ label: "Everyone", value: "ALL" },
	{ label: "Patients only", value: "PATIENT" },
	{ label: "Providers only", value: "PROVIDER" },
	{ label: "Admins only", value: "ADMIN" },
];

export default function BroadcastNotificationForm() {
	const { mutate: broadcast, isPending } = useBroadcastNotification();

	const form = useForm<BroadcastValues>({
		resolver: zodResolver(BroadcastSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { title: "", body: "", role: "ALL" },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: BroadcastValues) => {
		broadcast(
			{
				title: values.title,
				body: values.body,
				role: values.role === "ALL" ? undefined : values.role,
			},
			{ onSuccess: () => form.reset() },
		);
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Broadcast Notification</h1>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 sm:max-w-115"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<InputField
											{...field}
											label="Title"
											placeholder="e.g. Scheduled maintenance"
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
							name="body"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<InputField
											{...field}
											label="Message"
											placeholder="What do you want to tell them?"
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
							name="role"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<SelectField
											name={field.name}
											label="Audience"
											value={field.value}
											onChange={field.onChange}
											onBlur={field.onBlur}
											options={roleOptions}
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
							Send Broadcast
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
