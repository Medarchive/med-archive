"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "../../../lib/validations/authValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { pageRoutes } from "../../../lib/config/routes";
import { useActivateAccount } from "../hooks";

// Same password rules as reset-password — activation is just "set your
// first password", the same shape either way.
type ActivateAccountValues = z.infer<typeof ResetPasswordSchema>;

interface ActivateAccountFormProps {
	token: string;
}

export default function ActivateAccountForm({ token }: ActivateAccountFormProps) {
	const { mutate: activateAccount, isPending } = useActivateAccount();

	const form = useForm<ActivateAccountValues>({
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
					This activation link is missing or invalid. Ask whoever invited you
					to send a new one.
				</p>

				<Link
					href={pageRoutes.authRoutes.SIGN_IN}
					className="inline-block text-sm font-semibold text-primary hover:underline"
				>
					Back to Sign In
				</Link>
			</div>
		);
	}

	const onSubmit = (values: ActivateAccountValues) => {
		activateAccount({ token, password: values.password });
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
										placeholder="Choose a password"
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
										placeholder="Confirm password"
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
						Activate Account
					</Button>
				</form>
			</Form>
		</div>
	);
}
