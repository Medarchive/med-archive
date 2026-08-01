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
import { NotificationData } from "../types";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

interface NotificationsParams extends PaginationParams {
	read?: boolean;
}

export const useNotifications = (params: NotificationsParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<NotificationData>>
			>(apiRoutes.notifications.BASE, { params });

			return data.data;
		},
		refetchInterval: 60_000,
	});
};

export const useMarkNotification = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<NotificationData>>(
				apiRoutes.notifications.BY_ID(id),
				{ read },
			);

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useDeleteNotification = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.notifications.BY_ID(id),
			);

			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
			toast.success("Notification removed");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
