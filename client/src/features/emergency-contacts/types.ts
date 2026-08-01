export interface EmergencyContactData {
	id: string;
	firstName: string;
	lastName: string;
	relationship: string;
	contactNumber: string;
	email?: string | null;
}

export interface EmergencyContactPayload {
	firstName: string;
	lastName: string;
	relationship: string;
	contactNumber: string;
	email?: string;
}
