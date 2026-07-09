/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js"],
  
  outputFileTracingIncludes: {
    // The wildcard tells Vercel to attach these modules to every backend route within the workspace root
    '/**/*': [
      'node_modules/tesseract.js-core/tesseract-core-simd.wasm',
      'node_modules/tesseract.js/src/worker-script/node/index.js'
    ],
  },
};

export default nextConfig;
