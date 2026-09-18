"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Image from "next/image";
import { pageRoutes } from "../../lib/config/routes";
import { fadeLeft, fadeUp, imageReveal, staggerContainer, viewport } from "../../lib/utils/animations";


export default function Hero() {
	return (
		<section className="pt-24 lg:pt-36 pb-13 lg:pb-16">
			<div className="custom-container flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-4">
				<motion.div
					className="max-lg:text-center px-4 flex flex-col gap-5 max-lg:mt-20 sm:w-2/3 sm:mx-auto lg:flex-1/3 lg:min-w-110"
					variants={staggerContainer}
					initial="hidden"
					whileInView="show"
					viewport={viewport}
				>
					<motion.h1
						variants={fadeLeft}
						className="text-[40px] sm:text-[48px] font-medium leading-[100%]"
					>
						Own Your Health Records Securely Across Africa
					</motion.h1>

					<motion.p
						variants={fadeLeft}
						className="max-sm:leading-[100%] text-base sm:text-lg"
					>
						Store encrypted health records, grant consent-based access to
						healthcare providers, and protect your privacy using blockchain and
						Zero-Knowledge technology.
					</motion.p>

					<motion.div
						variants={fadeUp}
						className="flex flex-col gap-3 items-center mt-6 md:flex-row max-lg:justify-center"
					>
						<Button href={pageRoutes.authRoutes.SIGN_UP}>Get Started</Button>

						<Button variant="ghost">Request Demo</Button>
					</motion.div>
				</motion.div>

				<motion.div
					className="max-lg:mx-auto lg:flex-2/3"
					variants={imageReveal}
					initial="hidden"
					whileInView="show"
					viewport={viewport}
				>
					<div className="h-88.5 lg:h-150 w-full overflow-hidden rounded-[10px] lg:rounded-tl-[20px] lg:rounded-bl-[20px] lg:rounded-tr-none lg:rounded-br-none">
						<Image
							loading="eager"
							src="/images/hero-img.png"
							alt="Picture Doctor and Patient Discussing"
							className="w-full h-full object-cover object-center"
							height={1000}
							width={1000}
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
