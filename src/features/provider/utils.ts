import { describeRequestedItem } from "../provider-request/utils";
import { ProviderRecordRequestData } from "./types";

// A REVOKED row keeps its audit trail but the backend nulls `record`, so
// that case is called out explicitly rather than falling through to
// "General request" and reading as if nothing specific was ever asked for.
export const describeProviderRequestedItem = (request: ProviderRecordRequestData) => {
	if (request.status === "REVOKED" && !request.proofType) return "Access revoked";
	return describeRequestedItem(request) ?? "General request";
};
