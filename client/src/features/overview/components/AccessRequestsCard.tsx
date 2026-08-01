"use client";

import { Button } from "../../../components/ui/button";
import { useAccessRequests, useRespondToAccessRequest } from "../../provider-request/hooks";

const getInitials = (name: string) =>
	name
		.replace(/^(Dr\.|Pharm\.|Sci\.)\s*/i, "")
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

export default function AccessRequestsCard() {
	const { data, isLoading } = useAccessRequests({ status: "PENDING", take: 3 });
	const { mutate: respond, isPending } = useRespondToAccessRequest();

	const requests = data?.data ?? [];

	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">
				New Access Request ({data?.meta.totalCount ?? 0})
			</h3>

			<div className="mt-4 flex-1 divide-y divide-[#F5F5F5]">
				{isLoading && <p className="py-3 text-sm text-[#9B9B9B]">Loading...</p>}

				{!isLoading && requests.length === 0 && (
					<p className="py-3 text-sm text-[#9B9B9B]">No pending requests.</p>
				)}

				{requests.map((request) => (
					<div key={request.id} className="py-3">
						<div className="flex items-center gap-3">
							<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">
								{getInitials(request.providerName)}
							</span>

							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold">
									{request.providerName}
								</p>
								<p className="truncate text-xs text-[#9B9B9B]">
									{request.requestType}
								</p>
							</div>
						</div>

						<div className="mt-3 grid grid-cols-2 gap-2">
							<Button
								size="sm"
								className="w-full min-w-0"
								isLoading={isPending}
								onClick={() => respond({ id: request.id, status: "APPROVED" })}
							>
								Approve
							</Button>

							<Button
								size="sm"
								variant="destructive"
								className="w-full min-w-0"
								isLoading={isPending}
								onClick={() => respond({ id: request.id, status: "DECLINED" })}
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
