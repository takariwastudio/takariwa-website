import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/lp"],
      },
    ],
    sitemap: "https://takariwa.studio/sitemap.xml",
  };
}
