// Built from the OpenAPI examples for /service-orders — not yet confirmed
// against a real response.
export type ServiceOrderStatus = "PENDING" | "PAID";

export interface ServiceOrderData {
	id: string;
	// Also the TEXT memo the payment must carry — see PaymentIntentData.
	reference: string;
	patientId: string;
	providerId: string;
	// Snapshotted at creation, so a provider changing wallets later doesn't
	// redirect payment for existing orders. Absent from list rows.
	providerWalletAddress?: string;
	description: string;
	// Decimal string with up to 7 places (Stellar's precision) — never parse
	// to a float for arithmetic.
	amount: string;
	assetCode: "USDC";
	status: ServiceOrderStatus;
	txHash: string | null;
	paidAt: string | null;
	createdAt: string;
	updatedAt?: string;
}

export interface CreateServiceOrderPayload {
	patientId: string;
	description: string;
	amount: string;
}

// Everything the patient's wallet needs to build the payment itself — the
// backend never builds or signs it. The memo must go on as a TEXT memo.
export interface PaymentIntentData {
	orderId: string;
	reference: string;
	destination: string;
	assetCode: string;
	assetIssuer: string;
	amount: string;
	memo: string;
}

export interface VerifyPaymentPayload {
	// Exactly 64 hex characters.
	txHash: string;
}
