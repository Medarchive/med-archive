// Server-only — imports Node's `crypto` and reads the unprefixed (non
// NEXT_PUBLIC_) env vars, so this must never be imported from a "use
// client" file or anything that ends up in the browser bundle.
import { createHmac } from "crypto";

export const API_BASE_URL =
	process.env.API_BASE_URL ?? "https://host.medarchive.africa";

// There's a single secret, used both as the x-api-key header value and as
// the HMAC key/message input — it plays both roles, it isn't two separate
// keys.
const API_KEY_SECRET = process.env.API_KEY_SECRET ?? "";

export function buildSignedHeaders() {
	const timestamp = Date.now().toString(); // unix ms
	const signature = createHmac("sha256", API_KEY_SECRET)
		.update(`${API_KEY_SECRET}:${timestamp}`)
		.digest("hex");

	return {
		"x-api-key": API_KEY_SECRET,
		"x-api-timestamp": timestamp,
		"x-api-signature": signature,
	};
}
