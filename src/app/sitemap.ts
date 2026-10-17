import type { MetadataRoute } from "next";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/shop",
    "/faq",
    "/about",
    "/checkout",
    "/legal/terms",
    "/legal/privacy",
    "/legal/accessibility",
    "/en",
    "/warranty/activate",
    "/specs",
    "/anc",
    "/support",
  ];
  return paths.map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/shop" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.5,
  }));
}
