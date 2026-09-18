import React from "react";
import MedicalProfileForm from "../../../../../features/onboarding/components/MedicalProfileForm";

export default function Page() {
	return (
		<div className="min-h-screen flex justify-center flex-col pb-20">
			<div className="mx-auto w-full sm:max-w-115">
				<h3 className="font-semibold sm:text-xl">Medical Profile</h3>

				<p className="text-sm text-[#9B9B9B] w-3/4 sm:text-base">
					A few health basics help us craft a personalised Transition Pack
					made just for you — like magic, but real! You can skip this and
					fill it in later from your account.
				</p>

				<MedicalProfileForm />
			</div>
		</div>
	);
}
