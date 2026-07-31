import { SearchX } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { pageRoutes } from "../../../lib/config/routes";

export default function DashboardNotFound() {
	return (
		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-[12px] border border-dashed border-[#E5E5E5] px-4 text-center">
			<span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
				<SearchX className="size-7" />
			</span>

			<div className="space-y-1">
				<h2 className="text-xl font-semibold">Page not found</h2>
				<p className="text-[#9B9B9B]">
					This section doesn&apos;t exist or may have been moved.
				</p>
			</div>

			<Button href={pageRoutes.dashboardRoutes.DASHBOARD}>
				Back to Dashboard
			</Button>
		</div>
	);
}
