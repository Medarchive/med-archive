"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAccessRequests, useRespondToAccessRequest } from "../hooks";
import { AccessRequestData, RequestStatus } from "../types";
import ProviderRequestTable from "./ProviderRequestTable";
import ProviderRequestEmptyState from "./ProviderRequestEmptyState";
import ProviderRequestDetailModal from "./ProviderRequestDetailModal";

type Filter = "all" | "APPROVED" | "DECLINED";

export default function ProviderRequestPage() {
	const [filter, setFilter] = useState<Filter>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedRequest, setSelectedRequest] = useState<AccessRequestData | null>(
		null,
	);

	const { data, isLoading } = useAccessRequests({
		status: filter === "all" ? undefined : (filter as RequestStatus),
		page: currentPage,
		take: 8,
	});
	const { mutate: respond, isPending: isResponding } = useRespondToAccessRequest();

	const requests = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	const handleFilterChange = (value: Filter) => {
		setFilter(value);
		setCurrentPage(1);
	};

	const handleDecision = (id: string, approved: boolean) => {
		respond(
			{ id, status: approved ? "APPROVED" : "DECLINED" },
			{
				onSuccess: () => {
					setSelectedRequest((prev) =>
						prev && prev.id === id
							? { ...prev, status: approved ? "APPROVED" : "DECLINED" }
							: prev,
					);
				},
			},
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-bold sm:text-3xl">Providers Request</h1>

				<div className="relative">
					<select
						value={filter}
						onChange={(e) => handleFilterChange(e.target.value as Filter)}
						className="appearance-none rounded-[8px] border border-[#E5E5E5] bg-white py-1.5 pl-3 pr-8 text-sm font-medium outline-none"
					>
						<option value="all">All</option>
						<option value="APPROVED">Approved</option>
						<option value="DECLINED">Declined</option>
					</select>

					<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]" />
				</div>
			</div>

			{!isLoading && requests.length === 0 ? (
				<ProviderRequestEmptyState />
			) : (
				<ProviderRequestTable
					requests={requests}
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
					onRowClick={setSelectedRequest}
					onDecision={handleDecision}
					isResponding={isResponding}
				/>
			)}

			<ProviderRequestDetailModal
				request={selectedRequest}
				onClose={() => setSelectedRequest(null)}
				onDecision={handleDecision}
				isResponding={isResponding}
			/>
		</div>
	);
}
