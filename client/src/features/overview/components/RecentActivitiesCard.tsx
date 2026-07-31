import Link from "next/link";
import { pageRoutes } from "../../../lib/config/routes";

const activities = [
	{ label: "Blood Test Uploaded", date: "Today, 10:00AM" },
	{ label: "Doctor Access Approved", date: "Today, 10:00AM" },
	{ label: "Prescription Added", date: "Today, 10:00AM" },
	{ label: "Blood Test Uploaded", date: "Today, 10:00AM" },
	{ label: "Prescription Added", date: "Today, 10:00AM" },
	{ label: "Doctor Access Approved", date: "Monday, 10:00AM" },
];

export default function RecentActivitiesCard() {
	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Recent Activities</h3>

			<div className="mt-4 flex items-center justify-between text-xs text-[#9B9B9B]">
				<span>Activity Done</span>
				<span>Date</span>
			</div>

			<div className="flex-1 divide-y divide-[#F5F5F5]">
				{activities.map((activity, index) => (
					<div key={index} className="flex items-center gap-3 py-3">
						<span className="h-8 w-1.5 shrink-0 rounded-full bg-[#FFE1D0]" />

						<span className="flex-1 text-sm font-medium">{activity.label}</span>

						<span className="text-sm text-[#9B9B9B]">{activity.date}</span>
					</div>
				))}
			</div>

			<Link
				href={pageRoutes.dashboardRoutes.MEDICAL_TIMELINE}
				className="mt-4 self-end text-sm font-semibold text-primary hover:underline"
			>
				See all
			</Link>
		</div>
	);
}
