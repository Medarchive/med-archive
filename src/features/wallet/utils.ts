// Horizon reports fees in stroops; 1 XLM = 10,000,000 stroops.
export const stroopsToXlm = (stroops: string) => `${Number(stroops) / 10_000_000} XLM`;

export const shortHash = (hash: string) => `${hash.slice(0, 8)}…${hash.slice(-8)}`;
