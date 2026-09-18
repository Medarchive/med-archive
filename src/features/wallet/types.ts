export type WalletNetwork = "MAINNET" | "TESTNET";

// Confirmed against a real POST /wallet/verify response. `balance` isn't
// part of that raw entity — it's presumably populated separately by GET
// /wallet via a live Horizon lookup (still unconfirmed against a real GET
// response, kept as the pre-existing assumption). `encryptedSecret` is real
// but always null in this app's flows (Freighter signature-based linking,
// never custodial secret storage) — typed for completeness only, never
// rendered.
export interface WalletData {
	id?: string;
	userId?: string;
	address: string;
	network: WalletNetwork;
	label?: string | null;
	balance: string | null; // null if the account is unfunded
	verifiedAt?: string | null;
	createdAt?: string;
	updatedAt?: string;
	encryptedSecret?: string | null;
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
