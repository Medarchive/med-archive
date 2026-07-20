import type { Metadata } from "next";
import { Mulish, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const mulish = Mulish({
	variable: "--font-mulish",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Med Archive",
		template: "%s | Med Archive",
	},
	description:
		"Own your health records securely across Africa. Med Archive empowers patients to securely store encrypted medical records, grant consent-based access to healthcare providers, and protect their privacy using blockchain and Zero-Knowledge technology.",
	keywords: [
		"Med Archive",
		"electronic health records",
		"EHR",
		"medical records",
		"health records",
		"patient portal",
		"digital health",
		"healthcare",
		"medical data",
		"blockchain healthcare",
		"zero knowledge proofs",
		"privacy",
		"health data security",
		"consent management",
		"African healthcare",
		"hospital records",
		"medical history",
		"encrypted health records",
	],
	authors: [{ name: "Med Archive" }],
	creator: "Med Archive",
	metadataBase: new URL("https://medarchive.com"), // Replace with your production domain
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://medarchive.com",
		siteName: "Med Archive",
		title: "Med Archive — Own Your Health Records",
		description:
			"Securely store your medical records, control who can access them, and protect your health data with blockchain and Zero-Knowledge technology.",
		images: [
			{
				url: "/images/logos/hero_preview.png", // 1200x630 Open Graph image
				width: 1200,
				height: 630,
				alt: "Med Archive",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Med Archive — Own Your Health Records",
		description:
			"Secure digital health records with consent-based sharing, blockchain security, and Zero-Knowledge privacy.",
		images: ["/images/logos/hero_preview.png"],
		creator: "@medarchive", // Replace with your actual X handle
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
		},
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/images/logos/favicon_io/favicon-16x16.png",
		apple: "/images/logos/favicon_io/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				mulish.variable,
				"font-sans",
				geist.variable,
			)}
		>
			<body className="min-h-full">{children}</body>
		</html>
	);
}
