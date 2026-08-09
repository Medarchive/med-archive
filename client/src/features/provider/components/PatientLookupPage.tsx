"use client";

import { useState } from "react";
import { TriangleAlert, RefreshCw, Eye } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import { recordTypeConfig, HealthRecordData } from "../../records/types";
import { RequestStatus } from "../../provider-request/types";
import {
	useLookupPatient,
	useProviderProfile,
	useRecordRequestStatus,
	useApprovedPatientRecord,
	useApprovedPatientRecords,
	PatientLookupParams,
} from "../hooks";
import ProviderRecordDetailModal from "./ProviderRecordDetailModal";
import RequestAccessModal from "./RequestAccessModal";

type IdentifierType = "careId" | "userId" | "email";

const identifierOptions = [
	{ label: "Care ID", value: "careId" },
	{ label: "User ID", value: "userId" },
	{ label: "Email", value: "email" },
];

// Session-only — there's no plural GET for a provider's own record
// requests, so nothing here can be recovered after a page reload. "Check
// Status" against GET .../record-requests/{id} is the only way to learn
// whether one's since been approved.
interface TrackedRequest {
	requestId: string;
	recordId: string;
	title: string;
	status: RequestStatus;
}

const statusStyles: Record<RequestStatus, string> = {
	PENDING: "bg-amber-50 text-amber-800 border-amber-200",
	APPROVED: "bg-green-50 text-green-700 border-green-200",
	DECLINED: "bg-red-50 text-red-700 border-red-200",
	REVOKED: "bg-red-50 text-red-700 border-red-200",
};

export default function PatientLookupPage() {
	const [identifierType, setIdentifierType] = useState<IdentifierType>("careId");
	const [identifierValue, setIdentifierValue] = useState("");
	const [lastSearch, setLastSearch] = useState<PatientLookupParams | null>(null);
	const [selectedRecordId, setSelectedRecordId] = useState("");
	const [trackedRequests, setTrackedRequests] = useState<TrackedRequest[]>([]);
	const [showRequestAccess, setShowRequestAccess] = useState(false);
	const [viewingRecord, setViewingRecord] = useState<HealthRecordData | null>(null);

	const { data: profile } = useProviderProfile();
	const { mutate: lookupPatient, data: result, isPending, reset } = useLookupPatient();
	const { mutate: checkStatus, isPending: isCheckingStatus } = useRecordRequestStatus();
	const { mutate: fetchApprovedRecord, isPending: isFetchingRecord } =
		useApprovedPatientRecord();
	// The actual source of truth for "what am I already approved to see" —
	// queried fresh on every search, independent of trackedRequests below
	// (which only remembers what *this session* requested). Without this,
	// approvals from a prior visit, or ones that landed after leaving the
	// page, were invisible even though the backend already had them.
	const {
		data: approvedRecords,
		isLoading: isLoadingApproved,
		refetch: refetchApprovedRecords,
	} = useApprovedPatientRecords(result?.patient.id ?? null);

	const isVerified = !!profile?.verifiedAt;
	const selectedRecord = result?.records.find((r) => r.id === selectedRecordId);

	const recordOptions =
		result?.records.map((record) => ({
			label: `${record.title} (${recordTypeConfig[record.recordType].tabLabel})`,
			value: record.id,
		})) ?? [];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = identifierValue.trim();
		if (!trimmed) return;

		const params: PatientLookupParams = { [identifierType]: trimmed };
		setLastSearch(params);
		setSelectedRecordId("");
		setTrackedRequests([]);
		lookupPatient(params);
	};

	const handleNewSearch = () => {
		setIdentifierValue("");
		setLastSearch(null);
		setSelectedRecordId("");
		setTrackedRequests([]);
		reset();
	};

	const handleRequested = (requestId: string) => {
		if (!selectedRecord) return;

		setTrackedRequests((prev) => [
			...prev,
			{
				requestId,
				recordId: selectedRecord.id,
				title: selectedRecord.title,
				status: "PENDING",
			},
		]);
	};

	const handleCheckStatus = (requestId: string) => {
		checkStatus(requestId, {
			onSuccess: (data) => {
				setTrackedRequests((prev) =>
					prev.map((tracked) =>
						tracked.requestId === requestId
							? { ...tracked, status: data.status }
							: tracked,
					),
				);

				// So the newly-approved record shows up in "Approved Records"
				// immediately, instead of only after the next fresh search.
				if (data.status === "APPROVED") {
					refetchApprovedRecords();
				}
			},
		});
	};

	const handleViewRecord = (recordId: string) => {
		if (!result) return;

		fetchApprovedRecord(
			{ patientId: result.patient.id, recordId },
			{ onSuccess: (record) => setViewingRecord(record) },
		);
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold sm:text-3xl">Patient Lookup</h1>

			<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				<form
					onSubmit={handleSearch}
					className="flex flex-col gap-3 sm:flex-row sm:items-end"
				>
					<div className="w-full sm:w-48">
						<SelectField
							name="identifierType"
							label="Search by"
							value={identifierType}
							onChange={(e) =>
								setIdentifierType(e.target.value as IdentifierType)
							}
							options={identifierOptions}
						/>
					</div>

					<div className="flex-1">
						<InputField
							name="identifierValue"
							label=""
							placeholder={
								identifierType === "careId"
									? "e.g. MA-12345678"
									: identifierType === "email"
										? "patient@example.com"
										: "Patient user ID"
							}
							type="text"
							value={identifierValue}
							onChange={(e) => setIdentifierValue(e.target.value)}
						/>
					</div>

					<Button
						type="submit"
						isLoading={isPending}
						disabled={!identifierValue.trim()}
					>
						Search
					</Button>
				</form>
			</div>

			{isPending && <TableSkeleton rows={4} columns={3} />}

			{result && (
				<div className="space-y-4">
					<div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#F5F5F5] bg-white p-5">
						<div>
							<p className="text-lg font-semibold">{result.patient.fullName}</p>
							<p className="text-sm text-[#9B9B9B]">{result.patient.email}</p>
						</div>

						<Button variant="ghost" onClick={handleNewSearch}>
							New Search
						</Button>
					</div>

					{!isVerified && (
						<div className="flex items-start gap-2 rounded-[8px] border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
							<TriangleAlert className="mt-0.5 size-4 shrink-0" />
							<p>
								Your account isn&apos;t verified yet — an admin needs to
								verify you before you can request access to this
								patient&apos;s records.
							</p>
						</div>
					)}

					{/* Only names + types are ever shown here — not dates, not
					    descriptions, not files, even though the search response
					    technically includes them. Full content only becomes
					    visible via "View Record" below, once a request for that
					    specific record has actually been approved and fetched
					    through the access-controlled endpoint (not this one). */}
					<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
						<p className="mb-3 font-semibold">Request Access to a Record</p>

						{recordOptions.length === 0 ? (
							<p className="py-6 text-center text-sm text-[#9B9B9B]">
								No records found for this patient yet.
							</p>
						) : (
							<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
								<div className="flex-1">
									<SelectField
										name="selectedRecord"
										label="Record"
										placeholder="Select a record"
										value={selectedRecordId}
										onChange={(e) => setSelectedRecordId(e.target.value)}
										options={recordOptions}
									/>
								</div>

								<Button
									disabled={!isVerified || !selectedRecordId}
									onClick={() => setShowRequestAccess(true)}
								>
									Request Access
								</Button>
							</div>
						)}
					</div>

					<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
						<p className="mb-3 font-semibold">Approved Records</p>

						{isLoadingApproved ? (
							<p className="py-3 text-sm text-[#9B9B9B]">
								Checking approved access...
							</p>
						) : !approvedRecords || approvedRecords.length === 0 ? (
							<p className="py-6 text-center text-sm text-[#9B9B9B]">
								Nothing approved yet for this patient — request access to a
								record above.
							</p>
						) : (
							<div className="space-y-2">
								{approvedRecords.map((record) => (
									<div
										key={record.id}
										className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-[#F5F5F5] px-3 py-2"
									>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{record.title}
											</span>
											<span className="text-xs text-[#9B9B9B]">
												{recordTypeConfig[record.recordType].tabLabel}
											</span>
										</div>

										<Button
											size="sm"
											variant="ghost"
											isLoading={isFetchingRecord}
											onClick={() => handleViewRecord(record.id)}
										>
											<Eye className="size-3.5" />
											View Record
										</Button>
									</div>
								))}
							</div>
						)}
					</div>

					{trackedRequests.length > 0 && (
						<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
							<p className="mb-3 font-semibold">
								Requests Sent This Session
							</p>

							<div className="space-y-2">
								{trackedRequests.map((tracked) => (
									<div
										key={tracked.requestId}
										className="flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-[#F5F5F5] px-3 py-2"
									>
										<div className="flex items-center gap-2">
											<span className="text-sm font-medium">
												{tracked.title}
											</span>
											<span
												className={`rounded-full border px-2 py-0.5 text-xs font-medium ${statusStyles[tracked.status]}`}
											>
												{tracked.status}
											</span>
										</div>

										<div className="flex items-center gap-2">
											{tracked.status === "APPROVED" ? (
												<span className="text-xs text-[#9B9B9B]">
													See Approved Records above
												</span>
											) : (
												<Button
													size="sm"
													variant="ghost"
													isLoading={isCheckingStatus}
													onClick={() =>
														handleCheckStatus(tracked.requestId)
													}
												>
													<RefreshCw className="size-3.5" />
													Check Status
												</Button>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}

			<ProviderRecordDetailModal
				record={viewingRecord}
				onClose={() => setViewingRecord(null)}
			/>

			{lastSearch && selectedRecord && (
				<RequestAccessModal
					open={showRequestAccess}
					onClose={() => setShowRequestAccess(false)}
					patientIdentifier={lastSearch}
					recordId={selectedRecord.id}
					recordTitle={selectedRecord.title}
					onRequested={handleRequested}
				/>
			)}
		</div>
	);
}
