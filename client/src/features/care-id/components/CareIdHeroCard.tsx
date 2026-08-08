"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check, Share2 } from "lucide-react";
import { useGenerateShareLink } from "../hooks";

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
	const { mutate: generateShareLink, isPending: isSharing } =
		useGenerateShareLink();

	const handleCopyId = async () => {
		await navigator.clipboard.writeText(careId);
		setCopied(true);
		toast.success("Care ID copied to clipboard");
		setTimeout(() => setCopied(false), 1500);
	};

	const handleShareLink = () => {
		generateShareLink(undefined, {
			onSuccess: async (data) => {
				const url = `${window.location.origin}/care-id/view/${data.data.token}`;
				await navigator.clipboard.writeText(url);
				toast.success("Secure link copied — expires in 24 hours");
			},
		});
	};

	// QR code display/download commented out — there's no real QR image
	// being generated anywhere (the icon was a placeholder and
	// "Download QR" never actually downloaded anything). Layout below is
	// redesigned to a 2-column split now that the center panel is gone;
	// Share Link (which does hit a real endpoint) moved into the left column.
	// const handleDownloadQr = () => {
	// 	toast.success("QR code downloaded");
	// };

	return (
		<div className="grid grid-cols-1 gap-8 rounded-xl bg-primary/10 p-5 md:grid-cols-2 md:items-center">
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

				<button
					type="button"
					onClick={handleShareLink}
					disabled={isSharing}
					className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium transition hover:bg-black/5 disabled:opacity-60"
				>
					<Share2 className="size-3.5" />
					{isSharing ? "Generating..." : "Share Link"}
				</button>

				{/* <div className="flex flex-col items-center gap-4">
					<div className="flex size-28 items-center justify-center rounded-lg border border-black/10 bg-white">
						<QrCode className="size-16" />
					</div>

					<button
						type="button"
						onClick={handleDownloadQr}
						className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white transition hover:bg-black/80"
					>
						<Download className="size-3.5" />
						Download QR
					</button>
				</div> */}
			</div>

			{/* Right */}
			<div className="space-y-5 md:text-right">
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
}
