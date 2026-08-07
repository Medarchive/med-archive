"use client";

import { useState } from "react";
import Modal from "../../../components/ui/custom/Modal";
import InputField from "../../../components/ui/custom/InputField";
import { Button } from "../../../components/ui/button";

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
					onClick={handleConfirm}
				>
					{mode === "connect" ? "Continue with Freighter" : "Verify with Freighter"}
				</Button>
			</div>
		</Modal>
	);
}
