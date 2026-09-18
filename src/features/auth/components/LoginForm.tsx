"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { pageRoutes } from "../../../lib/config/routes";
import { SignInSchema } from "../../../lib/validations/authValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { useLogin, useWalletLogin } from "../hooks";

type SignInValues = z.infer<typeof SignInSchema>;

export default function LoginForm() {
	const { mutate: login, isPending } = useLogin();
	const { mutate: loginWithWallet, isPending: isConnectingWallet } = useWalletLogin();

	const form = useForm<SignInValues>({
		resolver: zodResolver(SignInSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: SignInValues) => {
		login(values);
	};

	return (
		<div className="">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 my-5">
					{/* --------------------------------
              EMAIL FIELD
			  -------------------------------- */}
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
					{/* --------------------------------
              PASSWORD
          -------------------------------- */}
					<FormField
						control={form.control}
						name="password"
						render={({ field, fieldState }) => (
							<FormItem>
								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Password"
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
						Sign In
					</Button>
				</form>
			</Form>

			<div className="flex flex-col w-full gap-4">
				<Button
					href={pageRoutes.authRoutes.FORGOT_PASSWORD}
					className="w-full"
					variant="ghost"
				>
					Forgot Password
				</Button>
				<Button
					className="w-full"
					variant="dark"
					isLoading={isConnectingWallet}
					onClick={() => loginWithWallet()}
				>
					Connect Wallet
				</Button>
			</div>
		</div>
	);
}
