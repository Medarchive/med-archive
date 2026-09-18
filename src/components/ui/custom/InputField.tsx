"use client";

import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputProps {
	name: string;
	label?: string;
	type?: string;
	placeholder?: string;
	value: string | number | undefined;
	readonly?: boolean;
	error?: string | null;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	min?: number;
	max?: number;
	autoComplete?: string;
	disabled?: boolean;
	description?: string;
	className?: string;
}

const InputField: React.FC<InputProps> = ({
	placeholder,
	disabled,
	name,
	readonly,
	label,
	type = "text",
	value,
	onChange,
	onBlur,
	error,
	min,
	max,
	description,
	className = "",
}) => {
	const [view, setView] = useState(false);

	const handleView = () => {
		setView((prev) => !prev);
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={name} className="text-sm font-medium">
				{label}
			</Label>

			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}

			<div className="relative">
				<Input
					id={name}
					name={name}
					type={type === "password" && view ? "text" : type}
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					readOnly={readonly}
					min={min}
					max={max}
					className={`shadow-none focus outline-none focus:border-primary border-[#F5F5F5] rounded-[6px] bg-white text-base font-medium placeholder:font-normal placeholder:text-sm placeholder:text-[#9B9B9B] h-10.75 focus:shadow-sm caret-primary md:h-12 sm:text-base sm:py-4 duration-200
            ${className}
            ${
							error
								? "border-error text-error focus-visible:ring-error-400"
								: ""
						}
            ${
							readonly
								? "bg-neutral-600 text-black font-semibold cursor-not-allowed"
								: ""
						}
          `}
				/>

				{type === "password" && (
					<button
						type="button"
						onClick={handleView}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xl transition-colors"
						tabIndex={-1}
					>
						{view ? <IoEyeOff /> : <IoEye />}
					</button>
				)}
			</div>

			{/* {error && <p className="text-xs text-red-600">{error}</p>} */}
		</div>
	);
};

export default InputField;
