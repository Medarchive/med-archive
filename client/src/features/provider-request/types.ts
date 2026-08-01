export type RequestStatus = "PENDING" | "APPROVED" | "DECLINED";

export interface AccessRequestData {
	id: string;
	providerId: string;
	providerName: string;
	providerEmail: string;
	organizationName?: string;
	specialty?: string;
	requestType: string;
	note?: string;
	status: RequestStatus;
	requestedAt: string;
	respondedAt?: string | null;
}
