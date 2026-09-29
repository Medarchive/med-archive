import { PaginationMeta } from "../../types/api";

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

// Confirmed against a real GET /wallet/transactions response — the
// wallet's Stellar transactions as Horizon reports them. There's no amount
// or type here (those live on the transaction's operations); a
// service-order payment is recognisable by its ORD-… text memo.
export interface WalletTransaction {
	id: string;
	hash: string;
	createdAt: string;
	successful: boolean;
	ledger: number;
	operationCount: number;
	// In stroops (1 XLM = 10,000,000 stroops), as a string.
	feeCharged: string;
	memoType: string;
	memo: string | null;
}

// Paginated like everything else, but the list is under `items`, not the
// `data` key PaginatedData uses elsewhere.
export interface WalletTransactionsPage {
	items: WalletTransaction[];
	meta: PaginationMeta;
}
