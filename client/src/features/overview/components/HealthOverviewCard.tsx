const healthOverview = [
	{ label: "Blood Group", value: "O+" },
	{ label: "Allergies", value: "None" },
	{ label: "Conditions", value: "Normal" },
	{ label: "Medication", value: "ART Treatment" },
	{ label: "Test", value: "RVS" },
	{ label: "Scan", value: "CT Scan" },
];

export default function HealthOverviewCard() {
	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">Health Overview</h3>

			<div className="mt-4 flex-1 divide-y divide-[#F5F5F5]">
				{healthOverview.map((item) => (
					<div
						key={item.label}
						className="flex items-center justify-between py-3 text-sm"
					>
						<span className="text-[#9B9B9B]">{item.label}</span>
						<span className="font-semibold">{item.value}</span>
					</div>
				))}
			</div>

			<p className="mt-4 text-sm font-semibold text-primary">
				Last Updated: Today
			</p>
		</div>
	);
}
