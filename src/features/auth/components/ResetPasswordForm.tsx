"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ResetPasswordSchema } from "../../../lib/validations/authValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { pageRoutes } from "../../../lib/config/routes";
import { useResetPassword } from "../hooks";

type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;

interface ResetPasswordFormProps {
	token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
	const [done, setDone] = useState(false);
	const { mutate: resetPassword, isPending } = useResetPassword();

	const form = useForm<ResetPasswordValues>({
		resolver: zodResolver(ResetPasswordSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	// Reached without (or with a stripped) token — e.g. the link was
	// forwarded without its query string, or someone hit the page directly.
	if (!token) {
		return (
			<div className="mt-5 space-y-3">
				<p className="text-sm text-[#9B9B9B]">
					This reset link is missing or invalid. Request a new one to reset
					your password.
				</p>

				<Link
					href={pageRoutes.authRoutes.FORGOT_PASSWORD}
					className="inline-block text-sm font-semibold text-primary hover:underline"
				>
					Request a new reset link
				</Link>
			</div>
		);
	}

	if (done) {
		return (
			<p className="mt-5 text-sm text-[#9B9B9B]">
				Your password has been reset. You can now{" "}
				<Link
					href={pageRoutes.authRoutes.SIGN_IN}
					className="font-semibold text-primary hover:underline"
				>
					sign in
				</Link>{" "}
				with your new password.
			</p>
		);
	}

	const onSubmit = (values: ResetPasswordValues) => {
		resetPassword(
			{ token, newPassword: values.password },
			{ onSuccess: () => setDone(true) },
		);
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 my-5">
					<FormField
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="New password"
										type="password"
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Confirm new password"
										type="password"
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
						Reset Password
					</Button>
				</form>
			</Form>
		</div>
	);
}
