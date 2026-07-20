import React from "react";
import { Button } from "../ui/button";

export default function Why() {
	return (
		<section className="bg-secondary lg:mt-24 py-13.5">
			<div className="custom-container flex flex-col lg:flex-row justify-between items-center gap-10.75">
				<div className="text-white flex flex-col gap-10.75 max-lg:items-center max-lg:text-center max-lg:mt-5">
					<Button variant="secondary">Get Started</Button>
					<h2 className="text-[36px] leading-[100%] lg:text-[48px]">
						Why <br className="lg:hidden" /> MedArchive <br /> Africa?
					</h2>
					<Button>Get Started</Button>
				</div>
				<div className="space-y-3 w-full max-w-xl">
					<WhyCard text="Patient-owned records" />
					<WhyCard text="Encrypted storage" />
					<WhyCard text="ZK privacy verification" />
					<WhyCard text="Provider access controls" />
					<WhyCard text="Stellar blockchain security" />
				</div>
			</div>
		</section>
	);
}

function WhyCard({ text }: { text: string }) {
	return (
		<div className="bg-[#f5f5f5] rounded-[12px] pl-6.5 pr-2 pt-7 pb-13 w-full">
			<h4 className="text-2xl">{text}</h4>
			<Button variant="ghost" className="px-0">
				Request Demo
			</Button>
		</div>
	);
}
