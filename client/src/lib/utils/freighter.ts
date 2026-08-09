import { Buffer } from "buffer";

// Freighter is a browser extension — there's no way for @stellar/freighter-api
// to detect it on a mobile browser even if the user has Freighter's separate
// mobile app installed, since a mobile app can't inject itself into an
// arbitrary mobile browser tab the way a desktop extension does. Detect that
// case up front and point people at the right thing (the mobile app store,
// vs. the extension) instead of just failing with a generic "not installed"
// message either way.
export const FREIGHTER_LINKS = {
	ios: "https://apps.apple.com/us/app/freighter/id6743947720",
	android: "https://play.google.com/store/apps/details?id=org.stellar.freighterwallet",
	// Only the Chrome Web Store listing is confirmed — for every other
	// desktop browser, freighter.app's own download page is the safe bet
	// rather than guessing at a Firefox/Safari store URL that may not exist.
	chromeExtension:
		"https://chromewebstore.google.com/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk",
	website: "https://www.freighter.app/",
};

export const isMobileDevice = () => {
	if (typeof navigator === "undefined") return false;
	return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const isChromiumBrowser = () => {
	if (typeof navigator === "undefined") return false;
	return (
		/Chrome|Chromium|Edg|Brave/i.test(navigator.userAgent) &&
		!/Firefox/i.test(navigator.userAgent)
	);
};

export const getFreighterInstallUrl = () => {
	if (typeof navigator === "undefined") return FREIGHTER_LINKS.website;
	if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return FREIGHTER_LINKS.ios;
	if (/Android/i.test(navigator.userAgent)) return FREIGHTER_LINKS.android;
	if (isChromiumBrowser()) return FREIGHTER_LINKS.chromeExtension;
	return FREIGHTER_LINKS.website;
};

// Thrown (instead of a plain Error) specifically for the "Freighter isn't
// usable here" case, so callers can show an actionable install link rather
// than just a dead-end error toast.
export class FreighterUnavailableError extends Error {
	installUrl: string;
	installLabel: string;

	constructor(message: string, installUrl: string, installLabel: string) {
		super(message);
		this.name = "FreighterUnavailableError";
		this.installUrl = installUrl;
		this.installLabel = installLabel;
	}
}

export const buildFreighterUnavailableError = () => {
	if (isMobileDevice()) {
		return new FreighterUnavailableError(
			"Freighter's browser extension isn't available on mobile browsers. Get the Freighter mobile app, then connect from a desktop browser with the extension installed.",
			getFreighterInstallUrl(),
			"Get Freighter app",
		);
	}

	return new FreighterUnavailableError(
		"Freighter wallet extension isn't installed.",
		getFreighterInstallUrl(),
		"Install Freighter",
	);
};

// ---------------------------------------------------------------------
// Network restriction — this app only accepts wallet links from one
// Stellar network at a time, controlled by an env var rather than hardcoded,
// so switching from testnet (pre-launch) to mainnet (live, real funds) is a
// one-line config change, not a code change. There's deliberately no "allow
// either" mode — silently letting testnet and mainnet wallets mix is exactly
// the kind of mistake that's easy to make and expensive to get wrong on a
// blockchain app.
// ---------------------------------------------------------------------
export type StellarNetwork = "TESTNET" | "MAINNET";

export const ALLOWED_STELLAR_NETWORK: StellarNetwork =
	process.env.NEXT_PUBLIC_STELLAR_NETWORK?.trim().toUpperCase() === "MAINNET"
		? "MAINNET"
		: "TESTNET";

// Freighter reports Stellar mainnet as "PUBLIC", not "MAINNET".
const matchesAllowedNetwork = (freighterNetwork: string) => {
	const reported = freighterNetwork.trim().toUpperCase();
	if (ALLOWED_STELLAR_NETWORK === "MAINNET") return reported === "PUBLIC";
	return reported === "TESTNET";
};

export class FreighterWrongNetworkError extends Error {}

// Throws unless Freighter is actively set to the one network this app is
// currently configured to accept.
export const assertAllowedFreighterNetwork = (freighterNetwork: string) => {
	if (matchesAllowedNetwork(freighterNetwork)) return;

	const label = ALLOWED_STELLAR_NETWORK === "MAINNET" ? "Mainnet" : "Testnet";
	throw new FreighterWrongNetworkError(
		`Freighter is set to a different Stellar network. Switch it to ${label} in the extension and try again — only ${label} is supported right now.`,
	);
};

// ---------------------------------------------------------------------
// Freighter's `signMessage` can hand back the signature as either a Buffer
// (older extension versions) or a string (current) — and, confirmed against
// a real signature, that string is base64, *not* hex, despite looking
// plausible either way at a glance. The backend's signature-verification
// endpoints (wallet linking, wallet sign-in) both expect hex, so passing a
// base64 string straight through fails verification with a 401 that gives
// no hint the encoding was the problem. Normalize whichever shape/encoding
// Freighter handed back into the hex the API actually wants.
//
// Separate, deeper issue confirmed after fixing the above (still 401s with
// "Wallet signature verification failed" even once the encoding is
// correct): freighter.signMessage() implements SEP-53 — it doesn't sign the
// raw nonce string. It signs SHA256("Stellar Signed Message:\n" + nonce),
// per the SEP-53 spec (github.com/orgs/stellar/discussions/1641). A manual
// test using a raw Keypair.sign(nonce) (no SEP-53 wrapping) verified fine
// against the live API, which means the backend is currently checking the
// signature against the raw nonce bytes, not the SEP-53-wrapped hash — so
// anything actually signed through Freighter (or any other SEP-53-compliant
// wallet) will always fail here. This can't be worked around client-side:
// Freighter deliberately doesn't expose a "sign these exact bytes, no
// wrapping" API (that's the anti-blind-signing protection SEP-53 exists
// for) — only signTransaction (XDR) and signMessage (SEP-53) are available.
// The backend needs to verify against SHA256("Stellar Signed
// Message:\n" + nonce) instead — e.g. Utils.verifyMessageSignature() in
// @stellar/stellar-sdk for a JS backend — for both /wallet/verify and
// /auth/use-wallet, since both go through this same signMessage() call.
// ---------------------------------------------------------------------
const isHexString = (value: string) => /^[0-9a-f]+$/i.test(value) && value.length % 2 === 0;

export const toHexSignature = (signedMessage: string | Buffer | null) => {
	if (!signedMessage) return "";

	if (typeof signedMessage !== "string") {
		return Buffer.from(signedMessage).toString("hex");
	}

	return isHexString(signedMessage)
		? signedMessage.toLowerCase()
		: Buffer.from(signedMessage, "base64").toString("hex");
};
