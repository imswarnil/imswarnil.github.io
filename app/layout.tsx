import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { PROFILE } from "@/lib/content";
import "./globals.css";

/* Self-hosted at build time by next/font, so the page paints without a
   round-trip to a third party and without a layout shift when it lands. */
const inter = Inter({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	display: "swap",
	variable: "--font-inter",
});

const SITE = "https://links.imswarnil.com";
const DESCRIPTION =
	"Every site, project, theme, post and video Swarnil Singhai has shipped — one page, live numbers, every link out.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE),
	title: `${PROFILE.name} — everything I build, on one page`,
	description: DESCRIPTION,
	alternates: { canonical: "/" },
	openGraph: {
		type: "website",
		siteName: PROFILE.name,
		title: `${PROFILE.name} — everything I build, on one page`,
		description: DESCRIPTION,
		url: SITE,
	},
	twitter: { card: "summary_large_image", site: `@${PROFILE.handle}` },
	icons: {
		icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='9' fill='%23f04e2e'/></svg>",
	},
};

export const viewport: Viewport = {
	themeColor: "#f04e2e",
	colorScheme: "light dark",
};

/**
 * Two decisions that must land before the first paint: which theme, and whether
 * this visit gets the boot animation. Both are attributes on <html>, and the
 * CSS does everything after that — so a slow or failed script can never leave
 * the page stuck behind a black screen.
 */
const BEFORE_PAINT = `(function(){var r=document.documentElement;
try{var t=localStorage.getItem('theme');if(t)r.setAttribute('data-theme',t)}catch(e){}
try{if(!sessionStorage.getItem('booted')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){r.setAttribute('data-boot','');sessionStorage.setItem('booted','1')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		/* suppressHydrationWarning: the script above stamps data-theme and
		   data-boot onto <html> before React ever runs, which is the whole
		   point of it — React must not treat that as a mismatch. */
		<html lang="en" className={inter.variable} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: BEFORE_PAINT }} />
			</head>
			<body>
				{/* A camcorder waking up. Entirely CSS — see globals.css. */}
				<div className="boot" aria-hidden="true">
					<div className="boot__screen">
						<span className="boot__crt" />
						<svg className="boot__mark" viewBox="0 0 40 40" fill="none">
							<rect x="1" y="1" width="38" height="38" rx="11" stroke="currentColor" strokeOpacity=".22" strokeWidth="1.5" />
							<circle cx="20" cy="20" r="6.5" fill="#f04e2e" />
							<circle cx="20" cy="20" r="11" stroke="#f04e2e" strokeOpacity=".4" strokeWidth="1.5" />
						</svg>
						<span className="boot__bar"><i /></span>
						<span className="boot__label t-label-sm">links.imswarnil.com</span>
					</div>
				</div>

				<a className="skip" href="#main">Skip to content</a>
				{children}
			</body>
		</html>
	);
}
