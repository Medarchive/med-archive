"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";

interface AccessRequest {
	id: string;
	name: string;
	note: string;
}

const initialRequests: AccessRequest[] = [
	{ id: "1", name: "Dr. James", note: "Needs Allergy Data" },
	{ id: "2", name: "Pharm. Mary", note: "Needs Allergy Data" },
	{ id: "3", name: "Sci. E.B Kelvin", note: "Needs Allergy Data" },
];

const getInitials = (name: string) =>
	name
		.replace(/^(Dr\.|Pharm\.|Sci\.)\s*/i, "")
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

export default function AccessRequestsCard() {
	const [requests, setRequests] = useState(initialRequests);

	const handleDecision = (id: string, name: string, approved: boolean) => {
		setRequests((prev) => prev.filter((request) => request.id !== id));
		toast.success(`${approved ? "Approved" : "Declined"} access for ${name}`);
	};

	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5 w-full">
			<h3 className="font-semibold">New Access Request ({requests.length})</h3>

			<div className="mt-4 flex-1 divide-y divide-[#F5F5F5]">
				{requests.length === 0 && (
					<p className="py-3 text-sm text-[#9B9B9B]">No pending requests.</p>
				)}

				{requests.map((request) => (
					<div key={request.id} className="py-3">
						<div className="flex items-center gap-3">
							<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
								{getInitials(request.name)}
							</span>

							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold">{request.name}</p>
								<p className="truncate text-xs text-[#9B9B9B]">
									{request.note}
								</p>
							</div>
						</div>

						<div className="mt-3 lg:mt-5 grid grid-cols-2 gap-2">
							<Button
								size="sm"
								className="w-full min-w-0"
								onClick={() => handleDecision(request.id, request.name, true)}
							>
								Approve
							</Button>

							<Button
								size="sm"
								variant="destructive"
								className="w-full min-w-0"
								onClick={() => handleDecision(request.id, request.name, false)}
							>
								Decline
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
