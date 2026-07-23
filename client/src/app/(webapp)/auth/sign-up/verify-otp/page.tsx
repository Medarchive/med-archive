"use client";

import { useSearchParams } from "next/navigation";
import VerifyOtpForm from "../../../../../features/auth/components/VerifyOtpForm";

export default function Page() {
	const param = useSearchParams();
	const email = param.get("email");

	return (
		<div className="h-screen flex items-center justify-center">
			<div className="sm:max-w-95">
				<div className="">
					<h3 className="font-semibold">Verify your Email</h3>
					<p className="text-sm text-[#9B9B9B] w-3/4 sm:text-base">
						A 4-digit code was sent to your email, please check {" "}
						<span className="font-semibold text-black">{email}</span>
					</p>
				</div>
				<div>
					<VerifyOtpForm />
				</div>
			</div>
		</div>
	);
}
