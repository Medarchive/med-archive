import React from "react";
import Sidebar from "../../../components/layouts/Sidebar";
import DashboardHeader from "../../../components/layouts/DashboardHeader";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-[#FAFAFA] lg:pl-64">
			<Sidebar />

			{/* min-w-0 matters here — without it, a flex child (this column)
			    refuses to shrink below its content's natural width, so a wide
			    table further down forces the whole page to compress instead of
			    just scrolling horizontally inside its own overflow-x-auto. */}
			<div className="flex min-h-screen min-w-0 flex-col">
				<DashboardHeader />

				<main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
