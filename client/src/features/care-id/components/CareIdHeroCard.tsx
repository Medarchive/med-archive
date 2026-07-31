"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, QrCode, Download, Share2 } from "lucide-react";

interface CareIdHeroCardProps {
	careId: string;
	status: string;
	walletAddress: string;
	createdDate: string;
}

export default function CareIdHeroCard({
	careId,
	status,
	walletAddress,
	createdDate,
}: CareIdHeroCardProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyId = async () => {
		await navigator.clipboard.writeText(careId);
		setCopied(true);
		toast.success("Care ID copied to clipboard");
		setTimeout(() => setCopied(false), 1500);
	};

	const handleShareLink = async () => {
		await navigator.clipboard.writeText(
			`${window.location.origin}/care-id/${careId}`,
		);
		toast.success("Secure link copied to clipboard");
	};

	const handleDownloadQr = () => {
		toast.success("QR code downloaded");
	};

	return (
		<div className="grid grid-cols-1 gap-8 rounded-xl bg-primary/10 p-5 md:grid-cols-2 xl:grid-cols-3 xl:items-center">
			{/* Left */}
			<div className="space-y-5">
				<div>
					<p className="text-sm text-[#4B4B4B]">Care ID</p>

					<div className="mt-2 flex flex-wrap items-center gap-3">
						<h2 className="break-all text-xl font-bold sm:text-2xl">
							{careId}
						</h2>

						<button
							type="button"
							onClick={handleCopyId}
							className="flex shrink-0 items-center gap-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium transition hover:bg-black/5"
						>
							{copied ? (
								<Check className="size-3.5" />
							) : (
								<Copy className="size-3.5" />
							)}
							Copy ID
						</button>
					</div>
				</div>

				<div>
					<p className="text-sm text-[#4B4B4B]">
						Status <span className="font-semibold text-black">{status}</span>
					</p>
				</div>
			</div>

			{/* Center */}
			<div className="flex flex-col items-center gap-4">
				<div className="flex size-28 items-center justify-center rounded-lg border border-black/10 bg-white">
					<QrCode className="size-16" />
				</div>

				<div className="flex flex-wrap justify-center gap-3">
					<button
						type="button"
						onClick={handleDownloadQr}
						className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-black/80"
					>
						<Download className="size-3.5" />
						Download QR
					</button>

					<button
						type="button"
						onClick={handleShareLink}
						className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/5"
					>
						<Share2 className="size-3.5" />
						Share Link
					</button>
				</div>
			</div>

			{/* Right */}
			<div className="space-y-5 xl:text-right">
				<div>
					<p className="text-sm text-[#4B4B4B]">Wallet Address</p>

					<p className="mt-1 break-all font-semibold">{walletAddress}</p>
				</div>

				<div>
					<p className="text-sm text-[#4B4B4B]">Created Date</p>

					<p className="mt-1 font-semibold">{createdDate}</p>
				</div>
			</div>
		</div>
	);
	// <div className="grid grid-cols-1 gap-6 rounded-[12px] bg-primary/10 p-6 sm:grid-cols-3 max-sm:justify-center">
	// 	<div className="place-self-center w-full max-sm:flex items-center justify-between gap-1">
	// 		<p className="text-sm text-[#4B4B4B]">Care ID</p>

	// 		<div className="max-sm:mt-2 flex items-center gap-2">
	// 			<p className="text-2xl font-bold whitespace-nowrap">{careId}</p>

	// 			<button
	// 				type="button"
	// 				onClick={handleCopyId}
	// 				className="flex items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs font-medium duration-150 hover:bg-black/5"
	// 			>
	// 				{copied ? (
	// 					<Check className="size-3.5" />
	// 				) : (
	// 					<Copy className="size-3.5" />
	// 				)}
	// 				Copy ID
	// 			</button>
	// 		</div>

	// 		<p className="max-sm:mt-6 text-sm text-[#4B4B4B]">
	// 			Status: <span className="font-semibold text-black">{status}</span>
	// 		</p>
	// 	</div>

	// 	<div className="flex flex-col items-start gap-3 place-self-center">
	// 		<div className="flex size-24 items-center justify-center rounded-[8px] border border-black/10 bg-white mx-auto">
	// 			<QrCode className="size-16" />
	// 		</div>

	// 		<button
	// 			type="button"
	// 			onClick={handleDownloadQr}
	// 			className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white duration-150 hover:bg-black/80"
	// 		>
	// 			<Download className="size-3.5" />
	// 			Download QR
	// 		</button>

	// 		<button
	// 			type="button"
	// 			onClick={handleShareLink}
	// 			className="flex items-center gap-1.5 text-sm font-medium text-[#4B4B4B] duration-150 hover:text-primary"
	// 		>
	// 			<Share2 className="size-3.5" />
	// 			Share Secure Link
	// 		</button>
	// 	</div>

	// 	<div className="place-self-center">
	// 		<p className="text-sm text-[#4B4B4B]">Wallet Address</p>
	// 		<p className="font-semibold">{walletAddress}</p>

	// 		<p className="mt-6 text-sm text-[#4B4B4B]">
	// 			Created Date:{" "}
	// 			<span className="font-semibold text-black">{createdDate}</span>
	// 		</p>
	// 	</div>
	// </div>
}
