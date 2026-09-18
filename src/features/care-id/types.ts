// Exact response field names aren't detailed in the OpenAPI spec beyond
// this high-level shape — adjust once a real response has been seen.
export interface CareIdData {
	careId: string;
	status: string;
	walletAddress?: string | null;
	createdAt?: string;
}

export interface ShareLinkData {
	token: string;
	expiresInHours: number;
}
