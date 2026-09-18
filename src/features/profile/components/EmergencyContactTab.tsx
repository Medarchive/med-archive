"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
	useEmergencyContacts,
	useCreateEmergencyContact,
	useUpdateEmergencyContact,
} from "../../emergency-contacts/hooks";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileSkeleton from "../../../components/shared/skeletons/ProfileSkeleton";

type EmergencyContactValues = z.infer<typeof EmergencyContactSchema>;

const relationshipOptions = [
	{ label: "Brother", value: "Brother" },
	{ label: "Sister", value: "Sister" },
	{ label: "Parent", value: "Parent" },
	{ label: "Spouse", value: "Spouse" },
	{ label: "Friend", value: "Friend" },
	{ label: "Other", value: "Other" },
];

const emptyDefaults: EmergencyContactValues = {
	first_name: "",
	last_name: "",
	relationship: "Brother",
	contact_info: "",
};

export default function EmergencyContactTab() {
	const [isEditing, setIsEditing] = useState(false);
	const { data: contacts, isLoading } = useEmergencyContacts();
	const { mutate: createContact, isPending: isCreating } =
		useCreateEmergencyContact();
	const { mutate: updateContact, isPending: isUpdating } =
		useUpdateEmergencyContact();

	// The API models a list of contacts, but this screen (per the design)
	// manages a single primary one — the first record, if any.
	const existingContact = contacts?.[0];

	const form = useForm<EmergencyContactValues>({
		resolver: zodResolver(EmergencyContactSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		if (!existingContact) return;

		form.reset({
			first_name: existingContact.firstName,
			last_name: existingContact.lastName,
			relationship: existingContact.relationship as EmergencyContactValues["relationship"],
			contact_info: existingContact.contactNumber,
		});
	}, [existingContact, form]);

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;
	const isPending = isCreating || isUpdating;

	const onSubmit = (values: EmergencyContactValues) => {
		const payload = {
			firstName: values.first_name,
			lastName: values.last_name,
			relationship: values.relationship,
			contactNumber: values.contact_info,
		};

		if (existingContact) {
			updateContact(
				{ id: existingContact.id, payload },
				{ onSuccess: () => setIsEditing(false) },
			);
		} else {
			createContact(payload, { onSuccess: () => setIsEditing(false) });
		}
	};

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 my-5 sm:max-w-115"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="first_name"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="First Name"
										placeholder="First Name"
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
						name="last_name"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Last Name"
										placeholder="Last Name"
										type="text"
										disabled={disabled}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

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
					isLoading={isPending}
					disabled={disabled || !isValid || isSubmitting}
				/>
			</form>
		</Form>
	);
}
