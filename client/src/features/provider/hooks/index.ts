"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse, PaginatedData, PaginationParams } from "../../../types/api";
import { ActivityLogEntry } from "../../admin/types";
import { HealthRecordData } from "../../records/types";
import {
	PatientLookupResult,
	ProviderProfileData,
	ProviderRecordRequestData,
	RequestRecordAccessPayload,
	UpdateProviderProfilePayload,
} from "../types";

export const PROVIDER_PROFILE_QUERY_KEY = ["provider", "profile"];
export const PROVIDER_ACTIVITY_QUERY_KEY = ["provider", "activity"];

export const useProviderProfile = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: PROVIDER_PROFILE_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ProviderProfileData>>(
				apiRoutes.providerProfile.BASE,
			);

			return data.data;
		},
	});
};

export const useUpdateProviderProfile = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: UpdateProviderProfilePayload) => {
			const { data } = await axiosAuth.patch<ApiSuccessResponse<ProviderProfileData>>(
				apiRoutes.providerProfile.BASE,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: PROVIDER_PROFILE_QUERY_KEY });
			toast.success(data.message || "Profile updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useUploadProviderPicture = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (file: File) => {
			const formData = new FormData();
			formData.append("file", file);

			const { data } = await axiosAuth.post<ApiSuccessResponse<ProviderProfileData>>(
				apiRoutes.providerProfile.PICTURE,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: PROVIDER_PROFILE_QUERY_KEY });
			toast.success(data.message || "Profile picture updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export interface PatientLookupParams {
	careId?: string;
	userId?: string;
	email?: string;
}

// A search action, not something tied to component mount — wrapped as a
// mutation (trigger-on-submit, get a result) even though it's a GET
// underneath, same as how this app treats other on-demand lookups.
export const useLookupPatient = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (params: PatientLookupParams) => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<PatientLookupResult>>(
				apiRoutes.providerProfile.PATIENT_RECORDS,
				{ params },
			);

			return data.data;
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "No patient found for those details"));
		},
	});
};

export const useRequestRecordAccess = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (payload: RequestRecordAccessPayload) => {
			const { data } = await axiosAuth.post<
				ApiSuccessResponse<ProviderRecordRequestData>
			>(apiRoutes.providerProfile.RECORD_REQUESTS, payload);

			return data;
		},
		onSuccess: (data) => {
			toast.success(data.message || "Access request sent");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

// On-demand "check status" for a single tracked request — same
// wrap-a-GET-as-a-mutation pattern as useLookupPatient, since it's
// triggered by a button click for a specific id rather than tied to
// mount. There's no plural GET for a provider's own requests (confirmed),
// so this is the only way to learn whether one's since been approved.
export const useRecordRequestStatus = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async (requestId: string) => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<ProviderRecordRequestData>
			>(apiRoutes.providerProfile.RECORD_REQUEST_BY_ID(requestId));

			return data.data;
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Couldn't check this request's status"));
		},
	});
};

// The actual access-controlled read path — distinct from
// PATIENT_RECORDS (patients/records, used by useLookupPatient), which
// returns full record data regardless of approval. Routing "view record"
// through this endpoint once a request is approved is real backend
// enforcement, not just choosing not to render something client-side.
export const useApprovedPatientRecords = (patientId: string | null) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: ["provider", "approved-records", patientId],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<HealthRecordData[]>>(
				apiRoutes.providerProfile.PATIENT_APPROVED_RECORDS(patientId as string),
			);

			return data.data;
		},
		enabled: !!patientId,
	});
};

export const useApprovedPatientRecord = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async ({
			patientId,
			recordId,
		}: {
			patientId: string;
			recordId: string;
		}) => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<HealthRecordData>>(
				apiRoutes.providerProfile.PATIENT_APPROVED_RECORD_BY_ID(patientId, recordId),
			);

			return data.data;
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "This record isn't accessible yet"));
		},
	});
};

export const useProviderActivity = (params: PaginationParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...PROVIDER_ACTIVITY_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<ActivityLogEntry>>
			>(apiRoutes.providerProfile.ACTIVITY, { params });

			return data.data;
		},
	});
};
