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

			<div className="flex min-h-screen flex-col">
				<DashboardHeader />

				<main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
