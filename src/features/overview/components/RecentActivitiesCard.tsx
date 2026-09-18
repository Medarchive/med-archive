import Link from "next/link";
import { pageRoutes } from "../../../lib/config/routes";
import { useHealthRecords } from "../../records/hooks";

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function RecentActivitiesCard() {
	const { data, isLoading } = useHealthRecords({
		take: 6,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const records = data?.data ?? [];

	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Recent Activities</h3>

			<div className="mt-4 flex items-center justify-between text-xs text-[#9B9B9B]">
				<span>Record</span>
				<span>Date</span>
			</div>

			<div className="flex-1 divide-y divide-[#F5F5F5]">
				{isLoading && (
					<p className="py-3 text-sm text-[#9B9B9B]">Loading...</p>
				)}

				{!isLoading && records.length === 0 && (
					<p className="py-3 text-sm text-[#9B9B9B]">No records yet</p>
				)}

				{records.map((record) => (
					<div key={record.id} className="flex items-center gap-3 py-3">
						<span className="h-8 w-1.5 shrink-0 rounded-full bg-[#FFE1D0]" />

						<span className="flex-1 truncate text-sm font-medium">
							{record.title}
						</span>

						<span className="text-sm text-[#9B9B9B]">
							{formatDate(record.recordDate ?? record.createdAt)}
						</span>
					</div>
				))}
			</div>

			<Link
				href={pageRoutes.dashboardRoutes.RECORDS}
				className="mt-4 self-end text-sm font-semibold text-primary hover:underline"
			>
				See all
			</Link>
		</div>
	);
}
