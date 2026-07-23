"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { fadeUp, staggerContainer, viewport } from "@/lib/utils/animations";

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
				<motion.h2
					className="text-[28px] lg:text-[36px] text-center"
					variants={fadeUp}
					initial="hidden"
					whileInView="show"
					viewport={viewport}
				>
					Features
				</motion.h2>

				<motion.div
					className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-6.5 mt-12"
					variants={staggerContainer}
					initial="hidden"
					whileInView="show"
					viewport={viewport}
				>
					{features.map((f, i) => (
						<FeatureCard key={i} img={f.img} title={f.title} text={f.text} />
					))}
				</motion.div>
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
		<motion.div
			variants={fadeUp}
			className="place-self-center max-w-65.75 h-91.5 w-full bg-[#FCFCFC] p-2"
			whileHover={{
				y: -8,
				transition: { duration: 0.2 },
			}}
		>
			<div className="h-2/3 overflow-hidden">
				<Image
					alt="Feature"
					src={img}
					className="h-full w-full object-cover object-center"
					height={300}
					width={300}
				/>
			</div>

			<div className="pr-3">
				<h4 className="my-3 font-medium lg:text-xl">{title}</h4>

				<p className="text-sm lg:text-base">{text}</p>
			</div>
		</motion.div>
	);
}
