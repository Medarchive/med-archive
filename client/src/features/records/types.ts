export type RecordType = "lab_report" | "allergies" | "medication" | "prescription";

export interface FieldConfig {
	key: string;
	label: string;
}

export interface LabReportRecord {
	id: string;
	type: "lab_report";
	testName: string;
	referredBy: string;
	facility: string;
	date: string;
	zkProof: "verified" | "unverified";
}

export interface AllergyRecord {
	id: string;
	type: "allergies";
	allergyType: string;
	cause: string;
	management: string;
}

export interface MedicationRecord {
	id: string;
	type: "medication";
	drug: string;
	dosage: string;
	date: string;
}

export interface PrescriptionRecord {
	id: string;
	type: "prescription";
	drugClass: string;
	prescribedBy: string;
	date: string;
}

export type AnyRecord =
	| LabReportRecord
	| AllergyRecord
	| MedicationRecord
	| PrescriptionRecord;

export const recordTypeConfig: Record<
	RecordType,
	{ tabLabel: string; columns: FieldConfig[] }
> = {
	lab_report: {
		tabLabel: "Lab Report",
		columns: [
			{ key: "testName", label: "Test Name" },
			{ key: "referredBy", label: "Referred by" },
			{ key: "facility", label: "Facility" },
		],
	},
	allergies: {
		tabLabel: "Allergies",
		columns: [
			{ key: "allergyType", label: "Allergy Type" },
			{ key: "cause", label: "Cause" },
			{ key: "management", label: "Management" },
		],
	},
	medication: {
		tabLabel: "Medication",
		columns: [
			{ key: "drug", label: "Drug" },
			{ key: "dosage", label: "Dosage" },
			{ key: "date", label: "Date" },
		],
	},
	prescription: {
		tabLabel: "Prescription",
		columns: [
			{ key: "drugClass", label: "Drug Class" },
			{ key: "prescribedBy", label: "Prescribed by" },
			{ key: "date", label: "Date" },
		],
	},
};

export const initialRecords: AnyRecord[] = [
	// Lab Report
	{ id: "lr-1", type: "lab_report", testName: "Urinalysis (UA)", referredBy: "Dr. Mike JP", facility: "Lilly Hospital", date: "Today, 10:00AM", zkProof: "verified" },
	{ id: "lr-2", type: "lab_report", testName: "Mammogram", referredBy: "Dr. Mike JP", facility: "Lilly Hospital", date: "Today, 10:00AM", zkProof: "verified" },
	{ id: "lr-3", type: "lab_report", testName: "Pap Smear", referredBy: "Dr. Mike JP", facility: "Lilly Hospital", date: "Today, 10:00AM", zkProof: "unverified" },
	{ id: "lr-4", type: "lab_report", testName: "Pap Smear", referredBy: "Dr. Mike JP", facility: "Lilly Hospital", date: "Today, 10:00AM", zkProof: "verified" },
	{ id: "lr-5", type: "lab_report", testName: "Colonoscopy", referredBy: "Dr. Mike JP", facility: "Lilly Hospital", date: "Today, 10:00AM", zkProof: "verified" },
	{ id: "lr-6", type: "lab_report", testName: "Mammogram", referredBy: "Dr. Mike JP", facility: "Lilly Hospital", date: "Today, 10:00AM", zkProof: "verified" },

	// Allergies
	{ id: "al-1", type: "allergies", allergyType: "Medication Allergies", cause: "Penicillin", management: "Emergency Epinephrine" },
	{ id: "al-2", type: "allergies", allergyType: "Food Allergies", cause: "Peanuts, Milk", management: "Emergency Epinephrine" },
	{ id: "al-3", type: "allergies", allergyType: "Environmental Allergies", cause: "Pollen, Dust", management: "Antihistamines" },

	// Medication
	{ id: "me-1", type: "medication", drug: "Ibuprofen (Advil)", dosage: "400mg twice daily", date: "Today, 10:00AM" },
	{ id: "me-2", type: "medication", drug: "Warfarin", dosage: "5mg once daily", date: "Today, 10:00AM" },
	{ id: "me-3", type: "medication", drug: "Simvastatin", dosage: "20mg once daily", date: "Today, 10:00AM" },

	// Prescription
	{ id: "pr-1", type: "prescription", drugClass: "Analgesics", prescribedBy: "Dr. Mike JP", date: "Today, 10:00AM" },
	{ id: "pr-2", type: "prescription", drugClass: "Antibiotics", prescribedBy: "Dr. Mike JP", date: "Today, 10:00AM" },
	{ id: "pr-3", type: "prescription", drugClass: "Antihypertensives", prescribedBy: "Dr. Mike JP", date: "Today, 10:00AM" },
	{ id: "pr-4", type: "prescription", drugClass: "Antihistamines", prescribedBy: "Dr. Mike JP", date: "Today, 10:00AM" },
	{ id: "pr-5", type: "prescription", drugClass: "Statins", prescribedBy: "Dr. Mike JP", date: "Today, 10:00AM" },
	{ id: "pr-6", type: "prescription", drugClass: "Anticoagulants", prescribedBy: "Dr. Mike JP", date: "Today, 10:00AM" },
];
