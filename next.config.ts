import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/inventory/new",
        destination: "/dashboard/products/add",
        permanent: true,
      },
      {
        source: "/admin/inventory",
        destination: "/dashboard/products",
        permanent: true,
      },
      {
        source: "/admin",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
