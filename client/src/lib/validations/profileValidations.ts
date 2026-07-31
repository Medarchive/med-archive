import { z } from "zod";

export const EmergencyContactSchema = z.object({
	emergency_contact_name: z
		.string()
		.trim()
		.min(2, "Full name is too short")
		.max(100, "Full name is too long"),

	relationship: z.enum(
		["brother", "sister", "parent", "spouse", "friend", "other"],
		{ error: "Please select a relationship" },
	),

	contact_info: z
		.string()
		.trim()
		.min(7, "Contact info is too short")
		.max(20, "Contact info is too long"),
});

export type EmergencyContactValues = z.infer<typeof EmergencyContactSchema>;

export const ProfileHealthOverviewSchema = z.object({
	body_weight: z
		.string()
		.trim()
		.nonempty("Body weight is required")
		.max(20, "Value is too long"),

	sugar_level: z.enum(["low", "normal", "high"], {
		error: "Please select your sugar level",
	}),

	medication: z.enum(
		["none", "antibiotics", "antihypertensives", "insulin", "painkillers", "other"],
		{ error: "Please select your medication" },
	),

	allergies: z.enum(
		["none", "food_allergies", "drug_allergies", "environmental_allergies", "other"],
		{ error: "Please select your allergies" },
	),

	allergic_to: z
		.string()
		.trim()
		.max(200, "Value is too long")
		.optional()
		.or(z.literal("")),

	hiv_status: z.enum(["negative", "positive", "unknown"], {
		error: "Please select your HIV status",
	}),
});

export type ProfileHealthOverviewValues = z.infer<
	typeof ProfileHealthOverviewSchema
>;
