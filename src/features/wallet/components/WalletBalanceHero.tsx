"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import ConfirmModal from "../../../components/ui/custom/ConfirmModal";
import { ALLOWED_STELLAR_NETWORK } from "../../../lib/wallet/config";
import { useUnlinkWallet, useXlmPriceInUsdc } from "../hooks";

const formatUsdc = (value: number) =>
	value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface WalletBalanceHeroProps {
	balance: string | null;
	address: string;
}

export default function WalletBalanceHero({
	balance,
	address,
}: WalletBalanceHeroProps) {
	const [copied, setCopied] = useState(false);
	const [confirmUnlink, setConfirmUnlink] = useState(false);
	const { mutate: unlinkWallet, isPending: isUnlinking } = useUnlinkWallet();
	const { data: xlmPrice } = useXlmPriceInUsdc();

	// An estimate for display only — what the XLM would sell for at today's
	// market price, not USDC the wallet actually holds.
	const usdcValue =
		balance && xlmPrice != null ? Number(balance) * xlmPrice : null;

	const handleCopyAddress = async () => {
		await navigator.clipboard.writeText(address);
		setCopied(true);
		toast.success("Address copied to clipboard");
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<p className="text-sm text-[#9B9B9B]">Wallet balance</p>
					<p className="mt-2 text-3xl font-bold">
						{balance ? `${balance} XLM` : "Unfunded"}
					</p>
					{usdcValue != null && (
						<p className="mt-1 text-sm text-[#9B9B9B]">
							≈ {formatUsdc(usdcValue)} USDC
							{ALLOWED_STELLAR_NETWORK === "TESTNET" && (
								<span className="text-xs"> · testnet price, for reference only</span>
							)}
						</p>
					)}
				</div>

				<button
					type="button"
					onClick={() => setConfirmUnlink(true)}
					className="text-sm font-medium text-error hover:underline"
				>
					Disconnect Wallet
				</button>
			</div>

			<div className="mt-6">
				<p className="text-sm text-[#9B9B9B]">
					Address <span className="text-xs">(send XLM here to fund your wallet)</span>
				</p>

				<button
					type="button"
					onClick={handleCopyAddress}
					className="mt-1 flex items-center gap-2 text-left font-medium duration-150 hover:text-primary"
				>
					<span className="break-all">{address}</span>
					{copied ? (
						<Check className="size-4 shrink-0" />
					) : (
						<Copy className="size-4 shrink-0" />
					)}
				</button>
			</div>

			<ConfirmModal
				open={confirmUnlink}
				message="Disconnect this wallet from your account?"
				onConfirm={() => unlinkWallet(undefined, { onSuccess: () => setConfirmUnlink(false) })}
				onCancel={() => setConfirmUnlink(false)}
				isLoading={isUnlinking}
			/>
		</div>
	);
}
