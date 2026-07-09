/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configures the server environment to keep tesseract unbundled
  serverExternalPackages: ["tesseract.js"],
  
  // Silences the Next.js 16 Turbopack migration warning flag
  turbopack: {},
};

export default nextConfig;
