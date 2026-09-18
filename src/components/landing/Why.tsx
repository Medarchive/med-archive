"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { pageRoutes } from "../../lib/config/routes";
import { fadeLeft, fadeUp, staggerContainer, viewport } from "../../lib/utils/animations";


export default function Why() {
	return (
		<section id="about" className="bg-secondary lg:mt-24 py-13.5">
			<div className="custom-container flex flex-col lg:flex-row justify-between items-center gap-10.75">
				<motion.div
					className="text-white flex flex-col gap-10.75 max-lg:items-center max-lg:text-center max-lg:mt-5"
					variants={staggerContainer}
					initial="hidden"
					whileInView="show"
					viewport={viewport}
				>
					<motion.div variants={fadeLeft}>
						<Button href={pageRoutes.authRoutes.SIGN_UP} variant="secondary">
							Get Started
						</Button>
					</motion.div>

					<motion.h2
						variants={fadeLeft}
						className="text-[36px] leading-[100%] lg:text-[48px]"
					>
						Why <br className="lg:hidden" /> MedArchive <br /> Africa?
					</motion.h2>

					<motion.div variants={fadeLeft}>
						<Button href={pageRoutes.authRoutes.SIGN_UP}>Get Started</Button>
					</motion.div>
				</motion.div>

				<motion.div
					className="space-y-3 w-full max-w-xl"
					variants={staggerContainer}
					initial="hidden"
					whileInView="show"
					viewport={viewport}
				>
					<WhyCard text="Patient-owned records" />
					<WhyCard text="Encrypted storage" />
					<WhyCard text="ZK privacy verification" />
					<WhyCard text="Provider access controls" />
					<WhyCard text="Stellar blockchain security" />
				</motion.div>
			</div>
		</section>
	);
}

function WhyCard({ text }: { text: string }) {
	return (
		<motion.div
			variants={fadeUp}
			className="bg-[#f5f5f5] rounded-[12px] pl-6.5 pr-2 pt-7 pb-13 w-full"
		>
			<h4 className="text-2xl">{text}</h4>

			<Button variant="ghost" className="px-0">
				Request Demo
			</Button>
		</motion.div>
	);
}
