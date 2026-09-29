"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import { useWalletTransactions } from "../hooks";
import { WalletTransaction } from "../types";
import { shortHash, stroopsToXlm } from "../utils";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface TransactionTableProps {
	onRowClick: (transaction: WalletTransaction) => void;
}

const PAGE_SIZE = 8;

const formatDate = (value: string) => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function TransactionTable({ onRowClick }: TransactionTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const { data, isLoading } = useWalletTransactions({
		page: currentPage,
		take: PAGE_SIZE,
	});

	const transactions = data?.items ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Transaction History</h3>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-135 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Transaction</th>
							<th className="pb-3 font-normal">Memo</th>
							<th className="pb-3 font-normal">Status</th>
							<th className="pb-3 font-normal">Date</th>
							<th className="pb-3 font-normal text-right">Fee</th>
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

						{transactions.map((transaction) => (
							<tr
								key={transaction.id}
								onClick={() => onRowClick(transaction)}
								className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
							>
								<td className="py-3 font-mono text-xs font-medium">
									{shortHash(transaction.hash)}
								</td>
								<td className="py-3 text-[#9B9B9B]">{transaction.memo ?? "—"}</td>
								<td className="py-3">
									<TransactionStatusBadge successful={transaction.successful} />
								</td>
								<td className="py-3 text-[#9B9B9B]">
									{formatDate(transaction.createdAt)}
								</td>
								<td className="py-3 text-right text-[#9B9B9B]">
									{stroopsToXlm(transaction.feeCharged)}
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
