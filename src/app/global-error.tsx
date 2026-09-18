"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
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
		<html lang="en">
			<body>
				<div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center font-sans">
					<p className="text-xl font-bold">Med Archive</p>

					<div className="space-y-1">
						<h1 className="text-3xl font-bold">Something went wrong</h1>

						<p className="text-[#9B9B9B]">
							A critical error occurred. Please try again.
						</p>
					</div>

					<button
						type="button"
						onClick={reset}
						className="rounded-[8px] bg-primary px-4 py-2.5 text-white cursor-pointer"
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
