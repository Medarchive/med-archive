"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InputField from "../../../components/ui/custom/InputField";
import SelectField from "../../../components/ui/custom/SelectField";
import TableSkeleton from "../../../components/shared/skeletons/TableSkeleton";
import { recordTypeConfig, HealthRecordData } from "../../records/types";
import { useLookupPatient, useProviderProfile, PatientLookupParams } from "../hooks";
import ProviderRecordDetailModal from "./ProviderRecordDetailModal";
import RequestAccessModal from "./RequestAccessModal";

type IdentifierType = "careId" | "userId" | "email";

const identifierOptions = [
	{ label: "Care ID", value: "careId" },
	{ label: "User ID", value: "userId" },
	{ label: "Email", value: "email" },
];

const formatDate = (value?: string | null) => {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString();
};

export default function PatientLookupPage() {
	const [identifierType, setIdentifierType] = useState<IdentifierType>("careId");
	const [identifierValue, setIdentifierValue] = useState("");
	const [lastSearch, setLastSearch] = useState<PatientLookupParams | null>(null);
	const [selectedRecord, setSelectedRecord] = useState<HealthRecordData | null>(null);
	const [showRequestAccess, setShowRequestAccess] = useState(false);

	const { data: profile } = useProviderProfile();
	const { mutate: lookupPatient, data: result, isPending, reset } = useLookupPatient();

	const isVerified = !!profile?.verifiedAt;

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = identifierValue.trim();
		if (!trimmed) return;

		const params: PatientLookupParams = { [identifierType]: trimmed };
		setLastSearch(params);
		lookupPatient(params);
	};

	const handleNewSearch = () => {
		setIdentifierValue("");
		setLastSearch(null);
		reset();
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

						<div className="flex gap-2">
							<Button variant="ghost" onClick={handleNewSearch}>
								New Search
							</Button>

							<Button
								disabled={!isVerified}
								onClick={() => setShowRequestAccess(true)}
							>
								Request Access
							</Button>
						</div>
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

					<div className="rounded-[12px] border border-[#F5F5F5] bg-white p-5">
						<p className="mb-3 font-semibold">Accessible Records</p>

						{result.records.length === 0 ? (
							<p className="py-6 text-center text-sm text-[#9B9B9B]">
								No records accessible yet — request access above to view
								this patient&apos;s health records.
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full min-w-160 text-sm">
									<thead>
										<tr className="text-left text-xs text-[#9B9B9B]">
											<th className="whitespace-nowrap pb-3 pr-4 font-normal">
												Title
											</th>
											<th className="whitespace-nowrap pb-3 pr-4 font-normal">
												Type
											</th>
											<th className="whitespace-nowrap pb-3 font-normal text-right">
												Date
											</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-[#F5F5F5]">
										{result.records.map((record) => (
											<tr
												key={record.id}
												onClick={() => setSelectedRecord(record)}
												className="cursor-pointer duration-150 hover:bg-[#FAFAFA]"
											>
												<td className="whitespace-nowrap py-3 pr-4 font-medium">
													{record.title}
												</td>
												<td className="whitespace-nowrap py-3 pr-4 text-[#9B9B9B]">
													{recordTypeConfig[record.recordType].tabLabel}
												</td>
												<td className="whitespace-nowrap py-3 text-right text-[#9B9B9B]">
													{formatDate(record.recordDate ?? record.createdAt)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</div>
			)}

			<ProviderRecordDetailModal
				record={selectedRecord}
				onClose={() => setSelectedRecord(null)}
			/>

			{lastSearch && (
				<RequestAccessModal
					open={showRequestAccess}
					onClose={() => setShowRequestAccess(false)}
					patientIdentifier={lastSearch}
				/>
			)}
		</div>
	);
}
