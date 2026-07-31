interface ComingSoonProps {
	title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 rounded-[12px] border border-dashed border-[#E5E5E5] text-center">
			<h2 className="text-xl font-semibold">{title}</h2>
			<p className="text-[#9B9B9B]">This section is coming soon.</p>
		</div>
	);
}
