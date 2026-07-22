import Image from "next/image";
import React from "react";

export default function Features() {
	const features = [
		{
			title: "Care ID",
			text: "One secure identity for all healthcare interactions.",
			img: "/images/feature-1.png",
		},
		{
			title: "Encrypted Records",
			text: "Medical information remains encrypted at all times.",
			img: "/images/feature-2.png",
		},
		{
			title: "ZK Verification",
			text: "Prove health facts without revealing full records.",
			img: "/images/feature-3.png",
		},
		{
			title: "Provider Access",
			text: "Control who sees what and for how long.",
			img: "/images/feature-4.png",
		},
	];

	return (
		<section id="features" className="pt-11 lg:pt-23 pb-20 lg:pb-28">
			<div className="custom-container">
				<h2 className="text-[28px] lg:text-[36px] text-center">Features</h2>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-6.5 mt-12">
					{features.map((f, i) => (
						<FeatureCard key={i} img={f.img} title={f.title} text={f.text} />
					))}
				</div>
			</div>
		</section>
	);
}

function FeatureCard({
	title,
	text,
	img,
}: {
	img: string;
	title: string;
	text: string;
}) {
	return (
		<div className="place-self-center max-w-65.75 h-91.5 w-full bg-[#FCFCFC] p-2">
			<div className="h-2/3">
				<Image
					alt="Feature"
					src={img}
					className="h-full w-full object-cover object-center overflow-hidden"
					height={300}
					width={300}
				/>
			</div>
			<div className="pr-3">
				<h4 className="my-3 font-medium lg:text-xl">{title}</h4>
				<p className="text-sm lg:text-base">{text}</p>
			</div>
		</div>
	);
}
