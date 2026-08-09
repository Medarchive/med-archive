"use client";

import { FileText } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import StatusBadge from "../../../components/shared/StatusBadge";
import { HealthRecordData, recordTypeConfig } from "../../records/types";

interface ProviderRecordDetailModalProps {
	record: HealthRecordData | null;
	onClose: () => void;
}

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// Read-only counterpart to features/records/components/RecordDetailModal —
// a provider can view and ZK-verify a patient's approved record, but has
// no delete action (that's the patient's own data; this same endpoint
// would just 403 a provider anyway).
export default function ProviderRecordDetailModal({
	record,
	onClose,
}: ProviderRecordDetailModalProps) {
	if (!record) return null;

	const fields = record as unknown as Record<string, string>;
	const primaryField = recordTypeConfig[record.recordType].primaryField;

	return (
		<Modal open={!!record} onClose={onClose}>
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-4">
					<p className="text-sm font-semibold">Title</p>
					<p className="text-sm text-[#9B9B9B]">{record.title}</p>
				</div>

				{primaryField && (
					<div className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">{primaryField.label}</p>
						<p className="text-sm text-[#9B9B9B]">
							{fields[primaryField.key] ?? "—"}
						</p>
					</div>
				)}

				<div className="flex items-center justify-between gap-4">
					<p className="text-sm font-semibold">Date</p>
					<p className="text-sm text-[#9B9B9B]">
						{formatDate(record.recordDate ?? record.createdAt)}
					</p>
				</div>

				{record.description && (
					<div className="flex items-start justify-between gap-4">
						<p className="text-sm font-semibold">Description</p>
						<p className="max-w-60 text-right text-sm text-[#9B9B9B]">
							{record.description}
						</p>
					</div>
				)}

				<div className="flex items-center justify-between gap-4">
					<p className="text-sm font-semibold">ZK Proof</p>
					<StatusBadge
						variant={record.zkVerified ? "success" : "warning"}
						label={record.zkVerified ? "Verified" : "Not verified"}
					/>
				</div>

				{record.files.length > 0 && (
					<div className="space-y-2">
						<p className="text-sm font-semibold">
							{record.files.length === 1
								? "Attachment"
								: `Attachments (${record.files.length})`}
						</p>

						{record.files.map((file) => (
							<a
								key={file.id}
								href={file.fileUrl}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-3 rounded-[8px] border border-[#F5F5F5] p-3 duration-150 hover:bg-[#FAFAFA]"
							>
								<span className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-[#FAFAFA] text-[#9B9B9B]">
									<FileText className="size-5" />
								</span>
								<div className="min-w-0">
									<p className="truncate text-sm">{file.fileName}</p>
									<p className="text-xs text-[#9B9B9B]">
										{formatFileSize(file.fileSize)}
									</p>
								</div>
							</a>
						))}
					</div>
				)}

			</div>
		</Modal>
	);
}
