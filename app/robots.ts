import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || "https://glamstep.luxury";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/account/orders/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
