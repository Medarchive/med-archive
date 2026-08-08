"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import { useProviderActivity } from "../hooks";

const truncate = (value: string, head = 6, tail = 6) =>
	value.length > head + tail ? `${value.slice(0, head)}...${value.slice(-tail)}` : value;

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString();
};

// "WALLET_LINKED" -> "Wallet Linked"
const formatAction = (action: string) =>
	action
		.toLowerCase()
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

const metadataSummary = (metadata: Record<string, unknown> | null) => {
	if (!metadata) return "—";
	if (typeof metadata.address === "string") return truncate(metadata.address);
	return "—";
};

export default function ProviderActivityTable() {
	const [currentPage, setCurrentPage] = useState(1);

	const { data, isLoading } = useProviderActivity({ page: currentPage, take: 15 });

	const logs = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	if (isLoading) {
		return <TableSkeleton rows={10} columns={3} />;
	}

	return (
		<div className="min-w-0 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="min-w-0 overflow-x-auto">
				<table className="w-full min-w-135 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Action</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Details</th>
							<th className="whitespace-nowrap pb-3 font-normal text-right">
								Date
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{logs.length === 0 && (
							<tr>
								<td colSpan={3} className="py-6 text-center text-[#9B9B9B]">
									No activity recorded yet
								</td>
							</tr>
						)}

						{logs.map((log) => (
							<tr key={log.id}>
								<td className="whitespace-nowrap py-3 pr-4 font-medium">
									{formatAction(log.action)}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{metadataSummary(log.metadata)}
								</td>
								<td className="whitespace-nowrap py-3 text-right text-[#9B9B9B]">
									{formatDate(log.createdAt)}
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
