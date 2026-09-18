"use client";

import { Eye } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import { Button } from "../../../components/ui/button";
import StatusBadge from "../../provider-request/components/StatusBadge";
import { ProviderRecordRequestData } from "../types";

interface ProviderRecordRequestDetailModalProps {
	request: ProviderRecordRequestData | null;
	onClose: () => void;
	onPreviewRecord: (request: ProviderRecordRequestData) => void;
	isLoadingRecord: boolean;
}

const formatDate = (value: string) => {
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function ProviderRecordRequestDetailModal({
	request,
	onClose,
	onPreviewRecord,
	isLoadingRecord,
}: ProviderRecordRequestDetailModalProps) {
	return (
		<Modal open={!!request} onClose={onClose}>
			{request && (
				<div className="space-y-4">
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Patient</p>
						<div className="text-right text-sm text-[#9B9B9B]">
							<p>{request.patient.fullName}</p>
							<p className="text-xs">{request.patient.email}</p>
						</div>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Request type</p>
						<p className="text-sm text-[#9B9B9B]">{request.requestType}</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Record</p>
						<p className="text-right text-sm text-[#9B9B9B]">
							{request.record?.title ?? "No record available"}
						</p>
					</div>

					{request.note && (
						<div className="flex items-start justify-between gap-4">
							<p className="text-sm font-semibold">Note</p>
							<p className="max-w-70 text-right text-sm text-[#9B9B9B]">
								{request.note}
							</p>
						</div>
					)}

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Requested</p>
						<p className="text-sm text-[#9B9B9B]">{formatDate(request.createdAt)}</p>
					</div>

					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">Status</p>
						<StatusBadge status={request.status} />
					</div>

					{request.status === "APPROVED" && request.recordId && (
						<div className="flex justify-end pt-2">
							<Button
								size="sm"
								isLoading={isLoadingRecord}
								onClick={() => onPreviewRecord(request)}
							>
								<Eye className="size-3.5" />
								Preview Record
							</Button>
						</div>
					)}
				</div>
			)}
		</Modal>
	);
}
