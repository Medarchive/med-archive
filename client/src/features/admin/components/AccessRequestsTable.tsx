"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import StatusBadge from "../../provider-request/components/StatusBadge";
import { RequestStatus } from "../../provider-request/types";
import { useAdminAccessRequests } from "../hooks";

type StatusFilter = "ALL" | RequestStatus;

const statusTabs: { label: string; value: StatusFilter }[] = [
	{ label: "All", value: "ALL" },
	{ label: "Pending", value: "PENDING" },
	{ label: "Approved", value: "APPROVED" },
	{ label: "Declined", value: "DECLINED" },
];

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function AccessRequestsTable() {
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
	const [currentPage, setCurrentPage] = useState(1);

	const { data, isLoading } = useAdminAccessRequests({
		status: statusFilter === "ALL" ? undefined : statusFilter,
		page: currentPage,
		take: 10,
	});

	const requests = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	const handleStatusChange = (status: StatusFilter) => {
		setStatusFilter(status);
		setCurrentPage(1);
	};

	if (isLoading) {
		return <TableSkeleton rows={8} columns={5} showTabs />;
	}

	return (
		<div className="min-w-0 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex flex-wrap gap-2">
				{statusTabs.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => handleStatusChange(tab.value)}
						className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium duration-150
              ${
								statusFilter === tab.value
									? "border-black bg-black text-white"
									: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
							}
            `}
					>
						{tab.label}
					</button>
				))}
			</div>

			<div className="mt-4 min-w-0 overflow-x-auto">
				<table className="w-full min-w-200 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Provider</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Email</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">
								Organization
							</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Request</th>
							<th className="whitespace-nowrap pb-3 pr-4 font-normal">Date</th>
							<th className="whitespace-nowrap pb-3 font-normal">Status</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{requests.length === 0 && (
							<tr>
								<td colSpan={6} className="py-6 text-center text-[#9B9B9B]">
									No access requests
								</td>
							</tr>
						)}

						{requests.map((request) => (
							<tr key={request.id}>
								<td className="whitespace-nowrap py-3 pr-4 font-medium">
									{request.providerName}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{request.providerEmail}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{request.organizationName ?? "—"}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{request.requestType}
								</td>
								<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
									{formatDate(request.requestedAt)}
								</td>
								<td className="whitespace-nowrap py-3">
									<StatusBadge status={request.status} />
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
