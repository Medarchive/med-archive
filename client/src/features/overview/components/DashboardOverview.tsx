"use client";

import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";
import CareIdCard from "./CareIdCard";
import StatCard from "./StatCard";
import WalletBalanceCard from "./WalletBalanceCard";
import HealthOverviewCard from "./HealthOverviewCard";
import RecentActivitiesCard from "./RecentActivitiesCard";
import AccessRequestsCard from "./AccessRequestsCard";
import EmergencyContactCard from "./EmergencyContactCard";

interface DashboardOverviewProps {
	firstName: string;
}

const getGreeting = () => {
	const hour = new Date().getHours();

	if (hour < 12) return "Good Morning";
	if (hour < 17) return "Good Afternoon";
	return "Good Evening";
};

export default function DashboardOverview({
	firstName,
}: DashboardOverviewProps) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">
						{getGreeting()} {firstName}
					</h1>

					<p className="text-[#9B9B9B]">
						Your health records are secure and under your control.
					</p>
				</div>

				<Button href={pageRoutes.dashboardRoutes.RECORDS}>
					<Plus className="size-4" />
					Upload Record
				</Button>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
				<CareIdCard careId="MA-002394" status="Verified" />
				<StatCard label="Records" value={20} />
				<StatCard label="Providers" value={20} />
				<WalletBalanceCard balance="$200,000" address="GDXT...6WGG" />

				<div className="md:col-span-2 xl:col-span-1">
					<HealthOverviewCard />
				</div>

				<div className="md:col-span-2 lg:col-span-2">
					<RecentActivitiesCard />
				</div>

				<div className="flex  max-sm:flex-col xl:flex-col gap-4 md:col-span-2 xl:col-span-1">
					<AccessRequestsCard />

					<EmergencyContactCard
						name="Ovie James"
						relationship="Brother"
						contactNumber="+01090123218"
					/>
				</div>
			</div>
		</div>
	);
}
