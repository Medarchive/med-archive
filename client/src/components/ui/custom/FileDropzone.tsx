"use client";

import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

interface FileDropzoneProps {
	name: string;
	files: File[];
	onChange: (files: File[]) => void;
	error?: string | null;
	accept?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
	name,
	files,
	onChange,
	error,
	accept = "image/jpeg,image/png,video/mp4",
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFiles = (fileList: FileList | null) => {
		if (!fileList) return;

		onChange([...files, ...Array.from(fileList)]);
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

			<p className="text-xs text-[#9B9B9B] text-center">
				JPG, PNG up to 20MB &middot; MP4 up to 200MB
			</p>

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
								onClick={() => onChange(files.filter((_, i) => i !== index))}
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
