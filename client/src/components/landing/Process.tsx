"use client";
import { Button } from "../ui/button";
import Image from "next/image";
import { pageRoutes } from "../../lib/config/routes";
import { motion } from "framer-motion";
import {
	fadeLeft,
	fadeRight,
	fadeUp,
	staggerContainer,
	imageReveal,
	viewport,
} from "@/lib/utils/animations";

export default function Process() {
	const steps = [
		{
			title: "Create your Care ID",
			text: "Store encrypted health records, grant consent-based access to healthcare providers, and protect your privacy using blockchain and Zero-Knowledge technology.",
			id: 1,
		},
		{
			title: "Upload encrypted records",
			text: "Store encrypted health records, grant consent-based access to healthcare providers, and protect your privacy using blockchain and Zero-Knowledge technology.",
			id: 2,
		},
	];

	return (
		<section id="how">
			<div className="custom-container">
				<div className="min-h-[20vh] lg:min-h-[50vh] flex items-center justify-center">
					<motion.h1
						className="text-3xl sm:text-5xl lg:text-[64px] text-center lg:leading-[100%] lg:tracking-[-5%]"
						variants={fadeUp}
						initial="hidden"
						whileInView="show"
						viewport={viewport}
					>
						Built to <span className="text-primary">Improve</span> <br />
						Patient Doctor Relationship
					</motion.h1>
				</div>

				{/* Process */}
				<div className="pt-10 flex flex-col md:flex-row md:max-h-208 overflow-hidden gap-10 justify-between">
					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="show"
						viewport={viewport}
						className="flex flex-col gap-4 max-w-120 md:flex-1/2 max-md:mx-auto"
					>
						<motion.div variants={fadeLeft}>
							<div className="bg-black text-sm md:text-base py-1 px-2.5 md:py-2 md:px-4 w-fit rounded-full text-white">
								How it works
							</div>
						</motion.div>

						<motion.h2
							variants={fadeLeft}
							className="text-2xl font-medium md:text-3xl md:font-semibold"
						>
							Our Simple Processes
						</motion.h2>

						<motion.p variants={fadeLeft} className="md:text-xl">
							Store encrypted health records, grant consent-based access to
							healthcare providers, and protect your privacy using blockchain
							and Zero-Knowledge technology.
						</motion.p>

						<motion.div variants={fadeLeft}>
							<Button
								href={pageRoutes.authRoutes.SIGN_UP}
								className="md:mb-10 md:mt-8"
							>
								Get Started
							</Button>
						</motion.div>

						<motion.div
							variants={imageReveal}
							className="rounded-[14px] overflow-hidden lg:h-120"
						>
							<Image
								alt="Nurse checking patient's blood pressure"
								src="/images/process.png"
								height={1000}
								width={1000}
								className="object-cover h-full w-full"
							/>
						</motion.div>
					</motion.div>

					<motion.div
						variants={staggerContainer}
						initial="hidden"
						whileInView="show"
						viewport={viewport}
						className="flex max-md:mx-auto flex-col gap-10 mt-20 max-w-120 overflow-y-auto hide-scroll md:flex-1/2"
					>
						{steps.map((s) => (
							<Card key={s.id} text={s.text} title={s.title} id={s.id} />
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}

function Card({
	title,
	text,
	id,
}: {
	title: string;
	text: string;
	id: number;
}) {
	return (
		<motion.div
			variants={fadeRight}
			className="flex gap-2 w-full sm:gap-5 md:max-w-105.25 md:max-h-110"
		>
			<div className="bg-black rounded-full h-10 min-h-10 min-w-10 sm:w-12 sm:h-12 sm:min-w-12 sm:min-h-12 gap-4 flex text-white justify-center items-center font-medium">
				{id}
			</div>
			<div className="border border-[#dedede] rounded-[24px] px-5 py-10 min-h-80 sm:min-h-110">
				<h3 className="font-medium text-2xl mb-3.5">{title}</h3>
				<p>{text}</p>
			</div>
		</motion.div>
	);
}
