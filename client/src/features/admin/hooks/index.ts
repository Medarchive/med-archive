"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import {
	ApiSuccessResponse,
	PaginatedData,
	PaginationParams,
	UserRole,
} from "../../../types/api";
import { RequestStatus } from "../../provider-request/types";
import { MEDICAL_CONDITIONS_QUERY_KEY } from "../../med-history/hooks";
import {
	CreateConditionPayload,
	UpdateConditionPayload,
} from "../../med-history/types";
import {
	AdminAccessRequestData,
	AdminStatsData,
	AdminUserSummary,
	AdminWalletSummary,
	ActivityLogEntry,
	InviteData,
} from "../types";

export const ADMIN_STATS_QUERY_KEY = ["admin", "stats"];
export const ADMIN_USERS_QUERY_KEY = ["admin", "users"];
export const ADMIN_INVITES_QUERY_KEY = ["admin", "invites"];
export const ADMIN_ACCESS_REQUESTS_QUERY_KEY = ["admin", "access-requests"];
export const ADMIN_WALLETS_QUERY_KEY = ["admin", "wallets"];
export const ADMIN_ACTIVITY_LOGS_QUERY_KEY = ["admin", "activity-logs"];

export const useAdminStats = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: ADMIN_STATS_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<AdminStatsData>>(
				apiRoutes.admin.STATS,
			);

			return data.data;
		},
	});
};

interface AdminUsersParams extends PaginationParams {
	role?: UserRole;
}

export const useAdminUsers = (params: AdminUsersParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ADMIN_USERS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<AdminUserSummary>>
			>(apiRoutes.users.LIST, { params });

			return data.data;
		},
	});
};

export const useAdminUser = (id: string | null) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ADMIN_USERS_QUERY_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<AdminUserSummary>>(
				apiRoutes.users.BY_ID(id as string),
			);

			return data.data;
		},
		enabled: !!id,
	});
};

export const useVerifyProvider = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<unknown>>(
				apiRoutes.users.VERIFY_PROVIDER(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
			toast.success(data.message || "Provider verified");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Provider is already verified"));
		},
	});
};

export const useDeleteUser = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.admin.DELETE_USER(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
			toast.success(data.message || "User deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useCreateInvite = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: { email: string; name: string }) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<InviteData>>(
				apiRoutes.admin.INVITES,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ADMIN_INVITES_QUERY_KEY });
			toast.success(data.message || "Invite sent");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useAdminInvites = (params: PaginationParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ADMIN_INVITES_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<PaginatedData<InviteData>>>(
				apiRoutes.admin.INVITES,
				{ params },
			);

			return data.data;
		},
	});
};

export const useRevokeInvite = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.admin.INVITE_BY_ID(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ADMIN_INVITES_QUERY_KEY });
			toast.success(data.message || "Invite revoked");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

// An invite has no userId/acceptedUserId once used (confirmed against a
// real response) — only the email it was sent to. Cross-reference that
// against the users list to find the resulting provider account, then
// verify it. Real lookup, not a guessed field.
export const useVerifyInvitedProvider = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (email: string) => {
			const { data: usersRes } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<AdminUserSummary>>
			>(apiRoutes.users.LIST, {
				params: { search: email, role: "PROVIDER", take: 5 },
			});

			const match = usersRes.data.data.find(
				(candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
			);

			if (!match) {
				throw new Error(
					"Couldn't find the provider account for this invite — they may not have activated it yet.",
				);
			}

			const { data } = await axiosAuth.patch<ApiSuccessResponse<unknown>>(
				apiRoutes.users.VERIFY_PROVIDER(match.id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
			toast.success(data.message || "Provider verified");
		},
		onError: (error) => {
			toast.error(
				error instanceof Error
					? error.message
					: getApiErrorMessage(error, "Provider is already verified"),
			);
		},
	});
};

interface AdminAccessRequestsParams extends PaginationParams {
	status?: RequestStatus;
}

export const useAdminAccessRequests = (params: AdminAccessRequestsParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ADMIN_ACCESS_REQUESTS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<AdminAccessRequestData>>
			>(apiRoutes.admin.ACCESS_REQUESTS, { params });

			return data.data;
		},
	});
};

export const useAdminWallets = (params: PaginationParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ADMIN_WALLETS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<AdminWalletSummary>>
			>(apiRoutes.admin.WALLETS, { params });

			return data.data;
		},
	});
};

interface AdminActivityLogsParams extends PaginationParams {
	userId?: string;
}

export const useAdminActivityLogs = (params: AdminActivityLogsParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ADMIN_ACTIVITY_LOGS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<ActivityLogEntry>>
			>(apiRoutes.admin.ACTIVITY_LOGS, { params });

			return data.data;
		},
	});
};

// POST /api/v1/medical-conditions ("[Admin] Create a medical condition") —
// confirmed (via a real 400) that `description` is rejected outright
// ("property description should not exist"), so it's never sent. `category`
// is required — confirmed via the live CreateMedicalConditionDto schema
// (a real 400's error text named the field but not its values, so the docs
// were pulled to get the actual enum): "DISEASE" | "ALLERGY" | "CONDITION".
// `sortOrder` is optional, defaults to 0 server-side. GET on this same path
// is real (see features/med-history/hooks' useMedicalConditions), so this at
// least has a real list to invalidate into.
export const useCreateMedicalCondition = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateConditionPayload) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<unknown>>(
				apiRoutes.medicalConditions.BASE,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: MEDICAL_CONDITIONS_QUERY_KEY });
			toast.success(data.message || "Condition created");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

// PUT /api/v1/medical-conditions/{id} ("[Admin] Update a medical
// condition") — confirmed live via the docs (UpdateMedicalConditionDto: all
// fields optional). 409 if the new name collides with another condition.
export const useUpdateMedicalCondition = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateConditionPayload;
		}) => {
			const { data } = await axiosAuth.put<ApiSuccessResponse<unknown>>(
				apiRoutes.medicalConditions.BY_ID(id),
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: MEDICAL_CONDITIONS_QUERY_KEY });
			toast.success(data.message || "Condition updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "A condition with that name already exists"));
		},
	});
};

// DELETE /api/v1/medical-conditions/{id} ("[Admin] Soft-delete a medical
// condition") — confirmed live via the docs. GET only ever lists active
// conditions, so this removes the row from view rather than showing an
// "inactive" state anywhere; 400 if it's already deactivated.
export const useDeactivateMedicalCondition = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.medicalConditions.BY_ID(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: MEDICAL_CONDITIONS_QUERY_KEY });
			toast.success(data.message || "Condition deactivated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "This condition is already deactivated"));
		},
	});
};

export const useBroadcastNotification = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (payload: { title: string; body: string; role?: UserRole }) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<unknown>>(
				apiRoutes.admin.BROADCAST_NOTIFICATION,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Notification broadcast");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
