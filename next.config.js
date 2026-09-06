/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	// Avatars, Ghost feature images and YouTube thumbnails are all remote and
	// all resized by us, never by the Next image optimiser — the optimiser is a
	// server component that has to run somewhere, and on Workers that means
	// paying for Cloudflare Images to do a job a query string already does.
	images: { unoptimized: true },
};

module.exports = nextConfig;
