"use client";

import { useState } from "react";
import EmptyState from "../../../components/shared/EmptyState";
import { initialTransactions, Transaction } from "../types";
import WalletBalanceHero from "./WalletBalanceHero";
import TransactionTable from "./TransactionTable";
import TransactionDetailModal from "./TransactionDetailModal";

export default function WalletPage() {
	const [transactions] = useState(initialTransactions);
	const [selectedTransaction, setSelectedTransaction] =
		useState<Transaction | null>(null);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Wallet</h1>

			<WalletBalanceHero
				balance="$200,000"
				address="GBTEZE3JLLRBS5NFXRPQU675AFLC3L7P2CXDOIM4333AUNCZ2NUA2EKV"
			/>

			{transactions.length === 0 ? (
				<EmptyState message="There's nothing here yet" />
			) : (
				<TransactionTable
					transactions={transactions}
					onRowClick={setSelectedTransaction}
				/>
			)}

			<TransactionDetailModal
				transaction={selectedTransaction}
				onClose={() => setSelectedTransaction(null)}
			/>
		</div>
	);
}
