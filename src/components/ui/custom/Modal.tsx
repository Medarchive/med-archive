"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	className?: string;
}

export default function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
	useEffect(() => {
		if (!open) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
			onClick={onClose}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className={`w-full max-w-md rounded-[12px] bg-white p-6 ${className}`}
			>
				<div className="flex items-center justify-between">
					{title ? <h3 className="font-semibold">{title}</h3> : <span />}

					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="text-black duration-150 hover:text-[#9B9B9B]"
					>
						<X className="size-5" />
					</button>
				</div>

				<div className="mt-4 border-t border-[#F5F5F5] pt-4">{children}</div>
			</div>
		</div>
	);
}
