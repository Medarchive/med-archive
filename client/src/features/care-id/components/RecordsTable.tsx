"use client";

import { useState } from "react";
import { Paperclip, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";
import { useHealthRecords } from "../../records/hooks";
import {
	recordTypeConfig,
	recordTypeOrder,
	RecordType,
} from "../../records/types";

type TabValue = "ALL" | RecordType;

const tabOrder: TabValue[] = ["ALL", ...recordTypeOrder];

const tabLabel = (tab: TabValue) =>
	tab === "ALL" ? "All" : recordTypeConfig[tab].tabLabel;

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString(undefined, {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
};

// A quick-glance card, not the full records browser (that's the Records
// page, linked via "Add new" below) — every tab, "All" included, is capped
// to the most recent handful rather than paginating through everything.
const LATEST_COUNT = 5;

export default function RecordsTable() {
	const [activeTab, setActiveTab] = useState<TabValue>("ALL");

	const { data, isLoading } = useHealthRecords({
		recordType: activeTab === "ALL" ? undefined : activeTab,
		take: LATEST_COUNT,
	});

	// Mixed types on the "All" tab don't share one primary field, so show
	// the record's type instead of a type-specific column there.
	const primaryField =
		activeTab === "ALL" ? undefined : recordTypeConfig[activeTab].primaryField;
	const records = data?.data ?? [];
	const columnCount = activeTab === "ALL" ? 3 : primaryField ? 3 : 2;

	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					{tabOrder.map((tab) => (
						<button
							key={tab}
							type="button"
							onClick={() => setActiveTab(tab)}
							className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium duration-150
                ${
									activeTab === tab
										? "border-black bg-black text-white"
										: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
								}
              `}
						>
							{tabLabel(tab)}
						</button>
					))}
				</div>

				<Button href={pageRoutes.dashboardRoutes.RECORDS} size="sm">
					<Plus className="size-4" />
					Add new
				</Button>
			</div>

			<div className="mt-4 overflow-x-auto">
				<table className="w-full min-w-105 text-sm">
					<thead>
						<tr className="text-left text-xs text-[#9B9B9B]">
							<th className="pb-3 font-normal">Title</th>
							{activeTab === "ALL" && (
								<th className="pb-3 font-normal">Type</th>
							)}
							{primaryField && (
								<th className="pb-3 font-normal">{primaryField.label}</th>
							)}
							<th className="pb-3 font-normal text-right">Date</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{isLoading && (
							<tr>
								<td
									colSpan={columnCount}
									className="py-6 text-center text-[#9B9B9B]"
								>
									Loading...
								</td>
							</tr>
						)}

						{!isLoading && records.length === 0 && (
							<tr>
								<td
									colSpan={columnCount}
									className="py-6 text-center text-[#9B9B9B]"
								>
									No records yet
								</td>
							</tr>
						)}

						{!isLoading &&
							records.map((record) => {
								const fields = record as unknown as Record<string, string>;

								return (
									<tr key={record.id}>
										<td className="py-3 font-medium">
											<span className="flex items-center gap-1.5">
												{record.title}
												{record.files.length > 0 && (
													<span
														title={`${record.files.length} attachment${record.files.length === 1 ? "" : "s"}`}
														className="flex items-center gap-0.5 text-xs font-normal text-[#9B9B9B]"
													>
														<Paperclip className="size-3" />
														{record.files.length}
													</span>
												)}
											</span>
										</td>

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

										<td className="py-3 text-right text-[#9B9B9B]">
											{formatDate(record.recordDate ?? record.createdAt)}
										</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
		</div>
	);
}
