import { getClinicalProofTypeLabel } from "../clinical-proofs/constants";

interface RequestTarget {
	record?: { title: string } | null;
	proofType?: string | null;
}

// What a record request is actually for — a specific record, a clinical
// disclosure proof, or null for a general request described only by its
// requestType. Shared by the patient's inbox and the provider's history.
export const describeRequestedItem = (request: RequestTarget) => {
	if (request.record) return request.record.title;
	if (request.proofType) return `${getClinicalProofTypeLabel(request.proofType)} proof`;
	return null;
};
