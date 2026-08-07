"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileText, ShieldCheck } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import ConfirmModal from "../../../components/ui/custom/ConfirmModal";
import { HealthRecordData, recordTypeConfig } from "../types";
import { useDeleteHealthRecord, useRecordProof, useVerifyRecordProof } from "../hooks";
import ZkProofBadge from "./ZkProofBadge";

interface RecordDetailModalProps {
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

export default function RecordDetailModal({ record, onClose }: RecordDetailModalProps) {
	const [confirmDelete, setConfirmDelete] = useState(false);
	const { data: proof, isLoading: isProofLoading } = useRecordProof(record?.id ?? null);
	const { mutate: verifyProof, isPending: isVerifying } = useVerifyRecordProof();
	const { mutate: deleteRecord, isPending: isDeleting } = useDeleteHealthRecord();

	if (!record) return null;

	const fields = record as unknown as Record<string, string>;
	const primaryField = recordTypeConfig[record.recordType].primaryField;

	const handleDelete = () => {
		deleteRecord(record.id, {
			onSuccess: () => {
				setConfirmDelete(false);
				onClose();
			},
		});
	};

	const handleVerify = () => {
		verifyProof(record.id, {
			onError: (error) => {
				toast.error(error.message || "Proof pending or failed");
			},
		});
	};

	return (
		<>
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
						{isProofLoading ? (
							<p className="text-sm text-[#9B9B9B]">Checking...</p>
						) : proof ? (
							<ZkProofBadge status={proof.proofStatus} />
						) : (
							<p className="text-sm text-[#9B9B9B]">Not available</p>
						)}
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

					<div className="flex items-center justify-between gap-4 pt-2">
						{proof?.proofStatus === "PENDING" || !proof ? (
							<button
								type="button"
								onClick={handleVerify}
								disabled={isVerifying}
								className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline disabled:opacity-60"
							>
								<ShieldCheck className="size-4" />
								{isVerifying ? "Verifying..." : "ZK Verify"}
							</button>
						) : (
							<span />
						)}

						<button
							type="button"
							onClick={() => setConfirmDelete(true)}
							className="text-sm font-semibold uppercase tracking-wide text-error hover:underline"
						>
							Delete
						</button>
					</div>
				</div>
			</Modal>

			<ConfirmModal
				open={confirmDelete}
				message="Are you sure you want to delete this record?"
				onConfirm={handleDelete}
				onCancel={() => setConfirmDelete(false)}
				isLoading={isDeleting}
			/>
		</>
	);
}
