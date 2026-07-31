"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";

export default function DashboardError({
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
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-[12px] border border-dashed border-[#E5E5E5] px-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-full bg-error/10 text-error">
				<TriangleAlert className="size-7" />
			</span>

			<div className="space-y-1">
				<h2 className="text-xl font-semibold">Something went wrong</h2>
				<p className="text-[#9B9B9B]">This section couldn&apos;t be loaded.</p>
			</div>

			<Button onClick={reset}>Try again</Button>
		</div>
	);
}
