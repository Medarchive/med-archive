import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";
import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Process from "../components/landing/Process";
import Why from "../components/landing/Why";

export default function Home() {
	return (
		<div className="">
			<Header />
			<Hero />
			<Why />
			<Features />
			<Process />
			<Footer />
		</div>
	);
}
