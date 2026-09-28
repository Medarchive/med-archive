"use client";

import { useQuery } from "@tanstack/react-query";
import { useAxiosAuth } from "../../../hooks/useAxiosAuth";
import { apiRoutes } from "../../../lib/config/apiRoutes";
import { ApiSuccessResponse } from "../../../types/api";
import { DashboardData } from "../types";

export const DASHBOARD_QUERY_KEY = ["dashboard"];

// The backend caches this per user for 5 minutes and clears that cache on
// any profile/records/contacts/proof mutation. A proof finishing generation
// in the background may not count as one, so polling a PENDING proof here
// can keep returning the cached PENDING until the TTL runs out — the
// Clinical Proofs page polls GET /clinical-proofs instead, which isn't
// cached. Kept at a gentler interval than that page for the same reason.
const PENDING_POLL_INTERVAL_MS = 10000;

export const useDashboard = () => {
	const axiosAuth = useAxiosAuth();

	return useQuery({
		queryKey: DASHBOARD_QUERY_KEY,
		queryFn: async () => {
			const { data } = await axiosAuth.get<ApiSuccessResponse<DashboardData>>(
				apiRoutes.dashboard,
			);

			return data.data;
		},
		refetchInterval: (query) =>
			query.state.data?.recentClinicalProofs?.some((proof) => proof.status === "PENDING")
				? PENDING_POLL_INTERVAL_MS
				: false,
	});
};
