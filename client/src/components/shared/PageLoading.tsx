import React from "react";
import { PiSpinner } from "react-icons/pi";

export default function PageLoading() {
	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-white/30 backdrop-blur-[2px]">
			<PiSpinner className="text-9xl text-primary animate-spin" />
		</div>
	);
}
