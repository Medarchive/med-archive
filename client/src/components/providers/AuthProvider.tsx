"use client";

import { useEffect } from "react";
import { useAuthStore } from "../../lib/stores/userAuthStore";

// Hydrates the auth store from the token cookies on first client render.
export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);

	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);

	return <>{children}</>;
}
