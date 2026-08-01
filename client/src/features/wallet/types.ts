export type WalletNetwork = "MAINNET" | "TESTNET";

export interface WalletData {
	address: string;
	network: WalletNetwork;
	label?: string | null;
	balance: string | null; // null if the account is unfunded
	verifiedAt?: string | null;
}

export interface LinkWalletResponseData {
	address: string;
	network: WalletNetwork;
	nonce: string;
}

// Exact per-transaction fields aren't documented in the OpenAPI spec — kept
// loose and rendered defensively until a real response has been seen.
export interface WalletTransaction {
	id?: string;
	hash?: string;
	type?: string;
	amount?: string | number;
	status?: string;
	createdAt?: string;
	[key: string]: unknown;
}
