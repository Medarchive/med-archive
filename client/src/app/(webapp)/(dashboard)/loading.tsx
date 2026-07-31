import { PiSpinner } from "react-icons/pi";

export default function Loading() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<PiSpinner className="animate-spin text-5xl text-primary" />
		</div>
	);
}
