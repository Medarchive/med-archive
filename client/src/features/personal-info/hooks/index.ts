"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { pageRoutes } from "../../../lib/config/routes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse } from "../../../types/api";
import {
	PersonalInfoData,
	PersonalInfoFormValues,
	PersonalInfoPayload,
} from "../types";

export const PERSONAL_INFO_QUERY_KEY = ["personal-info"];

// Maps the shared PersonalInfoSchema form shape to the API's PersonalInfoDto.
export const toPersonalInfoPayload = (
	values: PersonalInfoFormValues,
): PersonalInfoPayload => ({
	firstName: values.first_name,
	middleName: values.middle_name || undefined,
	lastName: values.last_name,
	gender: values.gender === "male" ? "MALE" : "FEMALE",
	dateOfBirth: values.date_of_birth,
	phone: `${values.dial_code}${values.phone_number}`,
	addressLine1: values.address_line_1,
	addressLine2: values.address_line_2 || undefined,
	city: values.city,
	region: values.state,
	postcode: values.postal_code,
	country: values.country,
});

export const usePersonalInfo = (options?: { enabled?: boolean }) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: PERSONAL_INFO_QUERY_KEY,
		queryFn: async () => {
			try {
				const { data } = await axiosAuth.get<
					ApiSuccessResponse<PersonalInfoData>
				>(apiRoutes.personalInfo);

				return data.data;
			} catch (error) {
				// Not submitted yet — treat as "no data" rather than an error.
				if (isAxiosError(error) && error.response?.status === 404) {
					return null;
				}

				throw error;
			}
		},
		enabled: options?.enabled ?? true,
		retry: false,
	});
};

export const useCreatePersonalInfo = () => {
	const router = useRouter();
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: PersonalInfoPayload) => {
			const { data } = await axiosAuth.post<
				ApiSuccessResponse<PersonalInfoData>
			>(apiRoutes.personalInfo, payload);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: PERSONAL_INFO_QUERY_KEY });
			toast.success(data.message || "Personal information saved");
			router.push(pageRoutes.authRoutes.MEDICAL_HISTORY);
		},
		onError: (error) => {
			// Already submitted (e.g. revisited via back button) — don't block
			// the flow, just move on to the next onboarding step.
			if (isAxiosError(error) && error.response?.status === 409) {
				toast.message("Personal information already saved");
				router.push(pageRoutes.authRoutes.MEDICAL_HISTORY);
				return;
			}

			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useUpdatePersonalInfo = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: Partial<PersonalInfoPayload>) => {
			const { data } = await axiosAuth.patch<
				ApiSuccessResponse<PersonalInfoData>
			>(apiRoutes.personalInfo, payload);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: PERSONAL_INFO_QUERY_KEY });
			toast.success(data.message || "Personal information updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
