import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    basePath: "/projects/Studyneant",

    // ADD THIS LINE RIGHT HERE:
    trailingSlash: true,

    images: {
        unoptimized: true,
    },
};

export default nextConfig;
