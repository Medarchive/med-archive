export type Gender = "MALE" | "FEMALE";

// Exact shape of GET's `data` isn't documented in the OpenAPI spec — assumed
// to mirror the create/update DTO plus id/timestamps, per REST convention.
export interface PersonalInfoData {
	id?: string;
	firstName: string;
	middleName?: string | null;
	lastName: string;
	gender: Gender;
	dateOfBirth: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string | null;
	city: string;
	region: string;
	postcode: string;
	country: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PersonalInfoPayload {
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: Gender;
	dateOfBirth: string;
	phone: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	region: string;
	postcode: string;
	country: string;
}

export interface PersonalInfoFormValues {
	first_name: string;
	middle_name?: string;
	last_name: string;
	gender: "male" | "female";
	dial_code: string;
	phone_number: string;
	date_of_birth: string;
	address_line_1: string;
	address_line_2?: string;
	city: string;
	state: string;
	country: string;
	postal_code: string;
}
