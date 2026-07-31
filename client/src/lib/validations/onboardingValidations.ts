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

export const UploadRecordSchema = z.object({
	record_type: z.enum(
		["lab_test_result", "prescription", "vaccination_record", "discharge_summary", "imaging_scan", "other"],
		{ error: "Please select a record type" },
	),

	ordered_by: z.enum(["self", "doctor", "hospital_clinic", "other"], {
		error: "Please select who ordered this",
	}),

	facility: z.string().nonempty("Please select a facility"),

	description: z
		.string()
		.trim()
		.max(500, "Description is too long")
		.optional()
		.or(z.literal("")),
});

export type UploadRecordValues = z.infer<typeof UploadRecordSchema>;
