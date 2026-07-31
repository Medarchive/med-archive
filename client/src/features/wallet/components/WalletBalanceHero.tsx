"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";

interface WalletBalanceHeroProps {
	balance: string;
	address: string;
}

export default function WalletBalanceHero({
	balance,
	address,
}: WalletBalanceHeroProps) {
	const [copied, setCopied] = useState(false);

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
					<p className="mt-2 text-3xl font-bold">{balance}</p>
				</div>

				<Button
					size="sm"
					onClick={() => toast.success("Add funds flow coming soon")}
				>
					Add Funds
				</Button>
			</div>

			<div className="mt-6">
				<p className="text-sm text-[#9B9B9B]">Address</p>

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
		</div>
	);
}
