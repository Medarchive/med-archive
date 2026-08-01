"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import WalletSkeleton from "../../../components/shared/skeletons/WalletSkeleton";
import WalletBalanceHero from "./WalletBalanceHero";
import TransactionTable from "./TransactionTable";
import TransactionDetailModal from "./TransactionDetailModal";
import { useWallet, useConnectWallet } from "../hooks";
import { WalletTransaction } from "../types";
import { useHasMounted } from "../../../hooks/useHasMounted";

export default function WalletPage() {
	const hasMounted = useHasMounted();
	const { data: wallet, isLoading } = useWallet();
	const { mutate: connectWallet, isPending: isConnecting } = useConnectWallet();
	const [selectedTransaction, setSelectedTransaction] =
		useState<WalletTransaction | null>(null);

	if (!hasMounted || isLoading) {
		return <WalletSkeleton />;
	}

	if (!wallet || !wallet.verifiedAt) {
		return (
			<div className="space-y-6">
				<h1 className="text-2xl font-bold sm:text-3xl">Wallet</h1>

				<div className="flex flex-col items-center justify-center gap-4 rounded-[12px] border border-dashed border-[#E5E5E5] py-20 text-center">
					<p className="max-w-sm text-[#9B9B9B]">
						{wallet
							? "Your wallet is linked but not yet verified. Verify it to see your balance and transactions."
							: "Connect your Stellar wallet with Freighter to see your balance and transaction history."}
					</p>

					<Button isLoading={isConnecting} onClick={() => connectWallet()}>
						{wallet ? "Verify Wallet" : "Connect Wallet"}
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Wallet</h1>

			<WalletBalanceHero balance={wallet.balance} address={wallet.address} />

			<TransactionTable onRowClick={setSelectedTransaction} />

			<TransactionDetailModal
				transaction={selectedTransaction}
				onClose={() => setSelectedTransaction(null)}
			/>
		</div>
	);
}
