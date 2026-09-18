"use client";

import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";

interface Option {
	label: string;
	value: string;
}

interface SelectFieldProps {
	name: string;
	label?: string;
	placeholder?: string;
	options: Option[];
	value: string | undefined;
	error?: string | null;
	disabled?: boolean;
	className?: string;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
	name,
	label,
	placeholder = "Select",
	options,
	value,
	error,
	disabled,
	className = "",
	onChange,
	onBlur,
}) => {
	return (
		<div className="space-y-2">
			{label && (
				<Label htmlFor={name} className="text-sm font-medium">
					{label}
				</Label>
			)}

			<div className="relative">
				<select
					id={name}
					name={name}
					value={value ?? ""}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					className={`w-full appearance-none shadow-none outline-none focus:border-primary border border-[#F5F5F5] rounded-[6px] bg-white text-base font-medium h-10.75 focus:shadow-sm duration-200 px-3 pr-9 md:h-12 sm:text-base
            ${value ? "text-black" : "text-[#9B9B9B]"}
            ${error ? "border-error text-error focus-visible:ring-error-400" : ""}
            ${disabled ? "bg-neutral-600 text-black font-semibold cursor-not-allowed" : ""}
            ${className}
          `}
				>
					<option value="" disabled hidden>
						{placeholder}
					</option>

					{options.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-[#9B9B9B]" />
			</div>
		</div>
	);
};

export default SelectField;
