import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Hero() {
	return (
		<section className="pt-24 lg:pt-36 pb-13 lg:pb-16">
			<div className="custom-container flex flex-col gap-14 lg:flex-row lg:items-center lg:gap-4">
				<div className="max-lg:text-center px-4 flex flex-col gap-5 max-lg:mt-20 sm:w-2/3 sm:mx-auto lg:flex-1/3 lg:min-w-110">
					<h1 className="text-[40px] sm:text-[48px] font-medium leading-[100%]">
						Own Your Health Records Securely Across Africa
					</h1>
					<p className="max-sm:leading-[100%] text-base sm:text-lg">
						Store encrypted health records, grant consent-based access to
						healthcare providers, and protect your privacy using blockchain and
						Zero-Knowledge technology.
					</p>

					<div className="flex flex-col gap-3 items-center mt-6 md:flex-row max-lg:justify-center">
						<Button>Get Started</Button>
						<Button variant="ghost">Request Demo</Button>
					</div>
				</div>
				<div className="max-lg:mx-auto lg:flex-2/3">
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
				</div>
			</div>
		</section>
	);
}
