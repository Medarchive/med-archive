import Image from "next/image";
import Logo from "../../../../components/ui/custom/Logo";
import ResetPasswordForm from "../../../../features/auth/components/ResetPasswordForm";
import Link from "next/link";
import { pageRoutes } from "../../../../lib/config/routes";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ token?: string }>;
}) {
	const { token } = await searchParams;

	return (
		<div className="bg-red-40 h-full flex flex-col justify-center lg:flex-row lg:items-center lg:pt20 lg:pb20">
			<div className="flex-1 flex items-center">
				<div className="sm:max-w-105 w-full mx-auto sm:px-6">
					<div className="flex items-center justify-between max-lg:mt-24">
						<Logo />
						<Link
							href={pageRoutes.authRoutes.SIGN_IN}
							className="border hover:bg-primary hover:text-white py-1 px-2 text-sm rounded-[6px] border-[#F5F5F5] cursor-pointer duration-200"
						>
							Back to Sign In
						</Link>
					</div>

					<div className="mt-6.5">
						<h3 className="font-semibold">Reset Password</h3>
						<p className="text-sm text-[#9B9B9B]">
							Enter a new password for your account.
						</p>
					</div>

					<div>
						<ResetPasswordForm token={token ?? ""} />
					</div>
				</div>
			</div>

			<div className="hidden lg:flex flex-1 items-center justify-center p-8 ">
				<div className="w-full max-w-162.5 h-[80vh] overflow-hidden rounded-sm">
					<Image
						src="/images/auth-img.png"
						alt="Female Doctor Carrying out a test"
						width={1000}
						height={1000}
						className="h-full w-full object-cover"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
