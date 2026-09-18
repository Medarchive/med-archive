"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CareIdCardProps {
	careId: string;
	status: string;
}

export default function CareIdCard({ careId, status }: CareIdCardProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(careId);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="flex flex-col justify-between rounded-[12px] bg-[linear-gradient(180deg,#00803A_0%,#074221_100%)] p-5 text-white">
			<p className="text-sm text-white/80">Care ID Status</p>

			<div className="mt-4 flex items-center gap-2">
				<p className="text-2xl font-bold">{careId}</p>

				<button
					type="button"
					onClick={handleCopy}
					className="text-white/80 duration-150 hover:text-white"
					aria-label="Copy Care ID"
				>
					{copied ? (
						<Check className="size-4.5" />
					) : (
						<Copy className="size-4.5" />
					)}
				</button>
			</div>

			<p className="mt-6 text-sm text-white/80">
				Status: <span className="font-semibold text-white">{status}</span>
			</p>
		</div>
	);
}
