"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";
import UploadRecordForm from "../../records/components/UploadRecordForm";

// Wraps the real (shared with the Records page) upload form with onboarding
// framing — a way to leave this step either way: skip it outright before
// uploading anything, or confirm and move on once at least one record's in.
export default function UploadRecordStep() {
	const router = useRouter();
	const [hasUploaded, setHasUploaded] = useState(false);

	const goToDashboard = () => router.push(pageRoutes.dashboardRoutes.DASHBOARD);

	return (
		<div className="min-h-screen flex justify-center flex-col pb-20">
			<div className="mx-auto w-full sm:max-w-115">
				<h3 className="font-semibold sm:text-xl">Upload a Health Record</h3>

				<p className="text-sm text-[#9B9B9B] w-3/4 sm:text-base">
					Add a lab result, prescription, or scan to get started — or skip
					this and add records later from your dashboard.
				</p>

				{hasUploaded && (
					<div className="mt-4 flex items-center gap-2 rounded-[8px] border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary">
						<CheckCircle2 className="size-4 shrink-0" />
						Record uploaded — add another below, or continue to your dashboard.
					</div>
				)}

				<UploadRecordForm onSuccess={() => setHasUploaded(true)} />

				<div className="mt-4 flex flex-col gap-2 sm:flex-row-reverse">
					{hasUploaded ? (
						<Button onClick={goToDashboard} className="flex-1">
							Continue to Dashboard
						</Button>
					) : (
						<Button variant="ghost" onClick={goToDashboard} className="flex-1">
							Skip for now
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
