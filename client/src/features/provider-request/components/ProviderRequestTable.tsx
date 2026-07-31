"use client";

import { useState } from "react";
import { Button } from "../../../components/ui/button";
import Pagination from "../../../components/shared/Pagination";
import { ProviderRequest, RequestStatus } from "../types";
import StatusBadge from "./StatusBadge";

interface ProviderRequestTableProps {
	requests: ProviderRequest[];
	onRowClick: (request: ProviderRequest) => void;
	onDecision: (id: string, approved: boolean) => void;
}

const PAGE_SIZE = 8;

const getInitials = (name: string) =>
	name.replace(/^Dr\.\s*/i, "").slice(0, 2).toUpperCase();

export default function ProviderRequestTable({
	requests,
	onRowClick,
	onDecision,
}: ProviderRequestTableProps) {
	const [currentPage, setCurrentPage] = useState(1);
	const totalPages = Math.max(1, Math.ceil(requests.length / PAGE_SIZE));
	const visibleRequests = requests.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="overflow-x-auto">
				<table className="w-full min-w-180 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Provides Name</th>
							<th className="pb-3 font-normal">Request</th>
							<th className="pb-3 font-normal">Hospital</th>
							<th className="pb-3 font-normal">Note</th>
							<th className="pb-3 font-normal">Date</th>
							<th className="pb-3 font-normal">Status</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{visibleRequests.map((request) => (
							<tr
								key={request.id}
								onClick={() => onRowClick(request)}
								className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
							>
								<td className="py-3">
									<div className="flex items-center gap-2">
										<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-white">
											{getInitials(request.providerName)}
										</span>
										{request.providerName}
									</div>
								</td>

								<td className="py-3 text-[#9B9B9B]">{request.request}</td>
								<td className="py-3 text-[#9B9B9B]">{request.hospital}</td>

								<td className="max-w-50 truncate py-3 text-[#9B9B9B]">
									{request.note}
								</td>

								<td className="py-3 text-[#9B9B9B]">{request.date}</td>

								<td className="py-3">
									{request.status === "pending" ? (
										<div
											className="flex gap-2"
											onClick={(e) => e.stopPropagation()}
										>
											<Button
												size="sm"
												onClick={() => onDecision(request.id, true)}
											>
												Approve
											</Button>

											<Button
												size="sm"
												variant="destructive"
												onClick={() => onDecision(request.id, false)}
											>
												Decline
											</Button>
										</div>
									) : (
										<StatusBadge status={request.status as RequestStatus} />
									)}
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
