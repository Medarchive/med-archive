"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, LogOut } from "lucide-react";
import { LayoutGrid, IdCard, Folder, Share2, Wallet } from "lucide-react";
import Logo from "../ui/custom/Logo";
import ConfirmModal from "../ui/custom/ConfirmModal";
import { useHeaderStore } from "@/lib/stores/header-store";
import { pageRoutes } from "@/lib/config/routes";

const navItems = [
	{ label: "Dashboard", href: pageRoutes.dashboardRoutes.DASHBOARD, icon: LayoutGrid },
	{ label: "Care ID", href: pageRoutes.dashboardRoutes.CARE_ID, icon: IdCard },
	{
		label: "Records",
		href: pageRoutes.dashboardRoutes.RECORDS,
		icon: Folder,
	},
	{
		label: "Provider Request",
		href: pageRoutes.dashboardRoutes.PROVIDER_REQUEST,
		icon: Share2,
	},
	// Medical Timeline is not ready yet — re-enable once the section is built.
	// {
	// 	label: "Medical Timeline",
	// 	href: pageRoutes.dashboardRoutes.MEDICAL_TIMELINE,
	// 	icon: History,
	// },
	{ label: "Wallet", href: pageRoutes.dashboardRoutes.WALLET, icon: Wallet },
];

export default function Sidebar() {
	const pathname = usePathname();
	const router = useRouter();
	const { isOpen, closeMenu } = useHeaderStore();
	const [confirmLogout, setConfirmLogout] = useState(false);

	const handleLogout = () => {
		setConfirmLogout(false);
		closeMenu();
		toast.success("Logged out successfully");
		router.push(pageRoutes.authRoutes.SIGN_IN);
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
					<Logo />

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
			/>
		</>
	);
}
