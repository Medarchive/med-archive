'use client'
import { Button } from "../ui/button";
import Image from "next/image";
import { pageRoutes } from "../../lib/config/routes";

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
					<h1 className="text-3xl sm:text-5xl lg:text-[64px] text-center lg:leading-[100%] lg:tracking-[-5%]">
						Built to <span className="text-primary">Improve</span> <br />
						Patient Doctor Relationship
					</h1>
				</div>

				{/* Process */}
				<div className="pt-10 flex flex-col md:flex-row md:max-h-208 overflow-hidden gap-10 justify-between">
					<div className="flex flex-col gap-4 max-w-120 md:flex-1/2 max-md:mx-auto">
						<div className="bg-black text-sm md:text-base py-1 px-2.5 md:py-2 md:px-4 w-fit rounded-full text-white">
							How it works
						</div>
						<h2 className="text-2xl font-medium md:text-3xl md:font-semibold">
							Our Simple Processes
						</h2>
						<p className="md:text-xl">
							Store encrypted health records, grant consent-based access to
							healthcare providers, and protect your privacy using blockchain
							and Zero-Knowledge technology.
						</p>
						<Button href={pageRoutes.authRoutes.SIGN_UP} className="md:mb-10 md:mt-8">Get Started</Button>

						<div className="rounded-[14px] overflow-hidden lg:h-120">
							<Image
								alt="Nurse checking patient's blood pressure"
								src="/images/process.png"
								height={1000}
								width={1000}
								className="object-cover h-full w-full"
							/>
						</div>
					</div>
					<div className="flex max-md:mx-auto flex-col gap-10 mt-20 max-w-120 overflow-y-auto hide-scroll md:flex-1/2">
						{steps.map((s) => (
							<Card key={s.id} text={s.text} title={s.title} id={s.id} />
						))}
					</div>
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
		<div className="flex gap-2 w-full sm:gap-5 md:max-w-105.25 md:max-h-110">
			<div className="bg-black rounded-full h-10 min-h-10 min-w-10 sm:w-12 sm:h-12 sm:min-w-12 sm:min-h-12 gap-4 flex text-white justify-center items-center font-medium">
				{id}
			</div>
			<div className="border border-[#dedede] rounded-[24px] px-5 py-10 min-h-80 sm:min-h-110">
				<h3 className="font-medium text-2xl mb-3.5">{title}</h3>
				<p>{text}</p>
			</div>
		</div>
	);
}
