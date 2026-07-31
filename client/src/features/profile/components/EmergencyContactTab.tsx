"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { EmergencyContactSchema } from "../../../lib/validations/profileValidations";
import ProfileFormFooter from "./ProfileFormFooter";

type EmergencyContactValues = z.infer<typeof EmergencyContactSchema>;

const relationshipOptions = [
	{ label: "Brother", value: "brother" },
	{ label: "Sister", value: "sister" },
	{ label: "Parent", value: "parent" },
	{ label: "Spouse", value: "spouse" },
	{ label: "Friend", value: "friend" },
	{ label: "Other", value: "other" },
];

export default function EmergencyContactTab() {
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<EmergencyContactValues>({
		resolver: zodResolver(EmergencyContactSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			emergency_contact_name: "Ovie James",
			relationship: "brother",
			contact_info: "+2340019938840",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;

	const onSubmit = (values: EmergencyContactValues) => {
		console.log(values);
		setIsLoading(true);

		setTimeout(() => {
			toast.success("Emergency contact updated successfully");
			setIsLoading(false);
			setIsEditing(false);
		}, 1500);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 my-5 sm:max-w-115"
			>
				<FormField
					control={form.control}
					name="emergency_contact_name"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<InputField
									{...field}
									label="Emergency Contact Full Name"
									placeholder="Full Name"
									type="text"
									disabled={disabled}
									error={fieldState.error?.message ?? null}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="relationship"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<SelectField
									name={field.name}
									label="Relationship"
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									disabled={disabled}
									options={relationshipOptions}
									error={fieldState.error?.message ?? null}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="contact_info"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<InputField
									{...field}
									label="Contact Info"
									placeholder="Phone Number"
									type="tel"
									disabled={disabled}
									error={fieldState.error?.message ?? null}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<ProfileFormFooter
					isEditing={isEditing}
					onEdit={() => setIsEditing(true)}
					isLoading={isLoading}
					disabled={disabled || !isValid || isSubmitting}
				/>
			</form>
		</Form>
	);
}
