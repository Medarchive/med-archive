"use client";

import { useRef } from "react";
import { Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";

interface DateFieldProps {
	name: string;
	label?: string;
	value: string | undefined;
	error?: string | null;
	disabled?: boolean;
	className?: string;
	max?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// Native <input type="date"> doesn't render a custom `placeholder` (browsers
// show their own locale-formatted one, or nothing) so unlike InputField,
// this needs a real visible label to say what the field is for.
const DateField: React.FC<DateFieldProps> = ({
	name,
	label,
	value,
	error,
	disabled,
	className = "",
	max,
	onChange,
	onBlur,
}) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const openPicker = () => {
		if (disabled) return;

		if (typeof inputRef.current?.showPicker === "function") {
			inputRef.current.showPicker();
		} else {
			inputRef.current?.focus();
		}
	};

	return (
		<div className="space-y-2">
			{label && (
				<Label htmlFor={name} className="text-sm font-medium">
					{label}
				</Label>
			)}

			<div className="relative">
				<input
					ref={inputRef}
					id={name}
					name={name}
					type="date"
					value={value ?? ""}
					max={max}
					onChange={onChange}
					onBlur={onBlur}
					disabled={disabled}
					className={`w-full shadow-none outline-none focus:border-primary border border-[#F5F5F5] rounded-[6px] bg-white text-base font-medium h-10.75 focus:shadow-sm duration-200 px-3 pr-10 md:h-12 sm:text-base
            [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer
            ${!value ? "text-[#9B9B9B]" : "text-black"}
            ${error ? "border-error text-error focus-visible:ring-error-400" : ""}
            ${disabled ? "bg-neutral-600 text-black font-semibold cursor-not-allowed" : ""}
            ${className}
          `}
				/>

				<button
					type="button"
					tabIndex={-1}
					onClick={openPicker}
					className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9B9B]"
				>
					<Calendar className="size-4.5" />
				</button>
			</div>
		</div>
	);
};

export default DateField;
