"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import {
	LayoutGrid,
	IdCard,
	ShieldCheck,
	Share2,
	History,
	Wallet,
} from "lucide-react";
import Logo from "../ui/custom/Logo";
import { useHeaderStore } from "@/lib/stores/header-store";
import { pageRoutes } from "@/lib/config/routes";

const navItems = [
	{ label: "Dashboard", href: pageRoutes.dashboardRoutes.DASHBOARD, icon: LayoutGrid },
	{ label: "Care ID", href: pageRoutes.dashboardRoutes.CARE_ID, icon: IdCard },
	{
		label: "Upload Record",
		href: pageRoutes.dashboardRoutes.UPLOAD_RECORD,
		icon: ShieldCheck,
	},
	{
		label: "Provider Request",
		href: pageRoutes.dashboardRoutes.PROVIDER_REQUEST,
		icon: Share2,
	},
	{
		label: "Medical Timeline",
		href: pageRoutes.dashboardRoutes.MEDICAL_TIMELINE,
		icon: History,
	},
	{ label: "Wallet", href: pageRoutes.dashboardRoutes.WALLET, icon: Wallet },
];

export default function Sidebar() {
	const pathname = usePathname();
	const { isOpen, closeMenu } = useHeaderStore();

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
			</aside>
		</>
	);
}
