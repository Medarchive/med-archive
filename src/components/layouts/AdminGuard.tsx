"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useCurrentUser } from "../../features/users/hooks";
import { pageRoutes } from "../../lib/config/routes";
import { useHasMounted } from "../../hooks/useHasMounted";
import Skeleton from "../ui/custom/Skeleton";

// Client-side only — a UX nicety (redirect away, don't flash the admin nav
// at a non-admin), not the real security boundary. That's the backend's
// per-endpoint ADMIN-role check, already enforced there (403 otherwise);
// this guard has no way to stop someone from hitting the API directly.
export default function AdminGuard({ children }: { children: React.ReactNode }) {
	const hasMounted = useHasMounted();
	const router = useRouter();
	const { data: user, isLoading, isError } = useCurrentUser();

	const checked = hasMounted && !isLoading;
	const isAdmin = user?.role === "ADMIN";

	useEffect(() => {
		if (!checked) return;

		if (isError || !user) {
			router.replace(pageRoutes.authRoutes.SIGN_IN);
		} else if (!isAdmin) {
			router.replace(pageRoutes.dashboardRoutes.DASHBOARD);
		}
	}, [checked, isError, user, isAdmin, router]);

	if (!checked || !isAdmin) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
				<Skeleton className="h-10 w-40 rounded-[8px]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#FAFAFA] lg:pl-64">
			<AdminSidebar />

			{/* min-w-0 matters here — without it, a flex child (this column)
			    refuses to shrink below its content's natural width, so a wide
			    table further down forces the whole page to compress instead of
			    just scrolling horizontally inside its own overflow-x-auto. */}
			<div className="flex min-h-screen min-w-0 flex-col">
				<AdminHeader />
				<main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
