import VerifyOtpForm from "../../../../../features/auth/components/VerifyOtpForm";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ email?: string }>;
}) {
	const { email } = await searchParams;

	return (
		<div className="mt-24 md:mt-36 lg:mt-48 flex items-center justify-center">
			<div className="sm:max-w-95">
				<div>
					<h3 className="font-semibold">Verify your Email</h3>

					<p className="text-sm text-[#9B9B9B] w-3/4 sm:text-base">
						A 6-digit code was sent to your email, please check{" "}
						<span className="font-semibold text-black">{email}</span>
					</p>
				</div>

				<VerifyOtpForm email={email ?? ""} />
			</div>
		</div>
	);
}
