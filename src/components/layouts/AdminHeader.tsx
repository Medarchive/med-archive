"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search, ShieldCheck } from "lucide-react";
import { useHeaderStore } from "@/lib/stores/header-store";
import { pageRoutes } from "@/lib/config/routes";
import NotificationsPanel from "../../features/notifications/components/NotificationsPanel";

// Which section the search box currently drives, and what it searches by —
// sections not listed here just don't use search, box still shows but does
// nothing when typed into (same as before this was wired up at all).
const SEARCH_PLACEHOLDERS: Record<string, string> = {
	[pageRoutes.adminRoutes.USERS]: "Search users by email",
	[pageRoutes.adminRoutes.ACTIVITY_LOGS]: "Filter activity by user ID",
};

export default function AdminHeader() {
	const { openMenu, searchQuery, setSearchQuery } = useHeaderStore();
	const pathname = usePathname();

	// A search left over from one section shouldn't silently keep filtering
	// an unrelated one after navigating away.
	useEffect(() => {
		setSearchQuery("");
	}, [pathname, setSearchQuery]);

	return (
		<header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[#F5F5F5] bg-white px-4 py-4 md:px-8">
			<button
				type="button"
				onClick={openMenu}
				className="text-gray-600 lg:hidden"
			>
				<Menu className="size-6" />
			</button>

			<div className="relative flex-1 max-w-xl">
				<Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#9B9B9B]" />

				<input
					type="search"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder={SEARCH_PLACEHOLDERS[pathname] ?? "Search"}
					className="w-full rounded-[8px] border border-[#F5F5F5] bg-white py-2.5 pl-11 pr-4 text-sm outline-none duration-200 focus:border-primary placeholder:text-[#9B9B9B]"
				/>
			</div>

			<div className="ml-auto flex items-center gap-2 sm:gap-3">
				<NotificationsPanel />

				<span className="flex size-10 items-center justify-center rounded-full border border-[#F5F5F5] text-primary">
					<ShieldCheck className="size-4.5" />
				</span>
			</div>
		</header>
	);
}
