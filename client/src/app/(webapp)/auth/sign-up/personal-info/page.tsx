import React from "react";
import PersonalInfoForm from "../../../../../features/auth/components/PersonalInfoForm";

export default function Page() {
	return (
		<div className="min-h-screen flex justify-center flex-col pb-20  ">
			<div className="mx-auto w-full sm:max-w-155">
				<h3 className="font-semibold sm:text-xl">Personal Information</h3>

				<p className="text-sm text-[#9B9B9B] w-3/4 sm:text-base">
					Please fill in your personal information correctly.
				</p>

				<PersonalInfoForm />
			</div>
		</div>
	);
}
