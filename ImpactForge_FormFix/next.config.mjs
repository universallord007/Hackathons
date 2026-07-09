/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["tesseract.js"],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './node_modules/tesseract.js-core/tesseract-core-simd.wasm',
      './node_modules/tesseract.js/src/worker-script/node/index.js'
    ],
  },
};

export default nextConfig;
