import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Empty turbopack config to silence warning (FFmpeg.wasm works without special config)
  turbopack: {},
  
  // Required headers for FFmpeg.wasm to work properly
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
