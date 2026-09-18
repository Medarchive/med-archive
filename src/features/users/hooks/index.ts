"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse, UserProfileData } from "../../../types/api";

export const CURRENT_USER_QUERY_KEY = ["users", "me"];

export const useCurrentUser = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: CURRENT_USER_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<UserProfileData>>(
				apiRoutes.users.ME,
			);

			return data.data;
		},
	});
};

export interface UpdateUserPayload {
	fullName?: string;
	email?: string;
	phone?: string;
	currentPassword?: string;
	newPassword?: string;
	specialty?: string;
	licenseNumber?: string;
}

export const useUpdateCurrentUser = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateUserPayload) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<UserProfileData>>(
				apiRoutes.users.ME,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
			toast.success(data.message || "Profile updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
