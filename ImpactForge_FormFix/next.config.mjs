/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js"],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
      // This completely shields Vercel from trying to look inside the tesseract folder
      config.externals = [...(config.externals || []), 'tesseract.js'];
    }
    return config;
  },
};

export default nextConfig;
