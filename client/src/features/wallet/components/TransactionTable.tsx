"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import { Transaction } from "../types";
import TransactionStatusBadge from "./TransactionStatusBadge";

interface TransactionTableProps {
	transactions: Transaction[];
	onRowClick: (transaction: Transaction) => void;
}

const PAGE_SIZE = 8;

export default function TransactionTable({
	transactions,
	onRowClick,
}: TransactionTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
	const visibleTransactions = transactions.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Transaction History</h3>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-135 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Transaction ID</th>
							<th className="pb-3 font-normal">Transaction Type</th>
							<th className="pb-3 font-normal">Status</th>
							<th className="pb-3 font-normal text-right">Amount</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{visibleTransactions.map((transaction) => (
							<tr
								key={transaction.id}
								onClick={() => onRowClick(transaction)}
								className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
							>
								<td className="max-w-45 truncate py-3 font-medium">
									{transaction.transactionId}
								</td>
								<td className="py-3 text-[#9B9B9B]">{transaction.type}</td>

								<td className="py-3">
									<TransactionStatusBadge status={transaction.status} />
								</td>

								<td className="py-3 text-right font-medium">
									{transaction.amount}
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
