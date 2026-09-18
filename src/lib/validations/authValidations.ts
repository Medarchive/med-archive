import { z } from "zod";

// Same strong password regex from your Yup schema
export const isStrongPassword = (password: string) => {
	return /^(?=.*[A-Za-z])(?=.*[\d!@#$%^&*(),.?":{}|<>;'[\]~\-_=+])[A-Za-z\d!@#$%^&*(),.?":{}|<>;'[\]~\-_=+]{8,}$/.test(
		password,
	);
};

export const SignUpSchema = z.object({
	full_name: z
		.string()
		.nonempty("Full name is required")
		.trim()
		.min(2, "Full name is too short")
		.max(50, "Full name is too long"),

	email: z
		.string()
		.nonempty("Email is required")
		.email("Invalid email address"),

	// API requires minLength 8
	password: z
		.string()
		.min(8, "Password must be at least 8 characters")
		.refine((v) => /[A-Z]/.test(v), "Must contain at least 1 uppercase letter")
		.refine((v) => /[a-z]/.test(v), "Must contain at least 1 lowercase letter")
		.refine((v) => /\d/.test(v), "Must contain at least 1 number")
		.refine(
			(v) => /[@$!%*?&.,_\-+=#]/.test(v),
			"Must contain at least 1 symbol",
		),

	phone_number: z
		.string()
		.trim()
		.regex(
			/^\+?\d+$/,
			"Phone number must be digits only (optionally starts with +)",
		)
		.min(7, "Phone number too short")
		.max(15, "Phone number too long")
		.optional()
		.or(z.literal("")),
});

export const PersonalInfoSchema = z.object({
	first_name: z
		.string()
		.trim()
		.min(2, "First name is too short")
		.max(50, "First name is too long"),

	middle_name: z
		.string()
		.trim()
		.max(50, "Middle name is too long")
		.optional()
		.or(z.literal("")),

	last_name: z
		.string()
		.trim()
		.min(2, "Last name is too short")
		.max(50, "Last name is too long"),

	gender: z.enum(["male", "female"], {
		error: "Please select your gender",
	}),

	dial_code: z.string().nonempty("Select a dial code"),

	// The dial code is picked separately (see PhoneField), so a number
	// starting with 0 here would double up on it, e.g. dial_code "+234" +
	// phone_number "08012345678" produces the invalid "+2340801234567"
	// instead of "+2348012345678".
	phone_number: z
		.string()
		.trim()
		.regex(/^\d+$/, "Phone number must be digits only")
		.refine(
			(value) => !value.startsWith("0"),
			"Don't start with 0 — the country code already covers it",
		)
		.min(7, "Phone number too short")
		.max(15, "Phone number too long"),

	date_of_birth: z
		.string()
		.min(1, "Date of birth is required")
		.refine(
			(value) => !Number.isNaN(Date.parse(value)),
			"Invalid date of birth",
		)
		.refine((value) => {
			const dob = new Date(value);
			return dob <= new Date();
		}, "Date of birth cannot be in the future"),

	address_line_1: z
		.string()
		.trim()
		.min(5, "Address is too short")
		.max(200, "Address is too long"),

	address_line_2: z.string().trim().max(200, "Address is too long").optional().or(z.literal("")),

	city: z
		.string()
		.trim()
		.min(2, "City is required")
		.max(100, "City is too long"),

	state: z
		.string()
		.trim()
		.min(2, "Region/State is required")
		.max(100, "Region is too long"),

	country: z.string().length(2, "Please select a country"),

	postal_code: z
		.string()
		.trim()
		.min(3, "Postal code is too short")
		.max(20, "Postal code is too long")
		.regex(/^[A-Za-z0-9\s-]+$/, "Invalid postal code"),
});

export const VerifyOtpSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be 6 digits")
		.regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtpValues = z.infer<typeof VerifyOtpSchema>;

export const SignInSchema = z.object({
	email: z
		.string()
		.nonempty("Email is required")
		.email("Invalid email address"),
	password: z.string().nonempty("Password is required"),
});

export const ForgotPasswordSchema = z.object({
	email: z
		.string()
		.nonempty("Email is required")
		.email("Invalid email address"),
});

// The reset token comes from the link in the email (a URL query param),
// not something the user types in — this form only collects the new
// password.
export const ResetPasswordSchema = z
	.object({
		password: z
			.string()
			.nonempty("Password is required")
			.min(8, "At least 8 characters")
			.refine(
				(value) => /[\d@$!%*?&]/.test(value), // number or symbol
				"Contain a number or symbol",
			)
			.refine((value) => isStrongPassword(value), "Password strength: Weak"),

		confirmPassword: z.string().nonempty("Please confirm your password"),
	})

	// ❌ Passwords must match
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export const CreateProfileSchema = z
	.object({
		full_name: z
			.string()
			.nonempty("Full name is required")
			.trim()
			.min(2, "Full name is too short")
			.max(50, "Full name is too long"),

		tag_name: z
			.string()
			.nonempty("Tag name is required")
			.trim()
			.min(2, "Tag name is too short")
			.max(50, "Tag name is too long")
			.regex(/^\S+$/, "Tag name cannot contain spaces"),

		password: z
			.string()
			.min(6, "Password must be at least 6 characters")
			.refine(
				(v) => /[A-Z]/.test(v),
				"Must contain at least 1 uppercase letter",
			)
			.refine(
				(v) => /[a-z]/.test(v),
				"Must contain at least 1 lowercase letter",
			)
			.refine((v) => /\d/.test(v), "Must contain at least 1 number")
			.refine(
				(v) => /[@$!%*?&.,_\-+=#]/.test(v),
				"Must contain at least 1 symbol",
			),

		confirmPassword: z.string().nonempty("Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	})

	// ❌ Password must NOT contain email
	// .refine((data) => !data.password.includes(data.email), {
	//   message: "Can't contain your email address",
	//   path: ["password"], // attach error to password
	// })

	// ❌ Passwords must match
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],

		// phone_number: z
		//   .string()
		//   .trim()
		//   .regex(
		//     /^\+?\d+$/,
		//     "Phone number must be digits only (optionally starts with +)"
		//   )
		//   .min(7, "Phone number too short")
		//   .max(15, "Phone number too long")
		//   .optional()
		//   .or(z.literal("")),

		// country: z.string().trim().min(1, "Country is required"),
	});

export type CreateProfileValues = z.infer<typeof CreateProfileSchema>;

export const UpdateUserSchema = z.object({
	email: z
		.string()
		.email("Invalid email address")
		.nonempty("Email is required"),

	first_name: z
		.string()
		.min(2, "First name must be at least 2 characters")
		.max(50, "First name is too long"),

	last_name: z
		.string()
		.min(2, "Last name must be at least 2 characters")
		.max(50, "Last name is too long"),

	business_name: z
		.string()
		.min(2, "Business name must be at least 2 characters")
		.max(100, "Business name is too long")
		.optional(),

	phone_number: z
		.string()
		.nonempty("Phone number is required")
		.regex(/^\+?\d{7,15}$/, "Invalid phone number")
		.optional(),

	country: z.string().min(2, "Country is required"),

	currency: z.string().min(2, "Currency is required"),

	wallet_address: z.string(),
	// .nonempty("Wallet address is required")
	// .regex(/^(0x)?[0-9a-fA-F]{40}$/, "Invalid wallet address"),
});
