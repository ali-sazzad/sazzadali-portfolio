import type { NextConfig } from "next";

/**
 * Two deploy targets share one codebase:
 *  - Vercel (default): full Next.js build with image optimisation.
 *  - GitHub Pages (GITHUB_PAGES=true): static export served from /<repo-name>.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? "/sazzadali-portfolio" : "";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
  }),
  images: {
    unoptimized: isGithubPages,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_DEPLOY_TARGET: isGithubPages ? "github-pages" : "vercel",
  },
};

export default nextConfig;
