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
import { HealthRecordData, RecordProofData, RecordType } from "../types";

export const HEALTH_RECORDS_QUERY_KEY = ["health-records"];

interface HealthRecordsParams extends PaginationParams {
	recordType?: RecordType;
	startDate?: string;
	endDate?: string;
}

export const useHealthRecords = (params: HealthRecordsParams = {}) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...HEALTH_RECORDS_QUERY_KEY, params],
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<PaginatedData<HealthRecordData>>
			>(apiRoutes.healthRecords.BASE, { params });

			return data.data;
		},
	});
};

export const useHealthRecord = (id: string | null) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...HEALTH_RECORDS_QUERY_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<HealthRecordData>>(
				apiRoutes.healthRecords.BY_ID(id as string),
			);

			return data.data;
		},
		enabled: !!id,
	});
};

export const useCreateHealthRecord = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (formData: FormData) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<HealthRecordData>>(
				apiRoutes.healthRecords.BASE,
				formData,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: HEALTH_RECORDS_QUERY_KEY });
			toast.success(data.message || "Record uploaded successfully");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useDeleteHealthRecord = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.healthRecords.BY_ID(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: HEALTH_RECORDS_QUERY_KEY });
			toast.success(data.message || "Record deleted");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useRecordProof = (id: string | null) => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...HEALTH_RECORDS_QUERY_KEY, id, "proof"],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<RecordProofData>>(
				apiRoutes.healthRecords.PROOF(id as string),
			);

			return data.data;
		},
		enabled: !!id,
		retry: false,
	});
};

export const useVerifyRecordProof = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.post<
				ApiSuccessResponse<{ verified: boolean; proofHash?: string }>
			>(apiRoutes.healthRecords.VERIFY_PROOF(id));

			return data;
		},
		onSuccess: (data, id) => {
			queryClient.invalidateQueries({ queryKey: [...HEALTH_RECORDS_QUERY_KEY, id, "proof"] });
			toast.success(data.message || "Proof verified successfully");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error, "Proof pending or failed"));
		},
	});
};
