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
import { useValidateOtp, useResendOtp } from "../hooks";

interface VerifyOtpFormProps {
	email: string;
}

export default function VerifyOtpForm({ email }: VerifyOtpFormProps) {
	const { mutate: validateOtp, isPending } = useValidateOtp();
	const { mutate: resendOtp, isPending: isResending } = useResendOtp();

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
		if (timeLeft > 0 || isResending) return;

		resendOtp(
			{ email },
			{
				onSuccess: () => setTimeLeft(120),
			},
		);
	};

	const onSubmit = (values: VerifyOtpValues) => {
		validateOtp({ email, otp: values.otp });
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
						isLoading={isPending}
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
						disabled={timeLeft > 0 || isResending}
						className={`font-semibold ${
							timeLeft > 0 || isResending
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
