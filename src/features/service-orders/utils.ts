// "25.5000000" → "25.5", "100.0000000" → "100". String-only on purpose —
// amounts are 7-decimal strings and never go through a float.
export const formatOrderAmount = (amount: string, assetCode = "USDC") => {
	const trimmed = amount.includes(".") ? amount.replace(/\.?0+$/, "") : amount;
	return `${trimmed} ${assetCode}`;
};

export const formatOrderDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};
