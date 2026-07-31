interface StatCardProps {
	label: string;
	value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
	return (
		<div className="flex flex-col justify-between rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<p className="text-sm text-[#9B9B9B]">{label}</p>
			<p className="mt-4 text-2xl font-bold">{value}</p>
		</div>
	);
}
