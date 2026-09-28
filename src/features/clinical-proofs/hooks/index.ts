"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse } from "../../../types/api";
import { DASHBOARD_QUERY_KEY } from "../../overview/hooks";
import {
	ClinicalProofData,
	ClinicalProofType,
	CreateClinicalProofPayload,
} from "../types";

export const CLINICAL_PROOFS_QUERY_KEY = ["clinical-proofs"];

// Proofs are generated in the background after POST, so anything still
// PENDING is polled until it lands on GENERATED or FAILED. Generation takes
// seconds, not minutes — a short interval keeps the status feeling live
// without hammering the API, and polling stops by itself once nothing is
// pending.
const PENDING_POLL_INTERVAL_MS = 3000;

export const useClinicalProofTypes = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: [...CLINICAL_PROOFS_QUERY_KEY, "types"],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ClinicalProofType[]>>(
				apiRoutes.clinicalProofs.TYPES,
			);

			return data.data;
		},
		// A static reference list on the backend — no reason to refetch it.
		staleTime: Infinity,
	});
};

// Not paginated — returns every proof, most recent first.
export const useClinicalProofs = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: CLINICAL_PROOFS_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ClinicalProofData[]>>(
				apiRoutes.clinicalProofs.BASE,
			);

			return data.data;
		},
		refetchInterval: (query) =>
			query.state.data?.some((proof) => proof.status === "PENDING")
				? PENDING_POLL_INTERVAL_MS
				: false,
	});
};

// The detail view — the only place `commitment` (once GENERATED) and
// `error` (once FAILED) are returned.
export const useClinicalProof = (id: string | null) => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: [...CLINICAL_PROOFS_QUERY_KEY, id],
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<ClinicalProofData>>(
				apiRoutes.clinicalProofs.BY_ID(id as string),
			);

			// Keep the list in step when this poll is what catches the status
			// change, rather than waiting for the list's own interval.
			if (data.data.status !== "PENDING") {
				queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
				queryClient.setQueryData<ClinicalProofData[]>(
					CLINICAL_PROOFS_QUERY_KEY,
					(proofs) =>
						proofs?.map((proof) =>
							proof.id === data.data.id ? { ...proof, ...data.data } : proof,
						),
				);
			}

			return data.data;
		},
		enabled: !!id,
		refetchInterval: (query) =>
			query.state.data?.status === "PENDING" ? PENDING_POLL_INTERVAL_MS : false,
	});
};

// A 400 here usually means the claim isn't true for the patient's own
// records (e.g. a blood group that doesn't match their profile) — the
// backend's message says which, so it's surfaced as-is.
export const useCreateClinicalProof = () => {
	const axiosAuth = useAxiosAuth();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateClinicalProofPayload) => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<ClinicalProofData>>(
				apiRoutes.clinicalProofs.BASE,
				payload,
			);

			return data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: CLINICAL_PROOFS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
			toast.success(data.message || "Clinical proof generation started");
		},
		onError: (error) => {
			toast.error(
				getApiErrorMessage(error, "Couldn't start generating that proof — try again"),
			);
		},
	});
};
