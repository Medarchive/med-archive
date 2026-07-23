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
	console.log(pathname);

	return (
		<div>
			<div className="custom-container min-h-screen relative">
				<header className="fixed inset-x-0 bg-white">
					{!hideLogoRoutes.includes(pathname) && (
						<div className="custom-container py-4 md:py-6">
							<Logo />
						</div>
					)}
				</header>
				{children}
				<Link className="block absolute mt-auto bottom-4" href="#">
					Privacy | Terms
				</Link>
			</div>
		</div>
	);
}
