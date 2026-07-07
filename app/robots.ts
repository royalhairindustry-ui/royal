import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/signin",
          "/signup",
          "/cart",
          "/checkout",
          "/wishlist",
          "/track-order",
        ],
      },
    ],
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
