import Features from "../components/landing/Features";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Process from "../components/landing/Process";
import Why from "../components/landing/Why";

export default function Home() {
	return (
		<div className="pb-20">
			<Header />
			<Hero />
			<Why />
			<Features />
			<Process />
		</div>
	);
}
