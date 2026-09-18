"use client";

import { ChevronRight } from "lucide-react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className="flex items-center justify-end gap-1.5">
			{pages.map((page) => (
				<button
					key={page}
					type="button"
					onClick={() => onPageChange(page)}
					className={`flex size-8 items-center justify-center rounded-[6px] text-sm font-medium duration-150
            ${
							page === currentPage
								? "bg-[#F5F5F5] text-black"
								: "text-[#9B9B9B] hover:bg-[#FAFAFA]"
						}
          `}
				>
					{page}
				</button>
			))}

			<button
				type="button"
				onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
				disabled={currentPage === totalPages}
				className="flex size-8 items-center justify-center rounded-[6px] text-[#9B9B9B] duration-150 hover:bg-[#FAFAFA] disabled:pointer-events-none disabled:opacity-40"
			>
				<ChevronRight className="size-4" />
			</button>
		</div>
	);
}
