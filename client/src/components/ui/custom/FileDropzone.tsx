"use client";

import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

interface FileDropzoneProps {
	name: string;
	files: File[];
	onChange: (files: File[]) => void;
	error?: string | null;
	accept?: string;
	maxFiles?: number;
}

// POST /api/v1/health-records accepts JPEG, PNG, WEBP, HEIC or PDF, up to
// 20MB each and 10 files per record — no video, despite what this
// component used to advertise.
const FileDropzone: React.FC<FileDropzoneProps> = ({
	name,
	files,
	onChange,
	error,
	accept = "image/jpeg,image/png,image/webp,image/heic,application/pdf",
	maxFiles = 10,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [limitMessage, setLimitMessage] = useState<string | null>(null);

	const handleFiles = (fileList: FileList | null) => {
		if (!fileList) return;

		const combined = [...files, ...Array.from(fileList)];

		if (combined.length > maxFiles) {
			setLimitMessage(`Only ${maxFiles} files allowed per record — extra files were dropped.`);
			onChange(combined.slice(0, maxFiles));
		} else {
			setLimitMessage(null);
			onChange(combined);
		}
	};

	return (
		<div className="space-y-2">
			<div
				role="button"
				tabIndex={0}
				onClick={() => inputRef.current?.click()}
				onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
				onDragOver={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={(e) => {
					e.preventDefault();
					setIsDragging(false);
					handleFiles(e.dataTransfer.files);
				}}
				className={`flex flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed cursor-pointer text-center px-6 py-10 duration-200 bg-[#FAFAFA]
          ${isDragging ? "border-primary bg-primary/5" : "border-[#E5E5E5]"}
          ${error ? "border-error" : ""}
        `}
			>
				<span className="flex items-center justify-center size-9 rounded-md bg-black text-white">
					<ImageIcon className="size-4.5" />
				</span>

				<p className="font-semibold text-sm">Upload your media</p>

				<p className="text-sm text-[#9B9B9B]">
					Select multiple files in your file picker with Shift or Cmd/Ctrl
				</p>

				<p className="text-xs text-[#9B9B9B]">
					JPEG, PNG, WEBP, HEIC or PDF &middot; up to 20MB each &middot; max{" "}
					{maxFiles} files
				</p>

				<input
					ref={inputRef}
					id={name}
					name={name}
					type="file"
					multiple
					accept={accept}
					onChange={(e) => handleFiles(e.target.files)}
					className="hidden"
				/>
			</div>

			{limitMessage && (
				<p className="text-xs text-error text-center">{limitMessage}</p>
			)}

			{files.length > 0 && (
				<ul className="space-y-1 text-sm">
					{files.map((file, index) => (
						<li
							key={`${file.name}-${index}`}
							className="flex items-center justify-between gap-2 rounded-[6px] border border-[#F5F5F5] px-3 py-2"
						>
							<span className="truncate">{file.name}</span>

							<button
								type="button"
								onClick={() => {
									setLimitMessage(null);
									onChange(files.filter((_, i) => i !== index));
								}}
								className="text-[#9B9B9B] hover:text-error shrink-0"
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default FileDropzone;
