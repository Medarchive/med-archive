"use client";

import { IoMdClose, IoMdMenu } from "react-icons/io";
import Logo from "../ui/custom/Logo";
import { Button } from "../ui/button";
import { useHeaderStore } from "@/lib/stores/header-store";

export default function Header() {
	const { isOpen, openMenu, closeMenu } = useHeaderStore();

	return (
		<header className="bg-white fixed inset-x-0 top-0 z-50 shadowxs">
			<div className="custom-container flex justify-between items-center py-8">
				<div>
					<Logo />
				</div>

				<div
					className={`fixed bg-white/20 backdrop-blur-[2px] max-lg:inset-0 lg:static duration-500 ${isOpen ? "max-lg:translate-y-0" : "max-lg:-translate-y-full"}`}
				>
					<nav className="bg-white max-lg:min-h-[50vh] flex flex-col max-lg:pt-11.5 max-lg:pb-20 max-lg:px-10 max-lg:shadow-2xs lg:flex-row">
						<IoMdClose
							onClick={closeMenu}
							className="text-[35px] place-self-end lg:hidden cursor-pointer"
						/>

						<ul className="place-self-center max-lg:mt-10 flex flex-col gap-6 items-center lg:flex-row">
							<li className="hover:font-semibold hover:text-primary duration-150">
								<a href="" onClick={closeMenu}>
									Home
								</a>
							</li>

							<li className="hover:font-semibold hover:text-primary duration-150">
								<a href="" onClick={closeMenu}>
									About
								</a>
							</li>

							<li className="hover:font-semibold hover:text-primary duration-150">
								<a href="" onClick={closeMenu}>
									How it Works
								</a>
							</li>

							<li className="hover:font-semibold hover:text-primary duration-150">
								<a href="" onClick={closeMenu}>
									Services
								</a>
							</li>

							<li className="hover:font-semibold hover:text-primary duration-150">
								<a href="" onClick={closeMenu}>
									Contact Us
								</a>
							</li>
						</ul>

						<div className="lg:hidden place-self-center mt-8.5 flex flex-col gap-3 items-center">
							<Button onClick={closeMenu}>Get Started</Button>

							<Button variant="ghost" onClick={closeMenu}>
								Login
							</Button>
						</div>
					</nav>
				</div>

				<div>
					<IoMdMenu
						onClick={openMenu}
						className="text-2xl sm:text-3xl lg:hidden cursor-pointer"
					/>

					<div className="hidden lg:flex gap-3 items-center">
						<Button variant="ghost">Login</Button>
						<Button>Get Started</Button>
					</div>
				</div>
			</div>
		</header>
	);
}

// import { IoMdClose, IoMdMenu } from "react-icons/io";
// import Logo from "../ui/custom/Logo";
// import { Button } from "../ui/button";

// export default function Header() {
// 	return (
// 		<header className="bg-white fixed inset-x-0 top-0">
// 			<div className="custom-container bg-white flex justify-between items-center py-8">
// 				<div>
// 					<Logo />
// 				</div>
// 				<div className="fixed bg-white/20 inset-0 lg:static">
// 					<nav className="bg-white max-lg:min-h-[50vh] flex flex-col max-lg:pt-11.5 max-lg:px-10 lg:flex-row">
// 						<IoMdClose className="text-[35px] place-self-end lg:hidden" />
// 						<ul className="place-self-center max-lg:mt-10 flex flex-col gap-6 items-center lg:flex-row">
// 							<li className="hover:font-semibold hover:text-primary duration-150">
// 								<a href="">Home</a>
// 							</li>
// 							<li className="hover:font-semibold hover:text-primary duration-150">
// 								<a href="">About</a>
// 							</li>
// 							<li className="hover:font-semibold hover:text-primary duration-150">
// 								<a href="">How it Works</a>
// 							</li>
// 							<li className="hover:font-semibold hover:text-primary duration-150">
// 								<a href="">Services</a>
// 							</li>
// 							<li className="hover:font-semibold hover:text-primary duration-150">
// 								<a href="">Contact Us</a>
// 							</li>
// 						</ul>

// 						<div className="lg:hidden place-self-center mt-8.5 flex flex-col gap-3 items-center">
// 							<Button>Get Started</Button>
// 							<Button variant="ghost">Login</Button>
// 						</div>
// 					</nav>
// 				</div>
// 				<div className="">
// 					<IoMdMenu className="text-2xl sm:text-3xl lg:hidden" />
// 					<div className="flex gap-3 items-center">
// 						<Button variant="ghost">Login</Button>
// 						<Button>Get Started</Button>
// 					</div>
// 				</div>
// 			</div>
// 		</header>
// 	);
// }
