import React from "react";
import ProviderGuard from "../../../components/layouts/ProviderGuard";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ProviderGuard>{children}</ProviderGuard>;
}
