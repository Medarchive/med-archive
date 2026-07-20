import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function Process() {
	return (
		<section>
			<div className="custom-container">
				<div className="min-h-[20vh] lg:min-h-[50vh] flex items-center justify-center">
					<h1 className="text-3xl sm:text-5xl lg:text-[64px] text-center lg:leading-[100%] lg:tracking-[-5%]">
						Built to <span className="text-primary">Improve</span> <br />
						Patient Doctor Relationship
					</h1>
				</div>

				{/* Process */}
				<div className="pt-10">
					<div className="flex flex-col gap-4">
						<div className="bg-black text-sm py-1 px-2.5 w-fit rounded-full text-white">
							How it works
						</div>
						<h2 className="text-2xl font-medium">Our Simple Processes</h2>
						<p>
							Store encrypted health records, grant consent-based access to
							healthcare providers, and protect your privacy using blockchain
							and Zero-Knowledge technology.
						</p>
						<Button>Get Started</Button>

						<div className="rounded-[14px] overflow-hidden">
							<Image
								alt="Nurse checking patient's blood pressure"
								src="/images/process.png"
								height={1000}
								width={1000}
								className="object-cover h-full w-full"
							/>
						</div>
					</div>
					<div className="flex flex-col gap-10 mt-20">
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
						<Card />
					</div>
				</div>
			</div>
		</section>
	);
}

function Card() {
	return (
		<div className="flex gap-5">
			<div className="bg-black rounded-full h-10 min-h-10 min-w-10 sm:w-12 sm:h-12 sm:min-w-12 sm:min-h-12 gap-4 flex text-white justify-center items-center font-medium">
				1
			</div>
			<div className="border border-[#dedede] rounded-[24px] px-5 py-10 min-h-80 sm:min-h-110">
				<h3 className="font-medium text-2xl mb-3.5">Create your Care ID</h3>
				<p>
					Store encrypted health records, grant consent-based access to
					healthcare providers, and protect your privacy using blockchain and
					Zero-Knowledge technology.
				</p>
			</div>
		</div>
	);
}
