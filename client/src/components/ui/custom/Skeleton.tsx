export default function Skeleton({ className = "" }: { className?: string }) {
	return (
		<div
			className={`animate-pulse rounded-[6px] bg-[#F0F0F0] ${className}`}
		/>
	);
}
