"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import InputField from "../../../components/ui/custom/InputField";
import { Button } from "../../../components/ui/button";
import { getFreighterInstallUrl, isMobileDevice } from "../../../lib/utils/freighter";
import { useHasMounted } from "../../../hooks/useHasMounted";

interface ConnectWalletModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (label: string) => void;
	isLoading?: boolean;
	// The linked-but-unverified case reuses this same modal for "Verify" —
	// no label to collect there, just confirming the Freighter signature flow.
	mode: "connect" | "verify";
}

export default function ConnectWalletModal({
	open,
	onClose,
	onConfirm,
	isLoading,
	mode,
}: ConnectWalletModalProps) {
	const [label, setLabel] = useState("");
	const hasMounted = useHasMounted();
	// Gated on hasMounted — navigator isn't available during SSR, and
	// guessing wrong there would cause a hydration mismatch on real mobile
	// devices.
	const isMobile = hasMounted && isMobileDevice();

	const handleConfirm = () => {
		onConfirm(label.trim());
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={mode === "connect" ? "Connect Wallet" : "Verify Wallet"}
		>
			<div className="space-y-4">
				{isMobile && (
					<div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
						<TriangleAlert className="mt-0.5 size-4 shrink-0" />
						<p>
							Freighter&apos;s browser extension isn&apos;t available on
							mobile — this won&apos;t work from here. Get the{" "}
							<a
								href={getFreighterInstallUrl()}
								target="_blank"
								rel="noreferrer"
								className="font-semibold underline"
							>
								Freighter mobile app
							</a>
							, or open this page on a desktop browser with the extension
							installed.
						</p>
					</div>
				)}

				{mode === "connect" ? (
					<>
						<p className="text-sm text-[#9B9B9B]">
							This opens Freighter to select and authorize a Stellar address.
							You&apos;ll be asked to sign a one-time message afterward to
							prove you own it.
						</p>

						<InputField
							name="label"
							label="Wallet label (optional)"
							placeholder="e.g. My main wallet"
							type="text"
							value={label}
							onChange={(e) => setLabel(e.target.value)}
						/>
					</>
				) : (
					<p className="text-sm text-[#9B9B9B]">
						This opens Freighter again to sign a one-time message and
						confirm you own the linked address.
					</p>
				)}

				<Button
					className="w-full"
					isLoading={isLoading}
					disabled={isMobile}
					onClick={handleConfirm}
				>
					{isMobile
						? "Not available on mobile"
						: mode === "connect"
							? "Continue with Freighter"
							: "Verify with Freighter"}
				</Button>
			</div>
		</Modal>
	);
}
