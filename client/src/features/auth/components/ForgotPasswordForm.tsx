"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ForgotPasswordSchema } from "../../../lib/validations/authValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { toast } from "sonner";

type ForgotPasswordValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordForm() {
	const [isLoading, setIsLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const form = useForm<ForgotPasswordValues>({
		resolver: zodResolver(ForgotPasswordSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			email: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: ForgotPasswordValues) => {
		console.log(values);
		setIsLoading(true);

		setTimeout(() => {
			toast.success("Password reset link sent");
			setIsLoading(false);
			setSent(true);
		}, 2000);
	};

	if (sent) {
		return (
			<p className="mt-5 text-sm text-[#9B9B9B]">
				If an account exists for{" "}
				<span className="font-semibold text-black">
					{form.getValues("email")}
				</span>
				, a password reset link has been sent.
			</p>
		);
	}

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 my-5">
					<FormField
						control={form.control}
						name="email"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Email address"
										type="email"
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
						Send Reset Link
					</Button>
				</form>
			</Form>
		</div>
	);
}
