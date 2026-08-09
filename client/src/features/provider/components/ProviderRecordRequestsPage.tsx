"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Pagination from "../../../components/shared/Pagination";
import StatusBadge from "../../provider-request/components/StatusBadge";
import { HealthRecordData } from "../../records/types";
import { RequestStatus } from "../../provider-request/types";
import {
	useApprovedPatientRecord,
	useProviderRecordRequests,
} from "../hooks";
import { ProviderRecordRequestData } from "../types";
import ProviderRecordDetailModal from "./ProviderRecordDetailModal";
import ProviderRecordRequestDetailModal from "./ProviderRecordRequestDetailModal";

type Filter = "all" | RequestStatus;

const formatDate = (value: string) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

export default function ProviderRecordRequestsPage() {
	const [status, setStatus] = useState<Filter>("all");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const [page, setPage] = useState(1);
	const [selectedRequest, setSelectedRequest] =
		useState<ProviderRecordRequestData | null>(null);
	const [previewRecord, setPreviewRecord] = useState<HealthRecordData | null>(null);
	const { mutate: fetchApprovedRecord, isPending: isLoadingRecord } =
		useApprovedPatientRecord();

	const { data, isLoading } = useProviderRecordRequests({
		status: status === "all" ? undefined : status,
		page,
		take: 20,
		sortOrder,
	});

	const requests = data?.data ?? [];

	const updateStatus = (value: Filter) => {
		setStatus(value);
		setPage(1);
	};

	const handlePreviewRecord = (request: ProviderRecordRequestData) => {
		if (!request.recordId) return;

		fetchApprovedRecord(
			{ patientId: request.patientId, recordId: request.recordId },
			{
				onSuccess: (record) => {
					setSelectedRequest(null);
					setPreviewRecord(record);
				},
			},
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">Record Requests</h1>
					<p className="mt-1 text-sm text-[#9B9B9B]">
						Track record-access requests, including revoked access.
					</p>
				</div>

				<div className="flex gap-2">
					<label className="relative">
						<span className="sr-only">Filter by status</span>
						<select
							value={status}
							onChange={(event) => updateStatus(event.target.value as Filter)}
							className="appearance-none rounded-[8px] border border-[#E5E5E5] bg-white py-1.5 pl-3 pr-8 text-sm font-medium outline-none"
						>
							<option value="all">All statuses</option>
							<option value="PENDING">Pending</option>
							<option value="APPROVED">Approved</option>
							<option value="DECLINED">Declined</option>
							<option value="REVOKED">Revoked</option>
						</select>
						<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]" />
					</label>

					<label className="relative">
						<span className="sr-only">Sort order</span>
						<select
							value={sortOrder}
							onChange={(event) => {
								setSortOrder(event.target.value as "asc" | "desc");
								setPage(1);
							}}
							className="appearance-none rounded-[8px] border border-[#E5E5E5] bg-white py-1.5 pl-3 pr-8 text-sm font-medium outline-none"
						>
							<option value="desc">Newest first</option>
							<option value="asc">Oldest first</option>
						</select>
						<ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#9B9B9B]" />
					</label>
				</div>
			</div>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				{isLoading ? (
					<p className="py-10 text-center text-sm text-[#9B9B9B]">Loading requests...</p>
				) : requests.length === 0 ? (
					<p className="py-10 text-center text-sm text-[#9B9B9B]">
						No record requests match this filter.
					</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full min-w-160 text-sm">
							<thead>
								<tr className="text-left text-xs text-[#9B9B9B]">
									<th className="pb-3 font-normal">Patient</th>
									<th className="pb-3 font-normal">Record</th>
									<th className="pb-3 font-normal">Request type</th>
									<th className="pb-3 font-normal">Requested</th>
									<th className="pb-3 font-normal">Status</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#F5F5F5]">
								{requests.map((request) => (
									<tr
										key={request.id}
										onClick={() => setSelectedRequest(request)}
										className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
									>
										<td className="py-3 text-[#9B9B9B]">
											{request.patient?.fullName ?? request.patient?.email ?? "Patient"}
										</td>
										<td className="py-3 text-[#9B9B9B]">
											{request.record?.title ?? "Access revoked"}
										</td>
										<td className="py-3 text-[#9B9B9B]">{request.requestType}</td>
										<td className="py-3 text-[#9B9B9B]">{formatDate(request.createdAt)}</td>
										<td className="py-3"><StatusBadge status={request.status} /></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{data && (
					<div className="mt-4">
						<Pagination
							currentPage={data.meta.page}
							totalPages={data.meta.totalPages}
							onPageChange={setPage}
						/>
					</div>
				)}
			</div>

			<ProviderRecordRequestDetailModal
				request={selectedRequest}
				onClose={() => setSelectedRequest(null)}
				onPreviewRecord={handlePreviewRecord}
				isLoadingRecord={isLoadingRecord}
			/>

			<ProviderRecordDetailModal
				record={previewRecord}
				onClose={() => setPreviewRecord(null)}
			/>
		</div>
	);
}
