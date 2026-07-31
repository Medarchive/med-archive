"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import EmptyState from "../../../components/shared/EmptyState";
import UploadRecordForm from "../../onboarding/components/UploadRecordForm";
import { AnyRecord, initialRecords } from "../types";
import RecordsTabsTable from "./RecordsTabsTable";
import RecordDetailModal from "./RecordDetailModal";

type View = "browse" | "upload";

export default function RecordsPage() {
	const [records, setRecords] = useState<AnyRecord[]>(initialRecords);
	const [view, setView] = useState<View>("browse");
	const [selectedRecord, setSelectedRecord] = useState<AnyRecord | null>(null);

	const handleSave = (updated: AnyRecord) => {
		setRecords((prev) =>
			prev.map((record) => (record.id === updated.id ? updated : record)),
		);
		setSelectedRecord(updated);
	};

	const handleDelete = (id: string) => {
		setRecords((prev) => prev.filter((record) => record.id !== id));
	};

	const handleVerify = (id: string) => {
		setRecords((prev) =>
			prev.map((record) =>
				record.type === "lab_report" && record.id === id
					? { ...record, zkProof: "verified" }
					: record,
			),
		);
		setSelectedRecord((prev) =>
			prev && prev.type === "lab_report" && prev.id === id
				? { ...prev, zkProof: "verified" }
				: prev,
		);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-bold sm:text-3xl">Records</h1>

				<Button size="sm" onClick={() => setView(view === "upload" ? "browse" : "upload")}>
					{view === "upload" ? (
						<>
							<X className="size-4" />
							Cancel
						</>
					) : (
						<>
							<Plus className="size-4" />
							Upload Record
						</>
					)}
				</Button>
			</div>

			{view === "upload" ? (
				<UploadRecordForm onSuccess={() => setView("browse")} />
			) : records.length === 0 ? (
				<EmptyState message="There's nothing yet, upload a new record" />
			) : (
				<RecordsTabsTable records={records} onRowClick={setSelectedRecord} />
			)}

			<RecordDetailModal
				record={selectedRecord}
				onClose={() => setSelectedRecord(null)}
				onSave={handleSave}
				onDelete={handleDelete}
				onVerify={handleVerify}
			/>
		</div>
	);
}
