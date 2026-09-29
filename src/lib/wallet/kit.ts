"use client";

// The browser half of every wallet interaction: picking a wallet, proving
// ownership of it, and signing payments.
//
// This wraps Stellar Wallets Kit rather than talking to one wallet directly,
// so Freighter, xBull, Lobstr, Hana and anything reachable over
// WalletConnect all go through one code path. The kit's API is static —
// there is one kit per page, initialised on first use. Nothing here ever
// handles a secret key.
//
// The kit is imported lazily (see getKit), never at the top of this file.
// Importing it runs a module-level effect that writes its theme variables
// (--swk-*) onto <html>; loaded eagerly, that happened before React
// hydrated and caused a hydration mismatch on every page. Loading it on the
// first wallet action keeps it off <html> until hydration is long done — and
// keeps the kit out of page bundles until someone actually uses a wallet.
//
// Albedo and Rabet are deliberately NOT registered: both reject
// `signMessage` outright, and this backend proves wallet ownership (POST
// /wallet/verify and POST /auth/use-wallet) by having the wallet sign a
// nonce message. Letting someone pick one of them would only fail one step
// later. They can be added once ownership moves to a signed challenge
// transaction, which every wallet supports.

import type { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";
import type { Networks } from "@creit.tech/stellar-wallets-kit/types";
import { isAxiosError } from "axios";
import { getApiErrorMessage } from "../utils";
import {
	ALLOWED_STELLAR_NETWORK,
	NETWORK_PASSPHRASE,
	STELLAR_NETWORK_LABEL,
	WALLETCONNECT_PROJECT_ID,
} from "./config";

export class WalletRejectedError extends Error {
	constructor() {
		super("Request cancelled in your wallet.");
		this.name = "WalletRejectedError";
	}
}

export class WalletWrongNetworkError extends Error {
	constructor(walletNetwork: string) {
		super(
			`Your wallet is set to ${walletNetwork}. Switch it to ${STELLAR_NETWORK_LABEL} and try again — only ${STELLAR_NETWORK_LABEL} is supported right now.`,
		);
		this.name = "WalletWrongNetworkError";
	}
}

/**
 * Thrown when the page is not a secure context, which WalletConnect needs.
 *
 * WalletConnect encrypts every message to the relay through WebCrypto
 * (`crypto.subtle`), which browsers only expose over HTTPS or localhost. On
 * a phone pointed at a dev server over the LAN — http://192.168.x.x:3000 —
 * the pairing can't be built and the picker fails with nothing that says
 * why. A deployed site is always HTTPS, so this only bites in development.
 */
export class InsecureContextError extends Error {
	constructor() {
		super(
			"Mobile wallets need a secure connection. Open this site over HTTPS — a plain http:// address on your network can't connect a wallet.",
		);
		this.name = "InsecureContextError";
	}
}

/**
 * The kit reports a cancelled prompt as a thrown object with a code rather
 * than an Error, so this normalises both into something the UI can show.
 */
function rethrow(error: unknown, fallback: string): never {
	const message =
		typeof error === "string"
			? error
			: ((error as { message?: string })?.message ?? fallback);

	if (/declined|rejected|denied|cancel|closed/i.test(message)) {
		throw new WalletRejectedError();
	}

	throw new Error(message);
}

/**
 * One message for any error a wallet flow can throw — API errors carry the
 * backend's message, wallet errors carry their own. Checked in that order
 * because an AxiosError is also an Error, and its own message ("Request
 * failed with status code 400") is never the useful one.
 */
export function getWalletErrorMessage(error: unknown, fallback?: string): string {
	if (isAxiosError(error)) return getApiErrorMessage(error, fallback);
	if (error instanceof Error && error.message) return error.message;
	return fallback ?? "Something went wrong with your wallet. Please try again.";
}

export function isMobileDevice(): boolean {
	if (typeof navigator === "undefined") return false;
	return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

/**
 * What a user on this device can realistically connect with.
 *
 * Freighter, xBull, Lobstr and Hana are browser extensions: they don't exist
 * on mobile browsers, so on a phone the only route to a wallet is
 * WalletConnect — which needs a project id, and without one is never
 * registered (see loadKit).
 */
export interface WalletAvailability {
	isMobile: boolean;
	walletConnectReady: boolean;
	/** True when this device has no practical way to connect at all. */
	strandedOnMobile: boolean;
}

// Both fields below have to outlive this *module*, not just this page. Fast
// Refresh re-runs a file on every edit, so plain module-level state resets
// mid-session — and for `kit` that means StellarWalletsKit.init runs again
// and stands up a second WalletConnect client on the same project id, whose
// pairing the phone can approve while the page waits on the other one
// forever. Hanging both off globalThis makes re-evaluation a no-op.
interface WalletKitState {
	/**
	 * Computed once and handed back by reference — useSyncExternalStore
	 * compares snapshots by identity and would re-render forever on a fresh
	 * object.
	 */
	availability: WalletAvailability | null;
	/** The loaded-and-initialised kit, shared by every caller. */
	kit: Promise<typeof StellarWalletsKit> | null;
}

declare global {
	var __medArchiveWalletKit: WalletKitState | undefined;
}

const state: WalletKitState = (globalThis.__medArchiveWalletKit ??= {
	availability: null,
	kit: null,
});

export function walletAvailability(): WalletAvailability {
	if (state.availability) return state.availability;

	const isMobile = isMobileDevice();
	const walletConnectReady = Boolean(WALLETCONNECT_PROJECT_ID);

	state.availability = {
		isMobile,
		walletConnectReady,
		strandedOnMobile: isMobile && !walletConnectReady,
	};

	return state.availability;
}

async function loadKit(): Promise<typeof StellarWalletsKit> {
	const [
		{ StellarWalletsKit },
		{ FreighterModule },
		{ HanaModule },
		{ LobstrModule },
		{ xBullModule },
		{ WalletConnectModule, WalletConnectTargetChain },
	] = await Promise.all([
		import("@creit.tech/stellar-wallets-kit"),
		import("@creit.tech/stellar-wallets-kit/modules/freighter"),
		import("@creit.tech/stellar-wallets-kit/modules/hana"),
		import("@creit.tech/stellar-wallets-kit/modules/lobstr"),
		import("@creit.tech/stellar-wallets-kit/modules/xbull"),
		import("@creit.tech/stellar-wallets-kit/modules/wallet-connect"),
	]);

	const modules = [
		new FreighterModule(),
		new xBullModule(),
		new LobstrModule(),
		new HanaModule(),
	];

	// WalletConnect is the only module that needs a credential, so it's
	// added only when one is configured. Without it the extension wallets
	// above still work — the picker just doesn't offer the QR option.
	if (WALLETCONNECT_PROJECT_ID) {
		const origin = window.location.origin;

		modules.push(
			new WalletConnectModule({
				projectId: WALLETCONNECT_PROJECT_ID,
				metadata: {
					name: "Med Archive",
					description: "Your health records, secured on Stellar.",
					url: origin,
					icons: [`${origin}/images/logos/favicon_io/android-chrome-192x192.png`],
				},
				allowedChains: [
					ALLOWED_STELLAR_NETWORK === "MAINNET"
						? WalletConnectTargetChain.PUBLIC
						: WalletConnectTargetChain.TESTNET,
				],
			}),
		);
	} else if (isMobileDevice()) {
		// On desktop a missing project id just costs the QR option. On mobile
		// it removes the *only* practical wallet, and the picker then lists
		// nothing but extensions that can't exist there — which reads as a
		// broken app rather than a missing deploy-time variable.
		console.error(
			"[wallet] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect is the only wallet most phones can use, so mobile users can't connect.",
		);
	}

	// The kit's Networks enum values are the passphrases themselves.
	StellarWalletsKit.init({ modules, network: NETWORK_PASSPHRASE as Networks });
	return StellarWalletsKit;
}

// Loaded on the first wallet action and reused after. A failed load (e.g. a
// dropped chunk request) is forgotten so the next action can retry.
function getKit(): Promise<typeof StellarWalletsKit> {
	state.kit ??= loadKit().catch((error) => {
		state.kit = null;
		throw error;
	});
	return state.kit;
}

/** Opens the wallet picker and returns the chosen address. */
export async function connectWallet(): Promise<string> {
	// Checked before the picker opens rather than after: on a phone over
	// plain HTTP the modal would open, list WalletConnect, and then fail on
	// pairing with an error that names neither the cause nor the fix.
	if (typeof window !== "undefined" && !window.isSecureContext && isMobileDevice()) {
		throw new InsecureContextError();
	}

	const kit = await getKit();

	try {
		const { address } = await kit.authModal();
		if (!address) throw new WalletRejectedError();
		return address;
	} catch (error) {
		if (error instanceof WalletRejectedError) throw error;
		rethrow(error, "Couldn't connect to a wallet.");
	}
}

/**
 * Guards against signing for the wrong chain — a wallet set to Mainnet while
 * the app runs on Testnet produces a valid signature the network then
 * rejects, and the error surfaces far from its cause.
 */
export async function assertCorrectNetwork(): Promise<void> {
	const kit = await getKit();

	try {
		const { network, networkPassphrase } = await kit.getNetwork();

		if (networkPassphrase && networkPassphrase !== NETWORK_PASSPHRASE) {
			throw new WalletWrongNetworkError(network || "a different network");
		}
	} catch (error) {
		// Not every module can report its network (WalletConnect sessions are
		// pinned to allowedChains instead). A wallet that can't answer isn't a
		// reason to block the user — the backend still checks the signature.
		if (error instanceof WalletWrongNetworkError) throw error;
	}
}

// ---------------------------------------------------------------------
// Wallets hand `signMessage` results back as base64, *not* hex, despite
// looking plausible either way at a glance. The backend's signature-
// verification endpoints (wallet linking, wallet sign-in) both expect hex,
// so passing base64 straight through fails with a 401 that gives no hint
// the encoding was the problem.
//
// Separate, deeper issue: signMessage implements SEP-53 — it doesn't sign
// the raw nonce string but SHA256("Stellar Signed Message:\n" + nonce). A
// manual test with a raw Keypair.sign(nonce) verified fine against the live
// API, which means the backend checks the raw nonce bytes, so anything
// signed through a SEP-53 wallet fails. That can't be fixed client-side —
// wallets deliberately don't expose "sign these exact bytes" (that's the
// anti-blind-signing protection SEP-53 exists for). The backend needs to
// verify against the SEP-53 hash instead (Utils.verifyMessageSignature() in
// @stellar/stellar-sdk), for both /wallet/verify and /auth/use-wallet.
// ---------------------------------------------------------------------
const isHexString = (value: string) =>
	/^[0-9a-f]+$/i.test(value) && value.length % 2 === 0;

const base64ToHex = (value: string) =>
	Array.from(atob(value), (char) =>
		char.charCodeAt(0).toString(16).padStart(2, "0"),
	).join("");

export const toHexSignature = (signedMessage: string) =>
	isHexString(signedMessage)
		? signedMessage.toLowerCase()
		: base64ToHex(signedMessage);

/** Signs a backend-issued nonce and returns the hex signature it expects. */
export async function signNonce(nonce: string, address: string): Promise<string> {
	const kit = await getKit();

	try {
		const { signedMessage } = await kit.signMessage(nonce, {
			networkPassphrase: NETWORK_PASSPHRASE,
			address,
		});
		if (!signedMessage) throw new WalletRejectedError();
		return toHexSignature(signedMessage);
	} catch (error) {
		if (error instanceof WalletRejectedError) throw error;
		rethrow(error, "Couldn't sign the wallet verification message.");
	}
}

/** Signs prepared XDR. Returns the signed envelope, ready to submit. */
export async function signXdr(xdr: string, address: string): Promise<string> {
	const kit = await getKit();

	try {
		const { signedTxXdr } = await kit.signTransaction(xdr, {
			networkPassphrase: NETWORK_PASSPHRASE,
			address,
		});
		if (!signedTxXdr) throw new WalletRejectedError();
		return signedTxXdr;
	} catch (error) {
		if (error instanceof WalletRejectedError) throw error;
		rethrow(error, "Couldn't sign that transaction.");
	}
}

/** Forgets the connected wallet in the kit (not the backend link). */
export async function disconnectWallet(): Promise<void> {
	// Nothing to forget if no wallet action ever loaded the kit.
	if (!state.kit) return;

	try {
		const kit = await state.kit;
		await kit.disconnect();
	} catch {
		// Already gone; nothing to do.
	}
}
