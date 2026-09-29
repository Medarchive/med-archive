import { HORIZON_URL, USDC_ISSUER } from "./config";

// What 1 XLM sells for in USDC right now, from Stellar's own markets (the
// best Horizon strict-send path). Priced per single XLM and multiplied by
// the caller, so a large balance isn't distorted by slippage on thin order
// books. Null when there's no market path at all. Plain REST, so this
// doesn't pull in @stellar/stellar-sdk.
export async function fetchXlmPriceInUsdc(): Promise<number | null> {
	const params = new URLSearchParams({
		source_asset_type: "native",
		source_amount: "1",
		destination_assets: `USDC:${USDC_ISSUER}`,
	});

	const response = await fetch(`${HORIZON_URL}/paths/strict-send?${params}`);
	if (!response.ok) throw new Error(`Horizon returned ${response.status}`);

	const body = (await response.json()) as {
		_embedded?: { records?: { destination_amount: string }[] };
	};
	const amounts = (body._embedded?.records ?? []).map((path) =>
		Number(path.destination_amount),
	);

	return amounts.length > 0 ? Math.max(...amounts) : null;
}
