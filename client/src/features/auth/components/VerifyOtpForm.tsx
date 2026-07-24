"use client";

import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
	VerifyOtpSchema,
	VerifyOtpValues,
} from "../../../lib/validations/authValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { pageRoutes } from "../../../lib/config/routes";

export default function VerifyOtpForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// 2 minute countdown
	const [timeLeft, setTimeLeft] = useState(120);

	const form = useForm<VerifyOtpValues>({
		resolver: zodResolver(VerifyOtpSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			otp: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	useEffect(() => {
		if (timeLeft <= 0) return;

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;

		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	const handleResend = () => {
		if (timeLeft > 0) return;

		// Call your resend OTP API here

		toast.success("OTP resent successfully");

		// Restart timer
		setTimeLeft(120);
	};

	const onSubmit = (values: VerifyOtpValues) => {
		console.log(values);

		setIsLoading(true);

		setTimeout(() => {
			toast.success("Verification Successful");
			setIsLoading(false);
			router.push(pageRoutes.authRoutes.PERSONAL_INFO);
		}, 2000);
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 my-5">
					<FormField
						control={form.control}
						name="otp"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Enter 6 digit code"
										type="tel"
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						isLoading={isLoading}
						disabled={!isValid || isSubmitting}
						className="w-full mt-4"
					>
						Continue
					</Button>
				</form>
			</Form>

			<div className="flex justify-between text-sm">
				<div className="flex gap-1">
					<p className="text-[#9B9B9B]">Didn&apos;t get your code?</p>

					<button
						type="button"
						onClick={handleResend}
						disabled={timeLeft > 0}
						className={`font-semibold ${
							timeLeft > 0
								? "text-[#9B9B9B] cursor-not-allowed"
								: "text-primary hover:underline"
						}`}
					>
						Resend
					</button>
				</div>

				<div className="text-[#9B9B9B]">{formatTime(timeLeft)}</div>
			</div>
		</div>
	);
}
