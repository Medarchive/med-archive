"use client";
import Link from "next/link";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<div className="custom-container min-h-screen relative">
				{children}
				<Link className="block absolute mt-auto bottom-4" href="#">
					Privacy | Terms
				</Link>
			</div>
		</div>
	);
}
