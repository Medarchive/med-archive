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
} from "../../../types/api";
import { AccessRequestData, RequestStatus } from "../types";

export const ACCESS_REQUESTS_QUERY_KEY = ["access-requests"];

interface AccessRequestsParams extends PaginationParams {
	status?: RequestStatus;
}

export const useAccessRequests = (params: AccessRequestsParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...ACCESS_REQUESTS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<AccessRequestData>>
			>(apiRoutes.healthRecords.ACCESS_REQUESTS, { params });

			return data.data;
		},
	});
};

export const useRespondToAccessRequest = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			status,
		}: {
			id: string;
			status: "APPROVED" | "DECLINED";
		}) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<AccessRequestData>>(
				apiRoutes.healthRecords.ACCESS_REQUEST_BY_ID(id),
				{ status },
			);

			return data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ACCESS_REQUESTS_QUERY_KEY });
			toast.success(
				data.message ||
					`Request ${variables.status === "APPROVED" ? "approved" : "declined"}`,
			);
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Request already responded to"));
		},
	});
};

export const useRevokeAccessRequest = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<AccessRequestData>>(
				apiRoutes.healthRecords.REVOKE_ACCESS_REQUEST(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ACCESS_REQUESTS_QUERY_KEY });
			toast.success(data.message || "Record access revoked");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Couldn't revoke record access"));
		},
	});
};
