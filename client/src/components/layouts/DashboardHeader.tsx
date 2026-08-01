"use client";

import Link from "next/link";
import { Menu, Search, User, Wallet } from "lucide-react";
import { useHeaderStore } from "@/lib/stores/header-store";
import { pageRoutes } from "@/lib/config/routes";
import { useWallet } from "../../features/wallet/hooks";
import NotificationsPanel from "../../features/notifications/components/NotificationsPanel";

const truncateAddress = (address: string) =>
	address.length > 10 ? `${address.slice(0, 4)}...${address.slice(-4)}` : address;

export default function DashboardHeader() {
	const { openMenu } = useHeaderStore();
	const { data: wallet } = useWallet();

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
					placeholder="Search"
					className="w-full rounded-[8px] border border-[#F5F5F5] bg-white py-2.5 pl-11 pr-4 text-sm outline-none duration-200 focus:border-primary placeholder:text-[#9B9B9B]"
				/>
			</div>

			<div className="ml-auto flex items-center gap-2 sm:gap-3">
				{wallet && (
					<Link
						href={pageRoutes.dashboardRoutes.WALLET}
						className="hidden items-center gap-2 rounded-full border border-[#F5F5F5] px-3 py-2 text-sm font-medium duration-150 hover:bg-[#FAFAFA] sm:flex"
					>
						<Wallet className="size-4 text-primary" />
						{truncateAddress(wallet.address)}
					</Link>
				)}

				<NotificationsPanel />

				<Link
					href={pageRoutes.dashboardRoutes.PROFILE}
					className="flex size-10 items-center justify-center rounded-full border border-[#F5F5F5] text-gray-600 duration-150 hover:bg-[#FAFAFA]"
				>
					<User className="size-4.5" />
				</Link>
			</div>
		</header>
	);
}
