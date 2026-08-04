/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "framer-motion",
      "recharts",
      "swiper",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/dashboard/team/projects",
      destination: "/dashboard/team",
      permanent: true,
    },
  ],
};

export default nextConfig;
