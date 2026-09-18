"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse } from "../../../types/api";
import { EmergencyContactData, EmergencyContactPayload } from "../types";

export const EMERGENCY_CONTACTS_QUERY_KEY = ["emergency-contacts"];

export const useEmergencyContacts = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: EMERGENCY_CONTACTS_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<
				ApiSuccessResponse<EmergencyContactData[]>
			>(apiRoutes.emergencyContacts.BASE);

			return data.data ?? [];
		},
	});
};

export const useCreateEmergencyContact = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: EmergencyContactPayload) => {
			const { data } = await axiosAuth.post<
				ApiSuccessResponse<EmergencyContactData>
			>(apiRoutes.emergencyContacts.BASE, payload);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: EMERGENCY_CONTACTS_QUERY_KEY });
			toast.success(data.message || "Emergency contact added");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useUpdateEmergencyContact = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string;
			payload: Partial<EmergencyContactPayload>;
		}) => {
			const { data } = await axiosAuth.patch<
				ApiSuccessResponse<EmergencyContactData>
			>(apiRoutes.emergencyContacts.BY_ID(id), payload);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: EMERGENCY_CONTACTS_QUERY_KEY });
			toast.success(data.message || "Emergency contact updated");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};

export const useDeleteEmergencyContact = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { data } = await axiosAuth.delete<ApiSuccessResponse<unknown>>(
				apiRoutes.emergencyContacts.BY_ID(id),
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: EMERGENCY_CONTACTS_QUERY_KEY });
			toast.success(data.message || "Emergency contact removed");
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
