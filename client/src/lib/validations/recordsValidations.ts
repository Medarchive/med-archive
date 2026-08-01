import { z } from "zod";

export const RecordTypeEnum = z.enum([
	"BLOOD_TEST",
	"LAB_TEST",
	"PRESCRIPTION",
	"MEDICATION",
	"ALLERGY",
	"SCAN",
	"REPORT",
	"OTHER",
]);

export const CreateHealthRecordSchema = z
	.object({
		title: z.string().trim().min(2, "Title is required").max(150, "Title is too long"),
		recordType: RecordTypeEnum,
		recordDate: z.string().optional().or(z.literal("")),
		description: z.string().trim().max(500, "Description is too long").optional().or(z.literal("")),

		// Type-specific — required-ness enforced conditionally below.
		testName: z.string().trim().optional().or(z.literal("")),
		referredBy: z.string().trim().optional().or(z.literal("")),
		prescribedBy: z.string().trim().optional().or(z.literal("")),
		drugClass: z.string().trim().optional().or(z.literal("")),
		drug: z.string().trim().optional().or(z.literal("")),
		dosage: z.string().trim().optional().or(z.literal("")),
		frequency: z.string().trim().optional().or(z.literal("")),
		endDate: z.string().optional().or(z.literal("")),
		allergyType: z
			.enum(["FOOD", "DRUG", "ENVIRONMENTAL", "INSECT", "LATEX", "OTHER"])
			.optional(),
		cause: z.string().trim().optional().or(z.literal("")),
		management: z.string().trim().optional().or(z.literal("")),
	})
	.superRefine((values, ctx) => {
		const require = (field: keyof typeof values, message: string) => {
			if (!values[field]) {
				ctx.addIssue({ code: "custom", path: [field], message });
			}
		};

		switch (values.recordType) {
			case "LAB_TEST":
				require("testName", "Test name is required");
				break;
			case "PRESCRIPTION":
				require("prescribedBy", "Prescribed by is required");
				require("drugClass", "Drug class is required");
				break;
			case "MEDICATION":
				require("drug", "Drug is required");
				require("dosage", "Dosage is required");
				require("frequency", "Frequency is required");
				break;
			case "ALLERGY":
				require("allergyType", "Allergy type is required");
				require("cause", "Cause is required");
				break;
		}
	});

export type CreateHealthRecordValues = z.infer<typeof CreateHealthRecordSchema>;
