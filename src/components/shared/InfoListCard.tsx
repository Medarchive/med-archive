interface InfoListItem {
	label: string;
	value: string;
}

interface InfoListCardProps {
	title: string;
	items: InfoListItem[];
	footer?: string;
}

export default function InfoListCard({ title, items, footer }: InfoListCardProps) {
	return (
		<div className="flex flex-col rounded-[12px] border border-[#F5F5F5] bg-white p-5">
			<h3 className="font-semibold">{title}</h3>

			<div className="mt-4 flex-1 divide-y divide-[#F5F5F5]">
				{items.map((item) => (
					<div
						key={item.label}
						className="flex items-center justify-between py-3 text-sm"
					>
						<span className="text-[#9B9B9B]">{item.label}</span>
						<span className="font-semibold">{item.value}</span>
					</div>
				))}
			</div>

			{footer && (
				<p className="mt-4 text-sm font-semibold text-primary">{footer}</p>
			)}
		</div>
	);
}
