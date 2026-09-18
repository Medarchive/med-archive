"use client";

import Link from "next/link";
import { Users, Mail, Share2, Wallet, History, Megaphone } from "lucide-react";
import StatCard from "../../overview/components/StatCard";
import AdminOverviewSkeleton from "../../../components/shared/skeletons/AdminOverviewSkeleton";
import { pageRoutes } from "../../../lib/config/routes";
import { useAdminStats } from "../hooks";
import { useHasMounted } from "../../../hooks/useHasMounted";

const quickLinks = [
	{ label: "Users", href: pageRoutes.adminRoutes.USERS, icon: Users },
	{ label: "Provider Invites", href: pageRoutes.adminRoutes.INVITES, icon: Mail },
	{
		label: "Access Requests",
		href: pageRoutes.adminRoutes.ACCESS_REQUESTS,
		icon: Share2,
	},
	{ label: "Wallets", href: pageRoutes.adminRoutes.WALLETS, icon: Wallet },
	{ label: "Activity Logs", href: pageRoutes.adminRoutes.ACTIVITY_LOGS, icon: History },
	{ label: "Broadcast", href: pageRoutes.adminRoutes.NOTIFICATIONS, icon: Megaphone },
];

export default function AdminOverview() {
	const hasMounted = useHasMounted();
	const { data: stats, isLoading } = useAdminStats();

	if (!hasMounted || isLoading) {
		return <AdminOverviewSkeleton />;
	}

	const totalUsers = stats
		? stats.users.patients + stats.users.providers + stats.users.admins
		: undefined;

	const tiles = [
		{ label: "Total Users", value: totalUsers ?? "—" },
		{ label: "Patients", value: stats?.users.patients ?? "—" },
		{ label: "Providers", value: stats?.users.providers ?? "—" },
		{ label: "Admins", value: stats?.users.admins ?? "—" },
		{
			label: "Pending Verifications",
			value: stats?.pendingProviderVerifications ?? "—",
		},
		{
			label: "Pending Access Requests",
			value: stats?.pendingAccessRequests ?? "—",
		},
		{ label: "Wallets Linked", value: stats?.wallets ?? "—" },
	];

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Admin Overview</h1>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{tiles.map((tile) => (
					<StatCard key={tile.label} label={tile.label} value={tile.value} />
				))}
			</div>

			<div>
				<h2 className="mb-3 font-semibold">Quick Links</h2>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
					{quickLinks.map((link) => {
						const Icon = link.icon;

						return (
							<Link
								key={link.href}
								href={link.href}
								className="flex flex-col items-center gap-2 rounded-[12px] border border-[#F5F5F5] bg-white p-4 text-center text-sm font-medium duration-150 hover:bg-[#FAFAFA]"
							>
								<span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
									<Icon className="size-4.5" />
								</span>
								{link.label}
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
