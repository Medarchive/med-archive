import { SearchX } from "lucide-react";
import Logo from "../components/ui/custom/Logo";
import { Button } from "../components/ui/button";
import { pageRoutes } from "../lib/config/routes";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
			<Logo />

			<span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
				<SearchX className="size-8" />
			</span>

			<div className="space-y-1">
				<h1 className="text-3xl font-bold">Page not found</h1>

				<p className="text-[#9B9B9B]">
					The page you&apos;re looking for doesn&apos;t exist or may have been
					moved.
				</p>
			</div>

			<Button href={pageRoutes.HOME}>Back to Home</Button>
		</div>
	);
}
