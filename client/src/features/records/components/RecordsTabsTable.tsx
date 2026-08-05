"use client";

import { useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import { useHealthRecords } from "../hooks";
import { HealthRecordData, recordTypeConfig, recordTypeOrder, RecordType } from "../types";

interface RecordsTabsTableProps {
	onRowClick: (record: HealthRecordData) => void;
}

type TabValue = "ALL" | RecordType;

const tabOrder: TabValue[] = ["ALL", ...recordTypeOrder];

const tabLabel = (tab: TabValue) =>
	tab === "ALL" ? "All" : recordTypeConfig[tab].tabLabel;

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function RecordsTabsTable({ onRowClick }: RecordsTabsTableProps) {
	const [activeTab, setActiveTab] = useState<TabValue>("ALL");
	const [currentPage, setCurrentPage] = useState(1);

	const { data, isLoading } = useHealthRecords({
		recordType: activeTab === "ALL" ? undefined : activeTab,
		page: currentPage,
		take: 8,
	});

	// Mixed types on the "All" tab don't share one primary field, so show
	// the record's type instead of a type-specific column there.
	const primaryField =
		activeTab === "ALL" ? undefined : recordTypeConfig[activeTab].primaryField;
	const records = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;
	const columnCount = activeTab === "ALL" ? 3 : primaryField ? 3 : 2;

	const handleTabChange = (tab: TabValue) => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex flex-wrap gap-2">
				{tabOrder.map((type) => (
					<button
						key={type}
						type="button"
						onClick={() => handleTabChange(type)}
						className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium duration-150
              ${
								activeTab === type
									? "border-black bg-black text-white"
									: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
							}
            `}
					>
						{tabLabel(type)}
					</button>
				))}
			</div>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-135 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Title</th>
							{activeTab === "ALL" && (
								<th className="pb-3 font-normal">Type</th>
							)}
							{primaryField && (
								<th className="pb-3 font-normal">{primaryField.label}</th>
							)}
							<th className="pb-3 font-normal">Date</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{isLoading && (
							<tr>
								<td colSpan={columnCount} className="py-6 text-center text-[#9B9B9B]">
									Loading...
								</td>
							</tr>
						)}

						{!isLoading && records.length === 0 && (
							<tr>
								<td colSpan={columnCount} className="py-6 text-center text-[#9B9B9B]">
									No records yet
								</td>
							</tr>
						)}

						{records.map((record) => {
							const fields = record as unknown as Record<string, string>;

							return (
								<tr
									key={record.id}
									onClick={() => onRowClick(record)}
									className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
								>
									<td className="py-3 font-medium">{record.title}</td>

									{activeTab === "ALL" && (
										<td className="py-3 text-[#9B9B9B]">
											{recordTypeConfig[record.recordType].tabLabel}
										</td>
									)}

									{primaryField && (
										<td className="py-3 text-[#9B9B9B]">
											{fields[primaryField.key] ?? "—"}
										</td>
									)}

									<td className="py-3 text-[#9B9B9B]">
										{formatDate(record.recordDate ?? record.createdAt)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="mt-4">
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</div>
		</div>
	);
}
