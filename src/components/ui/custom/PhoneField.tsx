"use client";

import { ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { country, getFlagEmoji } from "@/lib/utils/countries";

interface PhoneFieldProps {
	name: string;
	label?: string;
	dialCode: string;
	number: string | undefined;
	error?: string | null;
	disabled?: boolean;
	className?: string;
	onDialCodeChange: (dialCode: string) => void;
	onNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PhoneField: React.FC<PhoneFieldProps> = ({
	name,
	dialCode,
	number,
	error,
	label,
	disabled,
	className = "",
	onDialCodeChange,
	onNumberChange,
	onBlur,
}) => {
	const selected =
		country.find((c) => c.dial_code === dialCode) ?? country[0];

	return (
		<div className="space-y-2">
			{label && (
				<Label htmlFor={name} className="text-sm font-medium">
					{label}
				</Label>
			)}

			<div
				className={`flex items-center rounded-[6px] border border-[#F5F5F5] bg-white h-10.75 md:h-12 duration-200 focus-within:border-primary focus-within:shadow-sm
          ${error ? "border-error" : ""}
          ${disabled ? "bg-neutral-600 cursor-not-allowed" : ""}
          ${className}
        `}
			>
				<div className="relative flex items-center gap-1 pl-3 pr-2 shrink-0">
					<span className="text-base">{getFlagEmoji(selected.code)}</span>
					<ChevronDown className="size-3.5 text-[#9B9B9B]" />

					<select
						aria-label="Country dial code"
						value={selected.dial_code}
						disabled={disabled}
						onChange={(e) => onDialCodeChange(e.target.value)}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
					>
						{country.map((c) => (
							<option key={c.code} value={c.dial_code}>
								{c.name} ({c.dial_code})
							</option>
						))}
					</select>
				</div>

				<span className="h-5 w-px bg-[#F5F5F5]" />

				<input
					id={name}
					name={name}
					type="tel"
					inputMode="tel"
					placeholder="Phone Number"
					value={number ?? ""}
					onChange={onNumberChange}
					onBlur={onBlur}
					disabled={disabled}
					className="flex-1 min-w-0 h-full px-3 bg-transparent outline-none text-base font-medium placeholder:font-normal placeholder:text-sm placeholder:text-[#9B9B9B] disabled:cursor-not-allowed"
				/>
			</div>
		</div>
	);
};

export default PhoneField;
