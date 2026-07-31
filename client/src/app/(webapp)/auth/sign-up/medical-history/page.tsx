import React from "react";
import MedicalHistoryForm from "../../../../../features/onboarding/components/MedicalHistoryForm";

export default function Page() {
	return (
		<div className="min-h-screen flex justify-center flex-col pb-20">
			<div className="mx-auto w-full sm:max-w-115">
				<h3 className="font-semibold sm:text-xl">Personal Medical History</h3>

				<p className="text-sm text-[#9B9B9B] sm:text-base">
					Your medical history helps us craft a personalised Transition Pack
					made just for you — like magic, but real!
				</p>

				<p className="text-sm text-[#9B9B9B] sm:text-base mt-4">
					Please let us know if any of the following apply to you:
				</p>

				<MedicalHistoryForm />
			</div>
		</div>
	);
}
