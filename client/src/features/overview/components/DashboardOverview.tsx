"use client";

import { Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";
import { useCurrentUser } from "../../users/hooks";
import { useCareId } from "../../care-id/hooks";
import { useHealthRecords } from "../../records/hooks";
import { useAccessRequests } from "../../provider-request/hooks";
import { useWallet } from "../../wallet/hooks";
import { useEmergencyContacts } from "../../emergency-contacts/hooks";
import CareIdCard from "./CareIdCard";
import StatCard from "./StatCard";
import WalletBalanceCard from "./WalletBalanceCard";
import HealthOverviewCard from "./HealthOverviewCard";
import RecentActivitiesCard from "./RecentActivitiesCard";
import AccessRequestsCard from "./AccessRequestsCard";
import EmergencyContactCard from "./EmergencyContactCard";
import DashboardOverviewSkeleton from "../../../components/shared/skeletons/DashboardOverviewSkeleton";
import { useHasMounted } from "../../../hooks/useHasMounted";

const getGreeting = () => {
	const hour = new Date().getHours();

	if (hour < 12) return "Good Morning";
	if (hour < 17) return "Good Afternoon";
	return "Good Evening";
};

export default function DashboardOverview() {
	const hasMounted = useHasMounted();
	const { data: user, isLoading: isUserLoading } = useCurrentUser();
	const { data: careId } = useCareId();
	const { data: records } = useHealthRecords({ take: 1 });
	// Count of approved access grants as a proxy for "providers with access" —
	// there's no dedicated providers-count endpoint.
	const { data: approvedRequests } = useAccessRequests({
		status: "APPROVED",
		take: 1,
	});
	const { data: wallet } = useWallet();
	const { data: emergencyContacts } = useEmergencyContacts();

	const emergencyContact = emergencyContacts?.[0];

	if (!hasMounted || isUserLoading) {
		return <DashboardOverviewSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl">
						{getGreeting()} {user?.fullName?.split(" ")[0] ?? ""}
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
				<CareIdCard
					careId={careId?.careId ?? "—"}
					status={careId?.status ?? "Not generated"}
				/>
				<StatCard label="Records" value={records?.meta.totalCount ?? 0} />
				<StatCard
					label="Providers"
					value={approvedRequests?.meta.totalCount ?? 0}
				/>
				<WalletBalanceCard
					balance={wallet?.balance ?? null}
					address={wallet?.address ?? ""}
				/>

				<div className="md:col-span-2 xl:col-span-1">
					<HealthOverviewCard />
				</div>

				<div className="md:col-span-2 lg:col-span-2">
					<RecentActivitiesCard />
				</div>

				<div className="flex  max-sm:flex-col xl:flex-col gap-4 md:col-span-2 xl:col-span-1">
					<AccessRequestsCard />

					{emergencyContact ? (
						<EmergencyContactCard
							name={`${emergencyContact.firstName} ${emergencyContact.lastName}`}
							relationship={emergencyContact.relationship}
							contactNumber={emergencyContact.contactNumber}
						/>
					) : (
						<EmergencyContactCard
							name="Not set"
							relationship="—"
							contactNumber="—"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
