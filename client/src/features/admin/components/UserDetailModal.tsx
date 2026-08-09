"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import Modal from "../../../components/ui/custom/Modal";
import { AdminUserSummary } from "../types";

interface UserDetailModalProps {
	user: AdminUserSummary | null;
	onClose: () => void;
}

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString();
};

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
	const [copied, setCopied] = useState(false);

	if (!user) return null;

	const handleCopyId = async () => {
		await navigator.clipboard.writeText(user.id);
		setCopied(true);
		toast.success("User ID copied to clipboard");
		setTimeout(() => setCopied(false), 1500);
	};

	const rows: { label: string; value: string }[] = [
		{ label: "Full Name", value: user.fullName },
		{ label: "Email", value: user.email },
		{ label: "Phone", value: user.phone ?? "—" },
		{ label: "Role", value: user.role },
		{ label: "Gender", value: user.gender ?? "—" },
		// Only meaningful for providers — null for patients/admins.
		...(user.role === "PROVIDER"
			? [{ label: "Provider Status", value: user.providerStatus ?? "—" }]
			: []),
		{ label: "Email Verified", value: formatDate(user.emailVerifiedAt) },
		{ label: "Joined", value: formatDate(user.createdAt) },
	];

	return (
		<Modal open={!!user} onClose={onClose} title="User Details">
			<div className="space-y-3">
				{/* Shown separately from the rest — this is what Wallets and
				    Activity Logs cross-reference by, so it's worth making easy
				    to grab in full rather than just truncated in a table row. */}
				<div className="flex items-center justify-between gap-4">
					<p className="text-sm font-semibold">User ID</p>

					<button
						type="button"
						onClick={handleCopyId}
						className="flex min-w-0 items-center gap-1.5 text-right text-sm text-[#9B9B9B] duration-150 hover:text-primary"
					>
						<span className="truncate">{user.id}</span>
						{copied ? (
							<Check className="size-3.5 shrink-0" />
						) : (
							<Copy className="size-3.5 shrink-0" />
						)}
					</button>
				</div>

				{rows.map((row) => (
					<div key={row.label} className="flex items-center justify-between gap-4">
						<p className="text-sm font-semibold">{row.label}</p>
						<p className="max-w-55 truncate text-right text-sm text-[#9B9B9B]">
							{row.value}
						</p>
					</div>
				))}
			</div>
		</Modal>
	);
}
