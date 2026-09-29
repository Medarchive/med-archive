"use client";

// Building, signing and submitting a service-order payment — entirely in
// the browser. The backend never builds, holds a key for, or signs this
// transaction (see GET /service-orders/:id/payment-intent); it only
// verifies the submitted hash afterwards.
//
// @stellar/stellar-sdk is imported lazily, inside the functions that need
// it, so the SDK only loads when someone actually pays rather than riding
// along in every page that imports this module.

import { HORIZON_URL, NETWORK_PASSPHRASE } from "./config";
import { signXdr } from "./kit";

export interface PaymentDetails {
	destination: string;
	assetCode: string;
	assetIssuer: string;
	// Decimal string, up to 7 places.
	amount: string;
	// Must go on as a TEXT memo — the backend matches it to the order.
	memo: string;
}

export class PaymentPreflightError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PaymentPreflightError";
	}
}

// Stellar amounts have 7 decimal places. Compared as integer stroops, never
// as floats — 0.1 + 0.2 is exactly the kind of error that turns "enough"
// into "not enough" by one stroop.
const toStroops = (amount: string): bigint => {
	const [whole, fraction = ""] = amount.trim().split(".");
	return BigInt(whole + fraction.padEnd(7, "0").slice(0, 7));
};

/**
 * Horizon reports a rejection as nested result codes rather than a message,
 * so the useful part has to be dug out or the user sees "Request failed with
 * status code 400".
 */
function toHorizonError(error: unknown, assetCode: string): Error {
	const codes = (
		error as {
			response?: {
				data?: {
					extras?: { result_codes?: { transaction?: string; operations?: string[] } };
				};
			};
		}
	)?.response?.data?.extras?.result_codes;

	const operation = codes?.operations?.find((code) => code !== "op_success");

	switch (operation) {
		case "op_underfunded":
			return new Error(`Your wallet doesn't have enough ${assetCode} for this payment.`);
		case "op_src_no_trust":
			return new Error(`Your wallet can't hold ${assetCode} yet — it needs a trustline first.`);
		case "op_no_trust":
		case "op_no_destination":
			return new Error(
				"The provider's wallet can't receive this payment right now. Let them know and try again later.",
			);
	}

	switch (codes?.transaction) {
		case "tx_insufficient_balance":
			return new Error("Your wallet doesn't have enough XLM to cover the network fee.");
		case "tx_bad_auth":
			return new Error("That payment wasn't signed by the right wallet.");
		case "tx_too_late":
			return new Error("The payment expired before it was submitted. Please try again.");
	}

	console.error("[payment] Horizon rejected the transaction:", codes ?? error);
	return new Error("The Stellar network rejected this payment. Please try again.");
}

/**
 * Checks, builds, signs and submits the payment from `source` — the
 * patient's linked wallet — and returns the transaction hash for
 * POST /service-orders/:id/payment/verify.
 */
export async function submitPayment(
	details: PaymentDetails,
	source: string,
): Promise<string> {
	const { Asset, BASE_FEE, Horizon, Memo, Operation, TransactionBuilder } =
		await import("@stellar/stellar-sdk");

	const server = new Horizon.Server(HORIZON_URL);

	let account: Awaited<ReturnType<typeof server.loadAccount>>;
	try {
		account = await server.loadAccount(source);
	} catch {
		throw new PaymentPreflightError(
			"Your wallet doesn't exist on this Stellar network yet — it needs to be funded with some XLM first.",
		);
	}

	// Checked before the wallet prompt, so the patient isn't asked to sign
	// something the network is certain to reject.
	const line = account.balances.find(
		(balance) =>
			(balance.asset_type === "credit_alphanum4" ||
				balance.asset_type === "credit_alphanum12") &&
			balance.asset_code === details.assetCode &&
			balance.asset_issuer === details.assetIssuer,
	);

	if (!line) {
		throw new PaymentPreflightError(
			`Your wallet can't hold ${details.assetCode} yet — it needs a ${details.assetCode} trustline before it can pay.`,
		);
	}

	if (toStroops(line.balance) < toStroops(details.amount)) {
		throw new PaymentPreflightError(
			`Your wallet has ${line.balance} ${details.assetCode}, which isn't enough for this ${details.amount} ${details.assetCode} payment.`,
		);
	}

	const transaction = new TransactionBuilder(account, {
		fee: BASE_FEE,
		networkPassphrase: NETWORK_PASSPHRASE,
	})
		.addOperation(
			Operation.payment({
				destination: details.destination,
				asset: new Asset(details.assetCode, details.assetIssuer),
				amount: details.amount,
			}),
		)
		.addMemo(Memo.text(details.memo))
		// Approving in a wallet can take a while; an expired transaction fails
		// confusingly, so leave plenty of room.
		.setTimeout(300)
		.build();

	const signedXdr = await signXdr(transaction.toXDR(), source);
	const signed = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);

	try {
		const result = await server.submitTransaction(signed);
		return result.hash;
	} catch (error) {
		throw toHorizonError(error, details.assetCode);
	}
}

export const stellarExplorerTxUrl = (hash: string) =>
	`https://stellar.expert/explorer/${
		NETWORK_PASSPHRASE.startsWith("Public") ? "public" : "testnet"
	}/tx/${hash}`;
