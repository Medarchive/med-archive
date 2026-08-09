"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse, PaginatedData, PaginationParams } from "../../../types/api";
import { MEDICAL_PROFILE_QUERY_KEY } from "../../medical-profile/hooks";
import { ConditionData, UpdateMedHistoryPayload } from "../types";

export const MEDICAL_CONDITIONS_QUERY_KEY = ["medical-conditions"];

// Any authenticated user can read this (only POST/PUT/DELETE on this same
// path are admin-gated) — lives here rather than in features/admin since
// it's the shared catalog both the admin management page and this app's
// own condition pickers (onboarding, Profile → Medical History) read from.
export const useMedicalConditions = (params: PaginationParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...MEDICAL_CONDITIONS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<ConditionData>>
			>(apiRoutes.medicalConditions.BASE, { params });

			return data.data;
		},
	});
};

// Lives in the account section (Profile → Medical History), not onboarding
// — POST adds to whatever's already on file (PATCH would replace the whole
// set), which fits an edit-anytime screen better than a first-submission one.
// NOTE: because POST is additive-only, unchecking a previously-saved
// condition in the picker and resubmitting won't remove it server-side —
// there's no client call to PATCH (full replace) or DELETE (remove specific
// ones) wired up yet. Flagging as a known gap rather than building it
// silently, same treatment as the access-request revoke gap elsewhere.
export const useUpdateMedHistory = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateMedHistoryPayload) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<unknown>>(
				apiRoutes.medHistory,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			// GET /api/v1/medical-profile is the only way to read back what's
			// on file (there's no GET for med-history itself) — invalidate it
			// so the "already saved" checkbox pre-selection stays in sync.
			queryClient.invalidateQueries({ queryKey: MEDICAL_PROFILE_QUERY_KEY });
			toast.success(data.message || "Medical history saved");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
