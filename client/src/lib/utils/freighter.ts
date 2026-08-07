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
