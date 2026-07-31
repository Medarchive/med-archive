"use client";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";

export default function GetStartedIntro() {
	const router = useRouter();

	return (
		<div className="min-h-screen flex flex-col items-center justify-center gap-8 text-center">
			<div className="space-y-1">
				<h2 className="font-bold text-2xl sm:text-3xl">
					Your journey starts here!
				</h2>
				<p className="text-[#9B9B9B]">Upload a record or get ID</p>
			</div>

			<button
				type="button"
				onClick={() => router.push(pageRoutes.authRoutes.UPLOAD_RECORD)}
				className="flex flex-col items-center gap-3 cursor-pointer group"
			>
				<span className="flex items-center justify-center size-24 rounded-2xl bg-primary text-white duration-200 group-hover:scale-95">
					<Upload className="size-8" />
				</span>

				<span className="text-sm text-[#9B9B9B]">Upload Record</span>
			</button>

			<Button
				variant="dark"
				onClick={() => router.push(pageRoutes.HOME)}
				className="w-full sm:w-90"
			>
				Skip
			</Button>
		</div>
	);
}
