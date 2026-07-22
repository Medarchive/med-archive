"use client";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pageRoutes } from "../../../lib/config/routes";
import { SignUpSchema } from "../../../lib/validations/authValidations";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Form,
} from "../../../components/ui/form";
import { toast } from "sonner";

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<SignUpValues>({
		resolver: zodResolver(SignUpSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: {
			full_name: "",
			email: "",
			phone_number: "",
			password: "",
		},
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: SignUpValues) => {
		console.log(values);
		setIsLoading(true);

		setTimeout(() => {
			toast.success("Register Successful");
			setIsLoading(false);
			// router.push("/");
		}, 2000);
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
						name="full_name"
						render={({ field, fieldState }) => (
							<FormItem>
								{/* <FormLabel>Email</FormLabel> */}

								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Full Name"
										type="text"
										error={fieldState.error?.message ?? null}
									/>
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
					{/* --------------------------------
              EMAIL FIELD
			  -------------------------------- */}
					<FormField
						control={form.control}
						name="email"
						render={({ field, fieldState }) => (
							<FormItem>
								{/* <FormLabel>Email</FormLabel> */}

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
              EMAIL FIELD
			  -------------------------------- */}
					<FormField
						control={form.control}
						name="phone_number"
						render={({ field, fieldState }) => (
							<FormItem>
								{/* <FormLabel>Email</FormLabel> */}

								<FormControl>
									<InputField
										{...field}
										label=""
										placeholder="Phone Number"
										type="tel"
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
								{/* <FormLabel>Email</FormLabel> */}

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
						isLoading={isLoading}
						disabled={!isValid || isSubmitting}
						className="w-full mt-4"
					>
						Create Account
					</Button>
				</form>
			</Form>

			<div className="flex flex-col w-full gap-4">
				<div className="text-center text-primary font-semibold my-1">Or</div>
				<Button className="w-full" variant="dark">
					Connect Wallet
				</Button>
			</div>
		</div>
	);
}
