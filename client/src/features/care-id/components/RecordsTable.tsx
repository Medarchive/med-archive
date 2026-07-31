"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";

type RecordTab = "lab_report" | "allergies" | "medication" | "prescription";

const tabs: { label: string; value: RecordTab }[] = [
	{ label: "Lab Report", value: "lab_report" },
	{ label: "Allergies", value: "allergies" },
	{ label: "Medication", value: "medication" },
	{ label: "Prescription", value: "prescription" },
];

const tableConfig: Record<
	RecordTab,
	{ columns: [string, string, string]; rows: [string, string, string][] }
> = {
	lab_report: {
		columns: ["Test Name", "Referred by", "Date"],
		rows: [
			["Urinalysis (UA)", "Dr. Mike JP", "Today, 10:00AM"],
			["Mammogram", "Dr. Mike JP", "Today, 10:00AM"],
			["Pap Smear", "Dr. Mike JP", "Today, 10:00AM"],
			["Pap Smear", "Dr. Mike JP", "Today, 10:00AM"],
			["Colonoscopy", "Dr. Mike JP", "Today, 10:00AM"],
			["Mammogram", "Dr. Mike JP", "Today, 10:00AM"],
			["Mammogram", "Dr. Mike JP", "Today, 10:00AM"],
			["Mammogram", "Dr. Mike JP", "Today, 10:00AM"],
		],
	},
	allergies: {
		columns: ["Allergy", "Reported by", "Date"],
		rows: [
			["Penicillin", "Dr. Mike JP", "Today, 10:00AM"],
			["Peanuts", "Dr. Mike JP", "Today, 10:00AM"],
			["Shellfish", "Dr. Mike JP", "Today, 10:00AM"],
			["Latex", "Dr. Mike JP", "Today, 10:00AM"],
		],
	},
	medication: {
		columns: ["Medication", "Prescribed by", "Date"],
		rows: [
			["Ibuprofen (Advil) BID", "Dr. Mike JP", "Today, 10:00AM"],
			["Amoxicillin", "Dr. Mike JP", "Today, 10:00AM"],
			["Metformin", "Dr. Mike JP", "Today, 10:00AM"],
			["Lisinopril", "Dr. Mike JP", "Today, 10:00AM"],
		],
	},
	prescription: {
		columns: ["Drug Class", "Prescribed by", "Date"],
		rows: [
			["Analgesics", "Dr. Mike JP", "Today, 10:00AM"],
			["Antibiotics", "Dr. Mike JP", "Today, 10:00AM"],
			["Antihypertensives", "Dr. Mike JP", "Today, 10:00AM"],
			["Antihistamines", "Dr. Mike JP", "Today, 10:00AM"],
			["Antipyretics", "Dr. Mike JP", "Today, 10:00AM"],
			["Statins", "Dr. Mike JP", "Today, 10:00AM"],
			["Anticoagulants", "Dr. Mike JP", "Today, 10:00AM"],
			["Anticoagulants", "Dr. Mike JP", "Today, 10:00AM"],
		],
	},
};

export default function RecordsTable() {
	const [activeTab, setActiveTab] = useState<RecordTab>("lab_report");
	const { columns, rows } = tableConfig[activeTab];

	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap gap-2">
					{tabs.map((tab) => (
						<button
							key={tab.value}
							type="button"
							onClick={() => setActiveTab(tab.value)}
							className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium duration-150
                ${
									activeTab === tab.value
										? "border-black bg-black text-white"
										: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
								}
              `}
						>
							{tab.label}
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
							<th className="pb-3 font-normal">{columns[0]}</th>
							<th className="pb-3 font-normal">{columns[1]}</th>
							<th className="pb-3 font-normal text-right">{columns[2]}</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-[#F5F5F5]">
						{rows.map((row, index) => (
							<tr key={index}>
								<td className="py-3 font-medium">{row[0]}</td>
								<td className="py-3 text-[#9B9B9B]">{row[1]}</td>
								<td className="py-3 text-right text-[#9B9B9B]">{row[2]}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
