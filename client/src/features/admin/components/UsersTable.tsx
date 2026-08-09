"use client";

import { useEffect, useState } from "react";
import Pagination from "../../../components/shared/Pagination";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import StatusBadge from "../../../components/shared/StatusBadge";
import ConfirmModal from "../../../components/ui/custom/ConfirmModal";
import { Button } from "../../../components/ui/button";
import { useHeaderStore } from "../../../lib/stores/header-store";
import { useAdminUsers, useDeleteUser, useVerifyProvider } from "../hooks";
import { UserRole } from "../../../types/api";
import { AdminUserSummary } from "../types";
import UserDetailModal from "./UserDetailModal";

type RoleFilter = "ALL" | UserRole;

const roleTabs: { label: string; value: RoleFilter }[] = [
	{ label: "All", value: "ALL" },
	{ label: "Patients", value: "PATIENT" },
	{ label: "Providers", value: "PROVIDER" },
	{ label: "Admins", value: "ADMIN" },
];

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function UsersTable() {
	const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(
		null,
	);
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

	// Driven by the header's shared search box (see AdminHeader), not a
	// field of its own — debounced here rather than firing a request per
	// keystroke.
	const headerSearchQuery = useHeaderStore((state) => state.searchQuery);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setSearch(headerSearchQuery.trim());
			setCurrentPage(1);
		}, 350);

		return () => clearTimeout(timeout);
	}, [headerSearchQuery]);

	const { data, isLoading } = useAdminUsers({
		role: roleFilter === "ALL" ? undefined : roleFilter,
		search: search || undefined,
		page: currentPage,
		take: 10,
	});

	const { mutate: verifyProvider, isPending: isVerifying } =
		useVerifyProvider();
	const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

	const users = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	const handleRoleChange = (role: RoleFilter) => {
		setRoleFilter(role);
		setCurrentPage(1);
	};

	if (isLoading) {
		return <TableSkeleton rows={8} columns={6} showTabs />;
	}

	return (
		<>
			<div className="min-w-0 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<div className="flex flex-wrap gap-2">
					{roleTabs.map((tab) => (
						<button
							key={tab.value}
							type="button"
							onClick={() => handleRoleChange(tab.value)}
							className={`rounded-[8px] border px-3 py-1.5 text-xs font-medium duration-150
                ${
									roleFilter === tab.value
										? "border-black bg-black text-white"
										: "border-[#E5E5E5] text-black hover:bg-[#FAFAFA]"
								}
              `}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className="mt-4 min-w-0 overflow-x-auto">
					<table className="w-full min-w-240 text-sm">
						<thead>
							<tr className="text-left text-xs text-[#9B9B9B]">
								<th className="whitespace-nowrap pb-3 pr-4 font-normal">
									Name
								</th>
								<th className="whitespace-nowrap pb-3 pr-4 font-normal">
									Email
								</th>
								<th className="whitespace-nowrap pb-3 pr-4 font-normal">
									Role
								</th>
								<th className="whitespace-nowrap pb-3 pr-4 font-normal">
									Gender
								</th>
								<th className="whitespace-nowrap pb-3 pr-4 font-normal">
									Joined
								</th>
								<th className="whitespace-nowrap pb-3 font-normal text-right">
									Actions
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-[#F5F5F5]">
							{users.length === 0 && (
								<tr>
									<td colSpan={6} className="py-6 text-center text-[#9B9B9B]">
										No users found
									</td>
								</tr>
							)}

							{users.map((user) => {
								// providerStatus is only meaningful for PROVIDER rows
								// (null for patients/admins) — confirmed added to this
								// endpoint directly by the user. Replaces the earlier
								// blanket "show Verify for every provider row" fallback
								// that existed only because this field wasn't on the
								// response yet.
								const needsVerification =
									user.role === "PROVIDER" && user.providerStatus === "PENDING";

								return (
									<tr
										key={user.id}
										onClick={() => setSelectedUser(user)}
										className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
									>
										<td className="whitespace-nowrap py-3 pr-4 font-medium">
											{user.fullName}
										</td>
										<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
											{user.email}
										</td>
										<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
											<div className="flex items-center gap-2">
												{user.role}
												{user.role === "PROVIDER" && user.providerStatus && (
													<StatusBadge
														variant={
															user.providerStatus === "VERIFIED"
																? "success"
																: "warning"
														}
														label={
															user.providerStatus === "VERIFIED"
																? "Verified"
																: "Pending"
														}
													/>
												)}
											</div>
										</td>
										<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
											{user.gender ?? "—"}
										</td>
										<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
											{formatDate(user.createdAt)}
										</td>

										<td className="whitespace-nowrap py-3">
											<div
												className="flex justify-end gap-2"
												onClick={(e) => e.stopPropagation()}
											>
												{needsVerification && (
													<Button
														size="sm"
														isLoading={isVerifying}
														onClick={() => verifyProvider(user.id)}
													>
														Verify
													</Button>
												)}

												<Button
													size="sm"
													variant="destructive"
													onClick={() => setConfirmDeleteId(user.id)}
												>
													Delete
												</Button>
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>

				<div className="mt-4">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			</div>

			<UserDetailModal
				user={selectedUser}
				onClose={() => setSelectedUser(null)}
			/>

			<ConfirmModal
				open={!!confirmDeleteId}
				message="Delete this user? This cannot be undone."
				isLoading={isDeleting}
				onConfirm={() => {
					if (!confirmDeleteId) return;
					deleteUser(confirmDeleteId, {
						onSuccess: () => setConfirmDeleteId(null),
					});
				}}
				onCancel={() => setConfirmDeleteId(null)}
			/>
		</>
	);
}
