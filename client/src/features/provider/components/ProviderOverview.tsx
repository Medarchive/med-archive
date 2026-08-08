"use client";

import Link from "next/link";
import { TriangleAlert, Search, User, History } from "lucide-react";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import { pageRoutes } from "../../../lib/config/routes";
import { useProviderProfile } from "../hooks";
import { useHasMounted } from "../../../hooks/useHasMounted";

const quickLinks = [
	{ label: "Patient Lookup", href: pageRoutes.providerRoutes.PATIENTS, icon: Search },
	{ label: "Profile", href: pageRoutes.providerRoutes.PROFILE, icon: User },
	{ label: "Activity", href: pageRoutes.providerRoutes.ACTIVITY, icon: History },
];

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function ProviderOverview() {
	const hasMounted = useHasMounted();
	const { data: profile, isLoading } = useProviderProfile();

	if (!hasMounted || isLoading) {
		return <TableSkeleton rows={2} columns={4} />;
	}

	const displayName = [profile?.title, profile?.firstName, profile?.lastName]
		.filter(Boolean)
		.join(" ");

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">
				{displayName ? `Welcome, ${displayName}` : "Provider Overview"}
			</h1>

			{!profile?.verifiedAt && (
				<div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
					<TriangleAlert className="mt-0.5 size-4 shrink-0" />
					<p>
						Your account is pending admin verification. You can look up
						patients, but requesting access to their records isn&apos;t
						possible until an admin verifies your account.
					</p>
				</div>
			)}

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<p className="text-sm text-[#9B9B9B]">Organization</p>
					<p className="mt-2 text-lg font-semibold">
						{profile?.organizationName ?? "Not set"}
					</p>
				</div>

				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<p className="text-sm text-[#9B9B9B]">Specialty</p>
					<p className="mt-2 text-lg font-semibold">
						{profile?.specialty ?? "Not set"}
					</p>
				</div>

				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<p className="text-sm text-[#9B9B9B]">License Number</p>
					<p className="mt-2 text-lg font-semibold">
						{profile?.licenseNumber ?? "Not set"}
					</p>
				</div>

				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<p className="text-sm text-[#9B9B9B]">Verified</p>
					<p className="mt-2 text-lg font-semibold">
						{profile?.verifiedAt ? formatDate(profile.verifiedAt) : "Pending"}
					</p>
				</div>
			</div>

			<div>
				<h2 className="mb-3 font-semibold">Quick Links</h2>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
