"use client";

import { useMemo, useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import { AnyRecord, RecordType, recordTypeConfig } from "../types";
import ZkProofBadge from "./ZkProofBadge";

interface RecordsTabsTableProps {
	records: AnyRecord[];
	onRowClick: (record: AnyRecord) => void;
}

const tabOrder: RecordType[] = ["lab_report", "allergies", "medication", "prescription"];
const PAGE_SIZE = 8;

// lab_report is the only type whose column config excludes "date" (it needs
// the ZK Proof column inserted before it), so only it needs this trailing column.
const needsTrailingDate = (type: RecordType) => type === "lab_report";

export default function RecordsTabsTable({
	records,
	onRowClick,
}: RecordsTabsTableProps) {
	const [activeTab, setActiveTab] = useState<RecordType>("lab_report");
	const [currentPage, setCurrentPage] = useState(1);

	const filteredRecords = useMemo(
		() => records.filter((record) => record.type === activeTab),
		[records, activeTab],
	);

	const totalPages = Math.max(1, Math.ceil(filteredRecords.length / PAGE_SIZE));
	const visibleRecords = filteredRecords.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);
	const columns = recordTypeConfig[activeTab].columns;
	const extraColumnCount =
		(activeTab === "lab_report" ? 1 : 0) + (needsTrailingDate(activeTab) ? 1 : 0);

	const handleTabChange = (tab: RecordType) => {
		setActiveTab(tab);
		setCurrentPage(1);
	};

	return (
		<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex flex-wrap gap-2">
				{tabOrder.map((tab) => (
					<button
						key={tab}
						type="button"
						onClick={() => handleTabChange(tab)}
						className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium duration-150
              ${
								activeTab === tab
									? "border-black bg-black text-white"
									: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
							}
            `}
					>
						{recordTypeConfig[tab].tabLabel}
					</button>
				))}
			</div>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-135 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							{columns.map((column) => (
								<th key={column.key} className="pb-3 font-normal">
									{column.label}
								</th>
							))}

							{activeTab === "lab_report" && (
								<th className="pb-3 font-normal">ZK Proof</th>
							)}

							{needsTrailingDate(activeTab) && (
								<th className="pb-3 font-normal">Date</th>
							)}
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{visibleRecords.length === 0 && (
							<tr>
								<td
									colSpan={columns.length + extraColumnCount}
									className="py-6 text-center text-[#9B9B9B]"
								>
									No records yet
								</td>
							</tr>
						)}

						{visibleRecords.map((record) => {
							const fields = record as unknown as Record<string, string>;

							return (
								<tr
									key={record.id}
									onClick={() => onRowClick(record)}
									className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
								>
									{columns.map((column, index) => (
										<td
											key={column.key}
											className={`py-3 ${index === 0 ? "font-medium" : "text-[#9B9B9B]"}`}
										>
											{fields[column.key]}
										</td>
									))}

									{record.type === "lab_report" && (
										<td className="py-3">
											<ZkProofBadge status={record.zkProof} />
										</td>
									)}

									{needsTrailingDate(record.type) && (
										<td className="py-3 text-[#9B9B9B]">{fields.date}</td>
									)}
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
