"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { initialRequests, ProviderRequest } from "../types";
import ProviderRequestTable from "./ProviderRequestTable";
import ProviderRequestEmptyState from "./ProviderRequestEmptyState";
import ProviderRequestDetailModal from "./ProviderRequestDetailModal";

type Filter = "all" | "approved" | "declined";

export default function ProviderRequestPage() {
	const [requests, setRequests] = useState(initialRequests);
	const [filter, setFilter] = useState<Filter>("all");
	const [selectedRequest, setSelectedRequest] = useState<ProviderRequest | null>(
		null,
	);

	const filteredRequests = useMemo(() => {
		if (filter === "all") return requests;
		return requests.filter((request) => request.status === filter);
	}, [requests, filter]);

	const handleDecision = (id: string, approved: boolean) => {
		setRequests((prev) =>
			prev.map((request) =>
				request.id === id
					? { ...request, status: approved ? "approved" : "declined" }
					: request,
			),
		);

		setSelectedRequest((prev) =>
			prev && prev.id === id
				? { ...prev, status: approved ? "approved" : "declined" }
				: prev,
		);

		toast.success(`Request ${approved ? "approved" : "declined"}`);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-bold sm:text-3xl">Providers Request</h1>

				<div className="relative">
					<select
						value={filter}
						onChange={(e) => setFilter(e.target.value as Filter)}
						className="appearance-none rounded-[8px] border border-[#E5E5E5] bg-white py-1.5 pl-3 pr-8 text-sm font-medium outline-none"
					>
						<option value="all">All</option>
						<option value="approved">Approved</option>
						<option value="declined">Declined</option>
					</select>

					<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]" />
				</div>
			</div>

			{filteredRequests.length === 0 ? (
				<ProviderRequestEmptyState />
			) : (
				<ProviderRequestTable
					requests={filteredRequests}
					onRowClick={setSelectedRequest}
					onDecision={handleDecision}
				/>
			)}

			<ProviderRequestDetailModal
				request={selectedRequest}
				onClose={() => setSelectedRequest(null)}
				onDecision={handleDecision}
			/>
		</div>
	);
}
