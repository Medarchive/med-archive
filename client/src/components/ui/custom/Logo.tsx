import Image from "next/image";
import Link from "next/link";

const Logo = () => {
	return (
		<Link href="/" className="block w-26.75 md:w-30">
			<Image
				src="/images/logos/logo.svg"
				className="h-full w-full object-contain"
				height={100}
				width={100}
				alt="Med Archive Logo"
			/>
		</Link>
	);
};

export default Logo;
