"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Loader2, TriangleAlert } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";
import { stellarExplorerTxUrl } from "../../../lib/wallet/payment";
import { useWallet } from "../../wallet/hooks";
import { PaymentVerificationError, usePayServiceOrder, useServiceOrder } from "../hooks";
import { ServiceOrderData } from "../types";
import { formatOrderAmount } from "../utils";
import ServiceOrderStatusBadge from "./ServiceOrderStatusBadge";

interface ServiceOrderDetailModalProps {
	orderId: string | null;
	role: "PATIENT" | "PROVIDER";
	onClose: () => void;
}

const formatDateTime = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const shortHash = (value: string) => `${value.slice(0, 8)}…${value.slice(-8)}`;

export default function ServiceOrderDetailModal({
	orderId,
	role,
	onClose,
}: ServiceOrderDetailModalProps) {
	return (
		<Modal open={!!orderId} onClose={onClose} title="Service Order">
			{orderId && <ServiceOrderDetail orderId={orderId} role={role} />}
		</Modal>
	);
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4">
			<p className="text-sm font-semibold">{label}</p>
			<div className="max-w-70 text-right text-sm text-[#9B9B9B]">{children}</div>
		</div>
	);
}

function ServiceOrderDetail({
	orderId,
	role,
}: {
	orderId: string;
	role: "PATIENT" | "PROVIDER";
}) {
	const { data: order, isLoading } = useServiceOrder(orderId);

	if (isLoading || !order) {
		return (
			<div className="flex justify-center py-10">
				<Loader2 className="size-5 animate-spin text-[#9B9B9B]" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Row label="Reference">
				<span className="font-mono">{order.reference}</span>
			</Row>

			<Row label="Description">{order.description}</Row>

			<Row label="Amount">
				<span className="font-semibold text-black">
					{formatOrderAmount(order.amount, order.assetCode)}
				</span>
			</Row>

			<Row label="Status">
				<ServiceOrderStatusBadge status={order.status} />
			</Row>

			<Row label="Created">{formatDateTime(order.createdAt)}</Row>

			{order.status === "PAID" && (
				<>
					<Row label="Paid">{formatDateTime(order.paidAt)}</Row>

					{order.txHash && (
						<Row label="Transaction">
							<a
								href={stellarExplorerTxUrl(order.txHash)}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1 font-mono text-primary hover:underline"
							>
								{shortHash(order.txHash)}
								<ExternalLink className="size-3" />
							</a>
						</Row>
					)}
				</>
			)}

			{order.status === "PENDING" && role === "PATIENT" && <PayOrder order={order} />}

			{order.status === "PENDING" && role === "PROVIDER" && (
				<p className="rounded-[8px] border border-[#F5F5F5] bg-[#FAFAFA] px-3 py-2 text-sm text-[#9B9B9B]">
					Waiting for the patient to pay. Payments go straight to your
					wallet
					{order.providerWalletAddress
						? ` (${order.providerWalletAddress.slice(0, 4)}…${order.providerWalletAddress.slice(-4)})`
						: ""}
					.
				</p>
			)}
		</div>
	);
}

function PayOrder({ order }: { order: ServiceOrderData }) {
	const { data: wallet, isLoading: isWalletLoading } = useWallet();
	const { mutate: pay, isPending } = usePayServiceOrder();
	// Set once a payment has reached the network but the backend couldn't
	// confirm it — retrying then only re-runs verification, so the patient
	// is never asked to pay twice.
	const [unconfirmedTxHash, setUnconfirmedTxHash] = useState<string | null>(null);

	if (isWalletLoading) return null;

	if (!wallet?.verifiedAt) {
		return (
			<div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
				<TriangleAlert className="mt-0.5 size-4 shrink-0" />
				<p>
					You need a verified wallet to pay.{" "}
					<Link
						href={pageRoutes.dashboardRoutes.WALLET}
						className="font-semibold underline"
					>
						Set up your wallet
					</Link>
				</p>
			</div>
		);
	}

	const handlePay = () => {
		pay(
			{ orderId: order.id, linkedAddress: wallet.address, txHash: unconfirmedTxHash ?? undefined },
			{
				onSuccess: () => setUnconfirmedTxHash(null),
				onError: (error) => {
					if (error instanceof PaymentVerificationError) {
						setUnconfirmedTxHash(error.txHash);
					}
				},
			},
		);
	};

	return (
		<div className="space-y-3 border-t border-[#F5F5F5] pt-4">
			{unconfirmedTxHash ? (
				<div className="space-y-1 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
					<p>
						Your payment was sent, but it hasn&apos;t been confirmed yet. Don&apos;t
						pay again — retry the confirmation below. It&apos;s also re-checked
						automatically every few minutes.
					</p>
					<a
						href={stellarExplorerTxUrl(unconfirmedTxHash)}
						target="_blank"
						rel="noreferrer"
						className="inline-flex items-center gap-1 font-mono text-xs underline"
					>
						{shortHash(unconfirmedTxHash)}
						<ExternalLink className="size-3" />
					</a>
				</div>
			) : (
				<p className="text-sm text-[#9B9B9B]">
					You&apos;ll approve this payment in your Stellar wallet. It&apos;s sent
					from your linked wallet ({wallet.address.slice(0, 4)}…
					{wallet.address.slice(-4)}) straight to the provider — Med Archive never
					holds the funds.
				</p>
			)}

			<Button className="w-full" isLoading={isPending} onClick={handlePay}>
				{unconfirmedTxHash
					? "Retry Confirmation"
					: `Pay ${formatOrderAmount(order.amount, order.assetCode)}`}
			</Button>
		</div>
	);
}
