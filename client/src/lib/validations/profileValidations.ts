import { z } from "zod";

export const EmergencyContactSchema = z.object({
	first_name: z
		.string()
		.trim()
		.min(2, "First name is too short")
		.max(50, "First name is too long"),

	last_name: z
		.string()
		.trim()
		.min(2, "Last name is too short")
		.max(50, "Last name is too long"),

	// API models this as a free-text field ("e.g. Mother") — the select
	// below just guides input, the values submitted are the display text.
	relationship: z.enum(
		["Brother", "Sister", "Parent", "Spouse", "Friend", "Other"],
		{ error: "Please select a relationship" },
	),

	contact_info: z
		.string()
		.trim()
		.min(7, "Contact info is too short")
		.max(20, "Contact info is too long"),
});

export type EmergencyContactValues = z.infer<typeof EmergencyContactSchema>;

// Matches the real GET/PATCH /api/v1/medical-profile fields exactly (see
// features/medical-profile/types.ts) — the previous version of this schema
// (body_weight/sugar_level/hiv_status/etc.) didn't correspond to anything
// the API actually accepts.
const isPositiveNumber = (value: string) => {
	const n = Number(value);
	return !Number.isNaN(n) && n > 0;
};

export const MedicalProfileSchema = z.object({
	blood_group: z.enum(
		[
			"A_POSITIVE",
			"A_NEGATIVE",
			"B_POSITIVE",
			"B_NEGATIVE",
			"AB_POSITIVE",
			"AB_NEGATIVE",
			"O_POSITIVE",
			"O_NEGATIVE",
		],
		{ error: "Please select your blood group" },
	),

	genotype: z.enum(["AA", "AS", "SS", "AC", "SC"], {
		error: "Please select your genotype",
	}),

	height_cm: z
		.string()
		.trim()
		.nonempty("Height is required")
		.refine(isPositiveNumber, "Enter a valid height in cm"),

	weight_kg: z
		.string()
		.trim()
		.nonempty("Weight is required")
		.refine(isPositiveNumber, "Enter a valid weight in kg"),

	currently_taking_medication: z.enum(["yes", "no"], {
		error: "Please select an option",
	}),
});

export type MedicalProfileFormValues = z.infer<typeof MedicalProfileSchema>;
