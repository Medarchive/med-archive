interface EmergencyContactCardProps {
	name: string;
	relationship: string;
	contactNumber: string;
}

export default function EmergencyContactCard({
	name,
	relationship,
	contactNumber,
}: EmergencyContactCardProps) {
	return (
		<div className="rounded-[12px] border border-error/20 bg-error/5 p-5 w-full">
			<h3 className="font-semibold text-error">Emergency Contact</h3>

			<div className="mt-4 space-y-3 text-sm">
				<div>
					<p className="text-[#9B9B9B]">Emergency Contact Name</p>
					<p className="font-semibold">{name}</p>
				</div>

				<div>
					<p className="text-[#9B9B9B]">Relationship</p>
					<p className="font-semibold">{relationship}</p>
				</div>

				<div>
					<p className="text-[#9B9B9B]">Contact Number</p>
					<p className="font-semibold">{contactNumber}</p>
				</div>
			</div>
		</div>
	);
}
