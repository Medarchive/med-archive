"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FileText, Pencil, ShieldCheck } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import ConfirmModal from "../../../components/ui/custom/ConfirmModal";
import InputField from "../../../components/ui/custom/InputField";
import FileDropzone from "../../../components/ui/custom/FileDropzone";
import { Button } from "../../../components/ui/button";
import { AnyRecord, recordTypeConfig } from "../types";
import ZkProofBadge from "./ZkProofBadge";

interface RecordDetailModalProps {
	record: AnyRecord | null;
	onClose: () => void;
	onSave: (updated: AnyRecord) => void;
	onDelete: (id: string) => void;
	onVerify: (id: string) => void;
}

export default function RecordDetailModal({
	record,
	onClose,
	onSave,
	onDelete,
	onVerify,
}: RecordDetailModalProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState<Record<string, string>>({});
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [files, setFiles] = useState<File[]>([]);

	useEffect(() => {
		if (record) {
			setDraft({ ...(record as unknown as Record<string, string>) });
			setIsEditing(false);
			setFiles([]);
		}
	}, [record]);

	if (!record) return null;

	const columns = recordTypeConfig[record.type].columns;
	// lab_report is the only type whose columns exclude "date" (ZK Proof needs
	// to be inserted before it), so only it needs this separate date row.
	const hasDate = record.type === "lab_report";

	const handleSave = () => {
		onSave({ ...record, ...draft } as AnyRecord);
		setIsEditing(false);
		toast.success("Record updated successfully");
	};

	const handleDelete = () => {
		onDelete(record.id);
		setConfirmDelete(false);
		onClose();
		toast.success("Record deleted");
	};

	const handleVerify = () => {
		onVerify(record.id);
		toast.success("Record submitted for ZK verification");
	};

	return (
		<>
			<Modal open={!!record} onClose={onClose}>
				<div className="space-y-4">
					{columns.map((column) => (
						<div key={column.key} className="flex items-center justify-between gap-4">
							<p className="text-sm font-semibold">{column.label}</p>

							{isEditing ? (
								<InputField
									name={column.key}
									label=""
									value={draft[column.key] ?? ""}
									onChange={(e) =>
										setDraft((prev) => ({ ...prev, [column.key]: e.target.value }))
									}
									className="max-w-50"
								/>
							) : (
								<p className="text-sm text-[#9B9B9B]">
									{(record as unknown as Record<string, string>)[column.key]}
								</p>
							)}
						</div>
					))}

					{hasDate && (
						<div className="flex items-center justify-between gap-4">
							<p className="text-sm font-semibold">Date</p>

							{isEditing ? (
								<InputField
									name="date"
									label=""
									value={draft.date ?? ""}
									onChange={(e) =>
										setDraft((prev) => ({ ...prev, date: e.target.value }))
									}
									className="max-w-50"
								/>
							) : (
								<p className="text-sm text-[#9B9B9B]">
									{(record as unknown as Record<string, string>).date}
								</p>
							)}
						</div>
					)}

					{record.type === "lab_report" && (
						<>
							<div className="flex items-center justify-between gap-4">
								<p className="text-sm font-semibold">ZK Proof</p>
								<ZkProofBadge status={record.zkProof} />
							</div>

							{isEditing ? (
								<FileDropzone name="document" files={files} onChange={setFiles} />
							) : (
								<div className="flex items-center gap-3 rounded-[8px] border border-[#F5F5F5] p-3">
									<span className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-[#FAFAFA] text-[#9B9B9B]">
										<FileText className="size-5" />
									</span>
									<p className="text-sm text-[#9B9B9B]">Document.pdf</p>
								</div>
							)}
						</>
					)}

					<div className="flex items-center justify-between gap-4 pt-2">
						{isEditing ? (
							<span />
						) : (
							<button
								type="button"
								aria-label="Edit record"
								onClick={() => setIsEditing(true)}
								className="flex items-center gap-2 text-sm font-medium duration-150 hover:text-primary"
							>
								<Pencil className="size-4" />
							</button>
						)}

						{isEditing ? (
							<Button size="sm" onClick={handleSave}>
								Save
							</Button>
						) : record.type === "lab_report" ? (
							record.zkProof === "unverified" && (
								<button
									type="button"
									onClick={handleVerify}
									className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
								>
									<ShieldCheck className="size-4" />
									ZK Verify
								</button>
							)
						) : (
							<button
								type="button"
								onClick={() => setConfirmDelete(true)}
								className="text-sm font-semibold uppercase tracking-wide text-error hover:underline"
							>
								Delete
							</button>
						)}
					</div>
				</div>
			</Modal>

			<ConfirmModal
				open={confirmDelete}
				message="Are you sure you want to delete this record?"
				onConfirm={handleDelete}
				onCancel={() => setConfirmDelete(false)}
			/>
		</>
	);
}
