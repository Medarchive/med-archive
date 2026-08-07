"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LogOut } from "lucide-react";
import {
	LayoutGrid,
	Users,
	Mail,
	Share2,
	Wallet,
	History,
	Stethoscope,
	Megaphone,
} from "lucide-react";
import Logo from "../ui/custom/Logo";
import ConfirmModal from "../ui/custom/ConfirmModal";
import { useHeaderStore } from "@/lib/stores/header-store";
import { pageRoutes } from "@/lib/config/routes";
import { useLogoutMutation } from "../../features/auth/hooks";

const navItems = [
	{ label: "Overview", href: pageRoutes.adminRoutes.DASHBOARD, icon: LayoutGrid },
	{ label: "Users", href: pageRoutes.adminRoutes.USERS, icon: Users },
	{ label: "Provider Invites", href: pageRoutes.adminRoutes.INVITES, icon: Mail },
	{
		label: "Access Requests",
		href: pageRoutes.adminRoutes.ACCESS_REQUESTS,
		icon: Share2,
	},
	{ label: "Wallets", href: pageRoutes.adminRoutes.WALLETS, icon: Wallet },
	{
		label: "Activity Logs",
		href: pageRoutes.adminRoutes.ACTIVITY_LOGS,
		icon: History,
	},
	{
		label: "Medical Conditions",
		href: pageRoutes.adminRoutes.MEDICAL_CONDITIONS,
		icon: Stethoscope,
	},
	{
		label: "Broadcast",
		href: pageRoutes.adminRoutes.NOTIFICATIONS,
		icon: Megaphone,
	},
];

export default function AdminSidebar() {
	const pathname = usePathname();
	const { isOpen, closeMenu } = useHeaderStore();
	const [confirmLogout, setConfirmLogout] = useState(false);
	const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

	const handleLogout = () => {
		closeMenu();
		logout();
	};

	return (
		<>
			{isOpen && (
				<div
					onClick={closeMenu}
					className="fixed inset-0 z-40 bg-black/30 lg:hidden"
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white px-6 py-8 duration-300 lg:translate-x-0 lg:border-r lg:border-[#F5F5F5]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Logo />
						<span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
							Admin
						</span>
					</div>

					<button
						type="button"
						onClick={closeMenu}
						className="text-gray-500 lg:hidden"
					>
						<X className="size-5" />
					</button>
				</div>

				<nav className="mt-10 flex flex-1 flex-col gap-1">
					{navItems.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={closeMenu}
								className={`flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm duration-150
                  ${
										isActive
											? "bg-primary/10 font-semibold text-primary"
											: "text-black hover:bg-[#FAFAFA]"
									}
                `}
							>
								<Icon className="size-4.5" />
								{item.label}
							</Link>
						);
					})}
				</nav>

				<button
					type="button"
					onClick={() => setConfirmLogout(true)}
					className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm text-error duration-150 hover:bg-error/5"
				>
					<LogOut className="size-4.5" />
					Logout
				</button>
			</aside>

			<ConfirmModal
				open={confirmLogout}
				message="Are you sure you want to log out?"
				onConfirm={handleLogout}
				onCancel={() => setConfirmLogout(false)}
				isLoading={isLoggingOut}
			/>
		</>
	);
}
