import Logo from "../../../../components/ui/custom/Logo";
import { API_BASE_URL, buildSignedHeaders } from "../../../../lib/server/apiSigning";

interface SharedCareIdentity {
	[key: string]: unknown;
}

async function fetchSharedCareIdentity(
	token: string,
): Promise<SharedCareIdentity | null> {
	try {
		const res = await fetch(`${API_BASE_URL}/api/v1/care-id/view/${token}`, {
			headers: buildSignedHeaders(),
			cache: "no-store",
		});

		if (!res.ok) return null;

		const json = await res.json();
		return json.data ?? null;
	} catch {
		return null;
	}
}

const toLabel = (key: string) =>
	key
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (char) => char.toUpperCase())
		.trim();

export default async function Page({
	params,
}: {
	params: Promise<{ token: string }>;
}) {
	const { token } = await params;
	const data = await fetchSharedCareIdentity(token);

	if (!data) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
				<Logo />
				<h1 className="text-2xl font-bold">Link expired or invalid</h1>
				<p className="text-[#9B9B9B]">
					This shared Care ID link is no longer valid.
				</p>
			</div>
		);
	}

	const entries = Object.entries(data).filter(
		([, value]) => typeof value !== "object" || value === null,
	);

	return (
		<div className="mx-auto min-h-screen max-w-lg px-4 py-16">
			<Logo />

			<h1 className="mt-8 text-2xl font-bold">Shared Care Identity</h1>
			<p className="text-[#9B9B9B]">
				This is a read-only, time-limited view — it expires 24 hours after
				being shared.
			</p>

			<div className="mt-6 divide-y divide-[#F5F5F5] rounded-[12px] border border-[#F5F5F5] bg-white p-5">
				{entries.map(([key, value]) => (
					<div
						key={key}
						className="flex items-center justify-between gap-4 py-3 text-sm"
					>
						<span className="text-[#9B9B9B]">{toLabel(key)}</span>
						<span className="font-semibold break-all text-right">
							{String(value)}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
