/* eslint-disable react-hooks/incompatible-library */
"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import PhoneField from "../../../components/ui/custom/PhoneField";
import DateField from "../../../components/ui/custom/DateField";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import { PersonalInfoSchema } from "../../../lib/validations/authValidations";
import { country, splitPhoneNumber } from "../../../lib/utils/countries";
import {
	usePersonalInfo,
	useUpdatePersonalInfo,
	toPersonalInfoPayload,
} from "../../personal-info/hooks";
import ProfileFormFooter from "./ProfileFormFooter";
import ProfileSkeleton from "../../../components/shared/skeletons/ProfileSkeleton";

type PersonalInfoValues = z.infer<typeof PersonalInfoSchema>;

const countryOptions = country.map((c) => ({ label: c.name, value: c.code }));

// The GET response's dateOfBirth might come back as a full ISO timestamp
// rather than a plain YYYY-MM-DD — normalize it so the <input type="date">
// binds correctly and, if the user never touches it, the untouched value
// round-trips back to the API in the format it actually expects.
const toDateOnly = (value: string) => value.slice(0, 10);

const emptyDefaults: PersonalInfoValues = {
	first_name: "",
	middle_name: "",
	last_name: "",
	gender: "male",
	dial_code: "+234",
	phone_number: "",
	date_of_birth: "",
	address_line_1: "",
	address_line_2: "",
	city: "",
	state: "",
	country: "NG",
	postal_code: "",
};

export default function PersonalInfoTab() {
	const [isEditing, setIsEditing] = useState(false);
	const { data: personalInfo, isLoading } = usePersonalInfo();
	const { mutate: updatePersonalInfo, isPending } = useUpdatePersonalInfo();

	const form = useForm<PersonalInfoValues>({
		resolver: zodResolver(PersonalInfoSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		if (!personalInfo) return;

		const { dial_code, phone_number } = splitPhoneNumber(personalInfo.phone);

		form.reset({
			first_name: personalInfo.firstName,
			middle_name: personalInfo.middleName ?? "",
			last_name: personalInfo.lastName,
			gender: personalInfo.gender === "MALE" ? "male" : "female",
			dial_code,
			phone_number,
			date_of_birth: toDateOnly(personalInfo.dateOfBirth),
			address_line_1: personalInfo.addressLine1,
			address_line_2: personalInfo.addressLine2 ?? "",
			city: personalInfo.city,
			state: personalInfo.region,
			country: personalInfo.country,
			postal_code: personalInfo.postcode,
		});
	}, [personalInfo, form]);

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const disabled = !isEditing;

	const onSubmit = (values: PersonalInfoValues) => {
		updatePersonalInfo(toPersonalInfoPayload(values), {
			onSuccess: () => setIsEditing(false),
		});
	};

	if (isLoading) {
		return <ProfileSkeleton />;
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4 my-5 sm:max-w-155"
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
										label=""
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
						name="middle_name"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Middle Name"
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
					name="last_name"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<InputField
									{...field}
									label=""
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

				<FormField
					control={form.control}
					name="gender"
					render={({ field, fieldState }) => (
						<FormItem>
							<div className="flex items-center gap-6">
								<label className="flex items-center gap-2 text-sm cursor-pointer">
									<input
										type="radio"
										value="male"
										checked={field.value === "male"}
										onChange={field.onChange}
										disabled={disabled}
										className="accent-primary size-4"
									/>
									Male
								</label>

								<label className="flex items-center gap-2 text-sm cursor-pointer">
									<input
										type="radio"
										value="female"
										checked={field.value === "female"}
										onChange={field.onChange}
										disabled={disabled}
										className="accent-primary size-4"
									/>
									Female
								</label>
							</div>

							<FormMessage>{fieldState.error?.message}</FormMessage>
						</FormItem>
					)}
				/>

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="phone_number"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<PhoneField
										name={field.name}
										label="Phone Number"
										dialCode={form.watch("dial_code")}
										number={field.value}
										disabled={disabled}
										onDialCodeChange={(dialCode) =>
											form.setValue("dial_code", dialCode, {
												shouldValidate: true,
											})
										}
										onNumberChange={field.onChange}
										onBlur={field.onBlur}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="date_of_birth"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<DateField
										name={field.name}
										label="Date of Birth"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={disabled}
										max={new Date().toISOString().split("T")[0]}
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
					name="address_line_1"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<InputField
									{...field}
									label=""
									placeholder="Address"
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
					name="address_line_2"
					render={({ field, fieldState }) => (
						<FormItem>
							<FormControl>
								<InputField
									{...field}
									label=""
									placeholder="Other Address"
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
						name="city"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="City"
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
						name="state"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="State"
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

				<div className="grid gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="country"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<SelectField
										name={field.name}
										label="Country"
										value={field.value}
										onChange={field.onChange}
										onBlur={field.onBlur}
										disabled={disabled}
										options={countryOptions}
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="postal_code"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label="Postal Code"
										placeholder="Postal Code"
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
	);
}
