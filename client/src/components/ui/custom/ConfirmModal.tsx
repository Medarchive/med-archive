"use client";

import Modal from "./Modal";
import { Button } from "../button";

interface ConfirmModalProps {
	open: boolean;
	message: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export default function ConfirmModal({
	open,
	message,
	onConfirm,
	onCancel,
}: ConfirmModalProps) {
	return (
		<Modal open={open} onClose={onCancel} className="max-w-sm">
			<div className="space-y-4 text-center">
				<p className="font-medium">{message}</p>

				<div className="flex justify-center gap-3">
					<Button variant="destructive" onClick={onConfirm}>
						Yes
					</Button>

					<Button variant="outline" onClick={onCancel}>
						No
					</Button>
				</div>
			</div>
		</Modal>
	);
}
