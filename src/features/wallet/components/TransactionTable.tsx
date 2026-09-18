"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import { useWalletTransactions } from "../hooks";
import { WalletTransaction } from "../types";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface TransactionTableProps {
	onRowClick: (transaction: WalletTransaction) => void;
}

const PAGE_SIZE = 8;

const formatDate = (value?: string) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

const getTxId = (tx: WalletTransaction) => tx.id ?? tx.hash ?? "—";

export default function TransactionTable({ onRowClick }: TransactionTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const { data, isLoading } = useWalletTransactions({
		page: currentPage,
		take: PAGE_SIZE,
	});

	const transactions = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Transaction History</h3>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-135 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Transaction ID</th>
							<th className="pb-3 font-normal">Type</th>
							<th className="pb-3 font-normal">Status</th>
							<th className="pb-3 font-normal">Date</th>
							<th className="pb-3 font-normal text-right">Amount</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{isLoading && (
							<tr>
								<td colSpan={5} className="py-6 text-center text-[#9B9B9B]">
									Loading...
								</td>
							</tr>
						)}

						{!isLoading && transactions.length === 0 && (
							<tr>
								<td colSpan={5} className="py-6 text-center text-[#9B9B9B]">
									No transactions yet
								</td>
							</tr>
						)}

						{transactions.map((transaction, index) => (
							<tr
								key={getTxId(transaction) + index}
								onClick={() => onRowClick(transaction)}
								className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
							>
								<td className="max-w-45 truncate py-3 font-medium">
									{getTxId(transaction)}
								</td>
								<td className="py-3 text-[#9B9B9B]">{transaction.type ?? "—"}</td>
								<td className="py-3">
									<TransactionStatusBadge status={transaction.status} />
								</td>
								<td className="py-3 text-[#9B9B9B]">
									{formatDate(transaction.createdAt)}
								</td>
								<td className="py-3 text-right font-medium">
									{transaction.amount !== undefined
										? `${transaction.amount} XLM`
										: "—"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="mt-4">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</div>
	);
}
