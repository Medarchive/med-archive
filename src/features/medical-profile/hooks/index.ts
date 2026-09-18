"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse } from "../../../types/api";
import { MedicalProfileData, UpdateMedicalProfilePayload } from "../types";

export const MEDICAL_PROFILE_QUERY_KEY = ["medical-profile"];

export const useMedicalProfile = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: MEDICAL_PROFILE_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<MedicalProfileData>>(
				apiRoutes.medicalProfile,
			);

			return data.data;
		},
	});
};

export const useUpdateMedicalProfile = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateMedicalProfilePayload) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<MedicalProfileData>>(
				apiRoutes.medicalProfile,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: MEDICAL_PROFILE_QUERY_KEY });
			toast.success(data.message || "Medical profile updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
