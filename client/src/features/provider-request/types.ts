export type RequestStatus = "pending" | "approved" | "declined";

export interface ProviderRequest {
	id: string;
	providerName: string;
	request: string;
	hospital: string;
	note: string;
	date: string;
	status: RequestStatus;
}

export const initialRequests: ProviderRequest[] = [
	{
		id: "1",
		providerName: "Dr. James",
		request: "Resent Medication",
		hospital: "Lilly Hospital",
		note: "A quick check on past allergic report following the recent development for the patient.",
		date: "12 June, 2026",
		status: "pending",
	},
	{
		id: "2",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "pending",
	},
	{
		id: "3",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "approved",
	},
	{
		id: "4",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "declined",
	},
	{
		id: "5",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "declined",
	},
	{
		id: "6",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "approved",
	},
	{
		id: "7",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "approved",
	},
	{
		id: "8",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "pending",
	},
	{
		id: "9",
		providerName: "Dr. James",
		request: "Needs Allergy Data",
		hospital: "Lilly Hospital",
		note: "Requesting access to allergy records ahead of an upcoming procedure.",
		date: "12 June, 2026",
		status: "declined",
	},
];
