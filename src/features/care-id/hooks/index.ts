"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { getApiErrorMessage } from "../../../lib/utils";
import { ApiSuccessResponse } from "../../../types/api";
import { CareIdData, ShareLinkData } from "../types";

export const CARE_ID_QUERY_KEY = ["care-id"];

// POST /care-id is documented as idempotent — it returns the existing Care
// ID if one's already been generated, or creates one otherwise. That makes
// it double as this screen's "fetch or ensure it exists" read, so there's
// no separate create/read branching needed here.
export const useCareId = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: CARE_ID_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<CareIdData>>(
				apiRoutes.careId.BASE,
			);

			return data.data;
		},
	});
};

export const useGenerateShareLink = () => {
	const axiosAuth = useAxiosAuth();

	return useMutation({
		mutationFn: async () => {
			const { data } = await axiosAuth.post<ApiSuccessResponse<ShareLinkData>>(
				apiRoutes.careId.SHARE_LINK,
			);

			return data;
		},
		onError: (error) => {
			toast.error(getApiErrorMessage(error));
		},
	});
};
