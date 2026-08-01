"use client";

import Modal from "./Modal";
import { Button } from "../button";

interface ConfirmModalProps {
	open: boolean;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export default function ConfirmModal({
	open,
	message,
	onConfirm,
	onCancel,
	isLoading,
}: ConfirmModalProps) {
	return (
		<Modal open={open} onClose={onCancel} className="max-w-sm">
			<div className="space-y-4 text-center">
				<p className="font-medium">{message}</p>

				<div className="flex justify-center gap-3">
					<Button
						variant="destructive"
						onClick={onConfirm}
						isLoading={isLoading}
					>
						Yes
					</Button>

					<Button variant="outline" onClick={onCancel} disabled={isLoading}>
						No
					</Button>
				</div>
			</div>
		</Modal>
	);
}
