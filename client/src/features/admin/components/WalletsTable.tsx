"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import { useAdminWallets } from "../hooks";

const truncate = (value: string, head = 6, tail = 6) =>
	value.length > head + tail ? `${value.slice(0, head)}...${value.slice(-tail)}` : value;

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function WalletsTable() {
	const [currentPage, setCurrentPage] = useState(1);

	const { data, isLoading } = useAdminWallets({ page: currentPage, take: 10 });

	const wallets = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	if (isLoading) {
		return <TableSkeleton rows={8} columns={5} />;
	}

	return (
		<div className="min-w-0 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="min-w-0 overflow-x-auto">
				<table className="w-full min-w-180 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">
								Owner (User ID)
							</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Address</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Network</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Label</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Verified</th>
							<th className="whitespace-nowrap pb-3 font-normal text-right">
								Linked
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{wallets.length === 0 && (
							<tr>
								<td colSpan={6} className="py-6 text-center text-[#9B9B9B]">
									No wallets linked yet
								</td>
							</tr>
						)}

						{wallets.map((wallet) => (
							<tr key={wallet.id}>
								<td className="whitespace-nowrap py-3 pr-4 font-medium">
									{truncate(wallet.userId)}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{truncate(wallet.address)}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{wallet.network}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{wallet.label ?? "—"}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{formatDate(wallet.verifiedAt)}
								</td>
								<td className="whitespace-nowrap py-3 text-right text-[#9B9B9B]">
									{formatDate(wallet.createdAt)}
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
