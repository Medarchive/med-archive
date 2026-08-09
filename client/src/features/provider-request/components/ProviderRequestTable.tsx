"use client";

import { Button } from "../../../components/ui/button";
import Pagination from "../../../components/shared/Pagination";
import { AccessRequestData } from "../types";
import StatusBadge from "./StatusBadge";

interface ProviderRequestTableProps {
	requests: AccessRequestData[];
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onRowClick: (request: AccessRequestData) => void;
	onDecision: (id: string, approved: boolean) => void;
	onRevoke: (id: string) => void;
	isResponding: boolean;
	isRevoking: boolean;
}

const getInitials = (name: string) =>
	name.replace(/^Dr\.\s*/i, "").slice(0, 2).toUpperCase();

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function ProviderRequestTable({
	requests,
	currentPage,
	totalPages,
	onPageChange,
	onRowClick,
	onDecision,
	onRevoke,
	isResponding,
	isRevoking,
}: ProviderRequestTableProps) {
	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="overflow-x-auto">
				<table className="w-full min-w-180 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Provider Name</th>
							<th className="pb-3 font-normal">Organization</th>
							<th className="pb-3 font-normal">Request</th>
							<th className="pb-3 font-normal">Note</th>
							<th className="pb-3 font-normal">Date</th>
							<th className="pb-3 font-normal">Status</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{requests.map((request) => (
							<tr
								key={request.id}
								onClick={() => onRowClick(request)}
								className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
							>
								<td className="py-3">
									<div className="flex items-center gap-2">
										{request.providerProfilePictureUrl ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={request.providerProfilePictureUrl}
												alt=""
												className="size-7 shrink-0 rounded-full object-cover"
											/>
										) : (
											<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-white">
												{getInitials(request.providerName)}
											</span>
										)}
										{request.providerName}
									</div>
								</td>

								<td className="py-3 text-[#9B9B9B]">
									{request.organizationName ?? "—"}
								</td>

								<td className="py-3 text-[#9B9B9B]">{request.requestType}</td>

								<td className="max-w-50 truncate py-3 text-[#9B9B9B]">
									{request.note ?? "—"}
								</td>

								<td className="py-3 text-[#9B9B9B]">
									{formatDate(request.createdAt)}
								</td>

								<td className="py-3">
									{request.status === "PENDING" ? (
										<div
											className="flex gap-2"
											onClick={(e) => e.stopPropagation()}
										>
											<Button
												size="sm"
												isLoading={isResponding}
												onClick={() => onDecision(request.id, true)}
											>
												Approve
											</Button>

											<Button
												size="sm"
												variant="destructive"
												isLoading={isResponding}
												onClick={() => onDecision(request.id, false)}
											>
												Decline
											</Button>
										</div>
									) : (
										// No revoke action for APPROVED rows — the API has no
										// mechanism for it (confirmed: PATCH only accepts
										// APPROVED/DECLINED, no REVOKED, no DELETE). Add it here
										// once that exists.
									<div
										className="flex items-center gap-2"
										onClick={(e) => e.stopPropagation()}
									>
										<StatusBadge status={request.status} />
										{request.status === "APPROVED" && (
											<Button
												size="sm"
												variant="destructive"
												isLoading={isRevoking}
												onClick={() => onRevoke(request.id)}
											>
												Revoke
											</Button>
										)}
									</div>
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
					onPageChange={onPageChange}
				/>
			</div>
		</div>
	);
}
