'use client'
import Logo from "../ui/custom/Logo";
import { Button } from "../ui/button";
import Image from "next/image";
import { pageRoutes } from "../../lib/config/routes";

export default function Footer() {
	return (
		<footer className="pt-20 sm:pt-32 md:pt-40 lg:pt-48">
			<div className="custom-container flex flex-col gap-14 sm:flex-row sm:gap-24 sm:justify-between">
				<div className="w-3/4 flex flex-col gap-4 max-w-112.5">
					<Logo />
					<p className="leading-[130%]">
						Store encrypted health records, grant consent-based access to
						healthcare providers, and protect your privacy using blockchain and
						Zero-Knowledge technology.
					</p>
					<Button href={pageRoutes.authRoutes.SIGN_UP}>Get Started</Button>
				</div>
				<div className="flex justify-between gap-5 sm:gap-24 max-sm:max-w-100">
					<ul className="flex flex-col gap-6 ">
						<li>
							<a href="#">About</a>
						</li>
						<li>
							<a href="#">Features</a>
						</li>
						<li>
							<a href="#">How it works</a>
						</li>
					</ul>

					<ul className="flex flex-col gap-6">
						<li>
							<a href="#">Terms</a>
						</li>
						<li>
							<a href="#">Contact</a>
						</li>
						<li>
							<a href="#">Documentation</a>
						</li>
						<li>
							<a href="#">Github</a>
						</li>
						<li>
							<a href="#">Privacy Policy</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="bg-[linear-gradient(to_top,rgba(0,128,58,0.27),#fff)] backdrop-blur-[191.3px] pt-20 pb-10 md:pb-20 md:mt-20">
				<div className="custom-container ">
					<Image
						alt="Med-Archive Logo"
						src="/images/logos/footer-logo.svg"
						className="h-full w-full object-contain md:-mb-20"
						height={1000}
						width={1000}
					/>
				</div>
			</div>
		</footer>
	);
}
