"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import InputField from "../../../components/ui/custom/InputField";
import { Button } from "../../../components/ui/button";
import { STELLAR_NETWORK_LABEL } from "../../../lib/wallet/config";
import { useWalletAvailability } from "../../../lib/wallet/use-availability";

// Which wallet is used is the user's choice, made in Stellar Wallets Kit's
// own picker (lib/wallet/kit) — it lists exactly what's available on this
// device, so there's no hardcoded wallet list here to drift out of date.
//
// Freighter belongs in the mobile sentence even though its module is an
// extension: on a phone it's reached through WalletConnect instead, just not
// labelled "Freighter" in the picker.
const SUPPORTED_DESKTOP =
	"Works with Freighter, xBull, Lobstr, Hana, and mobile wallets over WalletConnect.";
const SUPPORTED_MOBILE =
	"On a phone, choose WalletConnect — that's how Freighter, Lobstr and other mobile wallets connect.";
const UNSUPPORTED_MOBILE =
	"Connecting your own wallet isn't available on mobile yet — open Med Archive on a desktop browser with a Stellar wallet extension, or create a wallet below.";

interface ConnectWalletModalProps {
	open: boolean;
	onClose: () => void;
	onConfirm: (label: string) => void;
	isLoading?: boolean;
	// Offered in connect mode only — someone with a linked-but-unverified
	// wallet already chose to bring their own.
	onCreateCustodial?: () => void;
	isCreatingCustodial?: boolean;
	// The linked-but-unverified case reuses this same modal for "Verify" —
	// no label to collect there, just re-running the signature flow.
	mode: "connect" | "verify";
}

export default function ConnectWalletModal({
	open,
	onClose,
	onConfirm,
	isLoading,
	onCreateCustodial,
	isCreatingCustodial,
	mode,
}: ConnectWalletModalProps) {
	const [label, setLabel] = useState("");
	const availability = useWalletAvailability();

	const stranded = availability.strandedOnMobile;
	const supportText = stranded
		? UNSUPPORTED_MOBILE
		: availability.isMobile
			? SUPPORTED_MOBILE
			: SUPPORTED_DESKTOP;

	const isBusy = isLoading || isCreatingCustodial;

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={mode === "connect" ? "Connect Wallet" : "Verify Wallet"}
		>
			<div className="space-y-4">
				{stranded && (
					<div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
						<TriangleAlert className="mt-0.5 size-4 shrink-0" />
						<p>{UNSUPPORTED_MOBILE}</p>
					</div>
				)}

				{mode === "connect" ? (
					<>
						<p className="text-sm text-[#9B9B9B]">
							Choose a wallet to authorize a Stellar address. You&apos;ll be
							asked to sign a one-time message afterward to prove you own it.
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
						This opens your wallet again to sign a one-time message and
						confirm you own the linked address.
					</p>
				)}

				<Button
					className="w-full"
					isLoading={isLoading}
					disabled={stranded || isBusy}
					onClick={() => onConfirm(label.trim())}
				>
					{isLoading ? "Check your wallet…" : "Choose a wallet"}
				</Button>

				{!stranded && <p className="text-xs text-[#9B9B9B]">{supportText}</p>}

				<p className="text-xs text-[#9B9B9B]">
					Only{" "}
					<span className="font-semibold">{STELLAR_NETWORK_LABEL}</span>{" "}
					wallets are accepted right now — make sure your wallet is set to
					that network before continuing.
				</p>

				{mode === "connect" && onCreateCustodial && (
					<div className="space-y-3 border-t border-[#F5F5F5] pt-4">
						<div>
							<p className="text-sm font-semibold">Don&apos;t have a wallet?</p>
							<p className="text-sm text-[#9B9B9B]">
								Med Archive can create one for you. It&apos;s ready to use
								straight away, and Med Archive keeps its key on your behalf.
							</p>
						</div>

						<Button
							variant="outline"
							className="w-full"
							isLoading={isCreatingCustodial}
							disabled={isBusy}
							onClick={onCreateCustodial}
						>
							Create a wallet for me
						</Button>
					</div>
				)}
			</div>
		</Modal>
	);
}
