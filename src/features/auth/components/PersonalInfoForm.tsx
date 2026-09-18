"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import PhoneField from "../../../components/ui/custom/PhoneField";
import DateField from "../../../components/ui/custom/DateField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { PersonalInfoSchema } from "../../../lib/validations/authValidations";
import { country } from "../../../lib/utils/countries";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import {
	useCreatePersonalInfo,
	toPersonalInfoPayload,
} from "../../personal-info/hooks";

type PersonalInfoValues = z.infer<typeof PersonalInfoSchema>;

const countryOptions = country.map((c) => ({ label: c.name, value: c.code }));

export default function PersonalInfoForm() {
	const { mutate: createPersonalInfo, isPending } = useCreatePersonalInfo();

	const form = useForm<PersonalInfoValues>({
		resolver: zodResolver(PersonalInfoSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
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
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: PersonalInfoValues) => {
		createPersonalInfo(toPersonalInfoPayload(values));
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-5">
					{/* First / Middle Name */}
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
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Last Name */}
					<div className="grid gap-4 sm:grid-cols-2">
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
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Gender */}
					<FormField
						control={form.control}
						name="gender"
						render={({ field, fieldState }) => (
							<FormItem>
								<div className="flex items-center gap-6">
									<label className="flex items-center gap-2 cursor-pointer text-sm">
										<input
											type="radio"
											value="male"
											checked={field.value === "male"}
											onChange={field.onChange}
											className="accent-primary size-4"
										/>
										Male
									</label>

									<label className="flex items-center gap-2 cursor-pointer text-sm">
										<input
											type="radio"
											value="female"
											checked={field.value === "female"}
											onChange={field.onChange}
											className="accent-primary size-4"
										/>
										Female
									</label>
								</div>

								<FormMessage>{fieldState.error?.message}</FormMessage>
							</FormItem>
						)}
					/>

					{/* Phone / Date of Birth */}
					<div className="grid gap-4 sm:grid-cols-2">
						<FormField
							control={form.control}
							name="phone_number"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormControl>
										<PhoneField
											label="Phone Number"
											name={field.name}
											// eslint-disable-next-line react-hooks/incompatible-library
											dialCode={form.watch("dial_code")}
											number={field.value}
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
											max={new Date().toISOString().split("T")[0]}
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Address */}
					<h4 className="font-semibold pt-2">Address</h4>

					<FormField
						control={form.control}
						name="address_line_1"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Address Line 1"
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
						name="address_line_2"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Address Line 2"
										type="text"
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* City / Region */}
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
											placeholder="Region/Province"
											type="text"
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Country / Postcode */}
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
											placeholder="Postcode"
											type="text"
											error={fieldState.error?.message ?? null}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						type="submit"
						isLoading={isPending}
						disabled={!isValid || isSubmitting}
						className="w-full mt-4"
					>
						Continue
					</Button>
				</form>
			</Form>
		</div>
	);
}
