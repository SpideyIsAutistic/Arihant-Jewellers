import type { NextConfig } from "next";

// Static export for Firebase Hosting (free Spark plan): no server — data comes from Firestore in the browser.
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  experimental: {
    optimizePackageImports: ["clsx", "zustand"],
  },
};

export default nextConfig;
