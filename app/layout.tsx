import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PROFILE } from "@/lib/content";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	variable: "--font-inter",
});

const SITE = "https://links.imswarnil.com";
const DESCRIPTION = "Every site, project, theme and post Swarnil Singhai has shipped — one page, every link.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE),
	title: `${PROFILE.name} — links`,
	description: DESCRIPTION,
	alternates: { canonical: "/" },
	openGraph: { type: "website", siteName: PROFILE.name, title: `${PROFILE.name} — links`, description: DESCRIPTION, url: SITE },
	twitter: { card: "summary", site: `@${PROFILE.handle}` },
	icons: {
		icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='9' fill='%23f04e2e'/></svg>",
	},
};

export const viewport: Viewport = { themeColor: "#f04e2e", colorScheme: "light dark" };

/* The theme has to be known before the first paint or the page flashes. */
const BEFORE_PAINT = `(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
