"use client";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Camera } from "lucide-react";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import ProfileFormFooter from "../../profile/components/ProfileFormFooter";
import ProfileSkeleton from "../../../components/shared/skeletons/ProfileSkeleton";
import {
	useProviderProfile,
	useUpdateProviderProfile,
	useUploadProviderPicture,
} from "../hooks";
import { ProviderType } from "../types";

const ProviderProfileSchema = z.object({
	title: z.string().trim().max(20, "Too long").optional().or(z.literal("")),
	first_name: z
		.string()
		.trim()
		.min(2, "First name is too short")
		.max(50, "Too long")
		.optional()
		.or(z.literal("")),
	last_name: z
		.string()
		.trim()
		.min(2, "Last name is too short")
		.max(50, "Too long")
		.optional()
		.or(z.literal("")),
	organization_name: z.string().trim().max(150, "Too long").optional().or(z.literal("")),
	work_address: z.string().trim().max(200, "Too long").optional().or(z.literal("")),
	provider_type: z
		.enum(["LAB", "HOSPITAL", "CLINIC", "PHARMACY", "SPECIALIST", "OTHER"])
		.optional(),
	specialty: z.string().trim().max(100, "Too long").optional().or(z.literal("")),
	license_number: z.string().trim().max(100, "Too long").optional().or(z.literal("")),
});

type ProviderProfileValues = z.infer<typeof ProviderProfileSchema>;

const providerTypeOptions: { label: string; value: ProviderType }[] = [
	{ label: "Lab", value: "LAB" },
	{ label: "Hospital", value: "HOSPITAL" },
	{ label: "Clinic", value: "CLINIC" },
	{ label: "Pharmacy", value: "PHARMACY" },
	{ label: "Specialist", value: "SPECIALIST" },
	{ label: "Other", value: "OTHER" },
];

const emptyDefaults: ProviderProfileValues = {
	title: "",
	first_name: "",
	last_name: "",
	organization_name: "",
	work_address: "",
	provider_type: undefined,
	specialty: "",
	license_number: "",
};

export default function ProviderProfileForm() {
	const [isEditing, setIsEditing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const { data: profile, isLoading } = useProviderProfile();
	const { mutate: updateProfile, isPending } = useUpdateProviderProfile();
	const { mutate: uploadPicture, isPending: isUploadingPicture } =
		useUploadProviderPicture();

	const form = useForm<ProviderProfileValues>({
		resolver: zodResolver(ProviderProfileSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		if (!profile) return;

		form.reset({
			title: profile.title ?? "",
			first_name: profile.firstName ?? "",
			last_name: profile.lastName ?? "",
			organization_name: profile.organizationName ?? "",
			work_address: profile.workAddress ?? "",
			provider_type: profile.providerType ?? undefined,
			specialty: profile.specialty ?? "",
			license_number: profile.licenseNumber ?? "",
		});
	}, [profile, form]);

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;

	const onSubmit = (values: ProviderProfileValues) => {
		updateProfile(
			{
				title: values.title || undefined,
				firstName: values.first_name || undefined,
				lastName: values.last_name || undefined,
				organizationName: values.organization_name || undefined,
				workAddress: values.work_address || undefined,
				providerType: values.provider_type || undefined,
				specialty: values.specialty || undefined,
				licenseNumber: values.license_number || undefined,
			},
			{ onSuccess: () => setIsEditing(false) },
		);
	};

	const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) uploadPicture(file);
	};

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Provider Profile</h1>

			<div className="flex items-center gap-4 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary">
					{profile?.profilePictureUrl ? (
						// eslint-disable-next-line @next/next/no-img-element
						<img
							src={profile.profilePictureUrl}
							alt="Profile"
							className="size-full object-cover"
						/>
					) : (
						<Camera className="size-6" />
					)}
				</div>

				<div>
					<button
						type="button"
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploadingPicture}
						className="text-sm font-semibold text-primary hover:underline disabled:opacity-60"
					>
						{isUploadingPicture ? "Uploading..." : "Change photo"}
					</button>
					<p className="text-xs text-[#9B9B9B]">
						JPEG, PNG, WEBP or HEIC, up to 5MB
					</p>
				</div>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/jpeg,image/png,image/webp,image/heic"
					className="hidden"
					onChange={handlePictureChange}
				/>
			</div>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 sm:max-w-155"
					>
						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="title"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label="Title"
												placeholder="e.g. Dr"
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
								name="provider_type"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<SelectField
												name={field.name}
												label="Provider Type"
												value={field.value}
												onChange={field.onChange}
												onBlur={field.onBlur}
												disabled={disabled}
												options={providerTypeOptions}
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
							name="organization_name"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<InputField
											{...field}
											label="Organization"
											placeholder="e.g. St. Mary's Hospital"
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
							name="work_address"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<InputField
											{...field}
											label="Work Address"
											placeholder="Work Address"
											type="text"
											disabled={disabled}
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid gap-4 sm:grid-cols-2">
							<FormField
								control={form.control}
								name="specialty"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label="Specialty"
												placeholder="e.g. Cardiology"
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
								name="license_number"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label="License Number"
												placeholder="License Number"
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

						<ProfileFormFooter
							isEditing={isEditing}
							onEdit={() => setIsEditing(true)}
							isLoading={isPending}
							disabled={disabled || !isValid || isSubmitting}
						/>
					</form>
				</Form>
			</div>
		</div>
	);
}
