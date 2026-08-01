"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import UploadRecordForm from "./UploadRecordForm";
import { HealthRecordData } from "../types";
import RecordsTabsTable from "./RecordsTabsTable";
import RecordDetailModal from "./RecordDetailModal";

type View = "browse" | "upload";

export default function RecordsPage() {
	const [view, setView] = useState<View>("browse");
	const [selectedRecord, setSelectedRecord] = useState<HealthRecordData | null>(
		null,
	);

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
			) : (
				<RecordsTabsTable onRowClick={setSelectedRecord} />
			)}

			<RecordDetailModal
				record={selectedRecord}
				onClose={() => setSelectedRecord(null)}
			/>
		</div>
	);
}
