"use client";
import Link from "next/link";
import Logo from "../../../components/ui/custom/Logo";
import { usePathname } from "next/navigation";
import { pageRoutes } from "../../../lib/config/routes";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	const hideLogoRoutes = [
		pageRoutes.authRoutes.SIGN_IN,
		pageRoutes.authRoutes.SIGN_UP,
	];
	// console.log(pathname);

	return (
		<div>
			<div className="custom-container min-h-screen relative">
				<header className="fixed inset-x-0 bg-white z-50">
					{!hideLogoRoutes.includes(pathname) && (
						<div className="custom-container py-4 md:py-6">
							<Logo />
						</div>
					)}
				</header>
				<div className="max-sm:pt-22 sm:pt-16">
					{children}
					{hideLogoRoutes.includes(pathname) && (
						<Link className="block absolute mt-auto bottom-4" href="#">
							Privacy | Terms
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
