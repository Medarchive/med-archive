// ---------------------------------------------------------------------
// Network restriction — this app only accepts wallets from one Stellar
// network at a time, controlled by an env var rather than hardcoded, so
// switching from testnet (pre-launch) to mainnet (live, real funds) is a
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

export const STELLAR_NETWORK_LABEL =
	ALLOWED_STELLAR_NETWORK === "MAINNET" ? "Mainnet" : "Testnet";

// Spelled out rather than imported from @stellar/stellar-sdk's `Networks`,
// so pages that only need the label don't pull the whole SDK into their
// bundle.
export const NETWORK_PASSPHRASE =
	ALLOWED_STELLAR_NETWORK === "MAINNET"
		? "Public Global Stellar Network ; September 2015"
		: "Test SDF Network ; September 2015";

// Payments are built and submitted from the browser (the backend only
// verifies them afterwards — see GET /service-orders/:id/payment-intent), so
// the client needs its own Horizon. Overridable for a private Horizon, but
// SDF's public instances are the sensible default.
export const HORIZON_URL =
	process.env.NEXT_PUBLIC_HORIZON_URL?.trim() ||
	(ALLOWED_STELLAR_NETWORK === "MAINNET"
		? "https://horizon.stellar.org"
		: "https://horizon-testnet.stellar.org");

// Reown (WalletConnect) project id. Optional: without it the wallet picker
// still offers every browser-extension wallet, just not the QR option that
// mobile wallets connect through.
export const WALLETCONNECT_PROJECT_ID =
	process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ?? "";

// Circle's USDC — the issuer the backend's trustlines point at (testnet
// wallets from POST /wallet/create trust GBBD47…FLA5). Only used here to
// price XLM in USDC for display; overridable if the backend switches issuer.
export const USDC_ISSUER =
	process.env.NEXT_PUBLIC_USDC_ISSUER?.trim() ||
	(ALLOWED_STELLAR_NETWORK === "MAINNET"
		? "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN"
		: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5");
