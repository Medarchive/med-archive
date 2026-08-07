import React from "react";
import AdminGuard from "../../../components/layouts/AdminGuard";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <AdminGuard>{children}</AdminGuard>;
}
