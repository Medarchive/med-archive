"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import Logo from "../components/ui/custom/Logo";
import { Button } from "../components/ui/button";
import { pageRoutes } from "../lib/config/routes";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
			<Logo />

			<span className="flex size-16 items-center justify-center rounded-full bg-error/10 text-error">
				<TriangleAlert className="size-8" />
			</span>

			<div className="space-y-1">
				<h1 className="text-3xl font-bold">Something went wrong</h1>

				<p className="text-[#9B9B9B]">
					An unexpected error occurred. Please try again.
				</p>
			</div>

			<div className="flex gap-3">
				<Button onClick={reset}>Try again</Button>
				<Button href={pageRoutes.HOME} variant="outline">
					Back to Home
				</Button>
			</div>
		</div>
	);
}
