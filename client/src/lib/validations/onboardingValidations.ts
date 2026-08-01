import { z } from "zod";

export const MedicalHistorySchema = z.object({
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

	hiv_status: z.enum(["negative", "positive", "unknown"], {
		error: "Please select your HIV status",
	}),
});

export type MedicalHistoryValues = z.infer<typeof MedicalHistorySchema>;

// Record upload validation now lives in recordsValidations.ts
// (CreateHealthRecordSchema), matching the real health-records API.
