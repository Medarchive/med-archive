"use client";

import { useState } from "react";
import Link from "next/link";
import { ReceiptText } from "lucide-react";
import EmptyState from "../../../components/shared/EmptyState";
import Pagination from "../../../components/shared/Pagination";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import { pageRoutes } from "../../../lib/config/routes";
import { useServiceOrders } from "../hooks";
import { formatOrderAmount, formatOrderDate } from "../utils";
import ServiceOrderDetailModal from "./ServiceOrderDetailModal";
import ServiceOrderStatusBadge from "./ServiceOrderStatusBadge";

interface ServiceOrdersPageProps {
	role: "PATIENT" | "PROVIDER";
}

export default function ServiceOrdersPage({ role }: ServiceOrdersPageProps) {
	const [page, setPage] = useState(1);
	const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

	const { data, isLoading } = useServiceOrders({ page, take: 10 });
	const orders = data?.data ?? [];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold sm:text-3xl">Orders</h1>
				<p className="text-[#9B9B9B]">
					{role === "PATIENT" ? (
						"Services your providers have billed you for, paid in USDC from your wallet."
					) : (
						<>
							Services you&apos;ve billed patients for. Create new orders from{" "}
							<Link
								href={pageRoutes.providerRoutes.PATIENTS}
								className="font-semibold text-primary hover:underline"
							>
								Patient Lookup
							</Link>
							.
						</>
					)}
				</p>
			</div>

			{isLoading ? (
				<TableSkeleton rows={5} columns={5} />
			) : orders.length === 0 ? (
				<EmptyState icon={ReceiptText} message="No service orders yet." />
			) : (
				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<div className="overflow-x-auto">
						<table className="w-full min-w-160 text-sm">
							<thead>
								<tr className="text-left text-xs text-[#9B9B9B]">
									<th className="pb-3 font-normal">Reference</th>
									<th className="pb-3 font-normal">Service</th>
									<th className="pb-3 font-normal">Amount</th>
									<th className="pb-3 font-normal">Status</th>
									<th className="pb-3 font-normal">Created</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-[#F5F5F5]">
								{orders.map((order) => (
									<tr
										key={order.id}
										onClick={() => setSelectedOrderId(order.id)}
										className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
									>
										<td className="py-3 font-mono text-xs">{order.reference}</td>
										<td className="max-w-60 truncate py-3 text-[#9B9B9B]">
											{order.description}
										</td>
										<td className="py-3 font-medium">
											{formatOrderAmount(order.amount, order.assetCode)}
										</td>
										<td className="py-3">
											<ServiceOrderStatusBadge status={order.status} />
										</td>
										<td className="py-3 text-[#9B9B9B]">
											{formatOrderDate(order.createdAt)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{data && data.meta.totalPages > 1 && (
						<div className="mt-4">
							<Pagination
								currentPage={data.meta.page}
								totalPages={data.meta.totalPages}
								onPageChange={setPage}
							/>
						</div>
					)}
				</div>
			)}

			<ServiceOrderDetailModal
				orderId={selectedOrderId}
				role={role}
				onClose={() => setSelectedOrderId(null)}
			/>
		</div>
	);
}
