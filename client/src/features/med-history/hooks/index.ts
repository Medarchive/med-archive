"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse } from "../../../types/api";
import { UpdateMedHistoryPayload } from "../types";

// Lives in the account section (Profile → Medical History), not onboarding
// — POST adds to whatever's already on file (PATCH would replace the whole
// set), which fits an edit-anytime screen better than a first-submission one.
export const useUpdateMedHistory = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (payload: UpdateMedHistoryPayload) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<unknown>>(
				apiRoutes.medHistory,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Medical history saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
