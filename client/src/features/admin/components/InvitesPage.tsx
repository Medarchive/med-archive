"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import Pagination from "../../../components/shared/Pagination";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import ConfirmModal from "../../../components/ui/custom/ConfirmModal";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../../../components/ui/form";
import {
	useAdminInvites,
	useCreateInvite,
	useRevokeInvite,
	useVerifyInvitedProvider,
} from "../hooks";

const InviteSchema = z.object({
	name: z.string().trim().min(2, "Name is too short").max(100, "Name is too long"),
	email: z.string().trim().email("Enter a valid email"),
});

type InviteValues = z.infer<typeof InviteSchema>;

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function InvitesPage() {
	const [showForm, setShowForm] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [revokeId, setRevokeId] = useState<string | null>(null);

	const { data, isLoading } = useAdminInvites({ page: currentPage, take: 10 });
	const { mutate: createInvite, isPending: isCreating } = useCreateInvite();
	const { mutate: revokeInvite, isPending: isRevoking } = useRevokeInvite();
	const { mutate: verifyInvitedProvider, isPending: isVerifying } =
		useVerifyInvitedProvider();

	const invites = data?.data ?? [];
	const totalPages = data?.meta.totalPages ?? 1;

	const form = useForm<InviteValues>({
		resolver: zodResolver(InviteSchema),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { name: "", email: "" },
	});

	const {
		formState: { isValid, isSubmitting },
	} = form;

	const onSubmit = (values: InviteValues) => {
		createInvite(values, {
			onSuccess: () => {
				form.reset();
				setShowForm(false);
			},
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-2xl font-bold sm:text-3xl">Provider Invites</h1>

				<Button size="sm" onClick={() => setShowForm((prev) => !prev)}>
					{showForm ? (
						<>
							<X className="size-4" />
							Cancel
						</>
					) : (
						<>
							<Plus className="size-4" />
							Invite Provider
						</>
					)}
				</Button>
			</div>

			{showForm && (
				<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-3 sm:max-w-115"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Provider name"
												type="text"
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<InputField
												{...field}
												label=""
												placeholder="Provider email"
												type="email"
												error={fieldState.error?.message ?? null}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button
								type="submit"
								isLoading={isCreating}
								disabled={!isValid || isSubmitting}
								className="w-fit"
							>
								Send Invite
							</Button>
						</form>
					</Form>
				</div>
			)}

			{isLoading ? (
				<TableSkeleton rows={6} columns={4} />
			) : (
				<div className="min-w-0 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
					<div className="min-w-0 overflow-x-auto">
						<table className="w-full min-w-160 text-sm">
							<thead>
								<tr className="text-left text-xs text-[#9B9B9B]">
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">Name</th>
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">Email</th>
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">
										Status
									</th>
									<th className="whitespace-nowrap pb-3 pr-4 font-normal">
										Used / Expires
									</th>
									<th className="whitespace-nowrap pb-3 font-normal text-right">
										Actions
									</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-[#F5F5F5]">
								{invites.length === 0 && (
									<tr>
										<td colSpan={5} className="py-6 text-center text-[#9B9B9B]">
											No invites yet
										</td>
									</tr>
								)}

								{invites.map((invite) => {
									const isUsed = invite.status === "USED";

									return (
										<tr key={invite.id}>
											<td className="whitespace-nowrap py-3 pr-4 font-medium">
												{invite.name}
											</td>
											<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
												{invite.email}
											</td>
											<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
												{invite.status}
											</td>
											<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
												{isUsed
													? `Used ${formatDate(invite.usedAt)}`
													: `Expires ${formatDate(invite.expiresAt)}`}
											</td>
											<td className="whitespace-nowrap py-3 text-right">
												{isUsed ? (
													// The invite carries no reference to the account it
													// created — verifying cross-references this email
													// against the users list to find it.
													<Button
														size="sm"
														isLoading={isVerifying}
														onClick={() =>
															verifyInvitedProvider(invite.email)
														}
													>
														Verify Provider
													</Button>
												) : (
													<Button
														size="sm"
														variant="destructive"
														onClick={() => setRevokeId(invite.id)}
													>
														Revoke
													</Button>
												)}
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
			)}

			<ConfirmModal
				open={!!revokeId}
				message="Revoke this invitation?"
				isLoading={isRevoking}
				onConfirm={() => {
					if (!revokeId) return;
					revokeInvite(revokeId, { onSuccess: () => setRevokeId(null) });
				}}
				onCancel={() => setRevokeId(null)}
			/>
		</div>
	);
}
