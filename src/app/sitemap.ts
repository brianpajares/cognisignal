import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://cognisignal.example";
  const paths = ["", "/how-it-works", "/faq", "/legal/privacy", "/legal/terms", "/legal/medical"];
  return ["es", "en", "pt"].flatMap((locale) => paths.map((path) => ({ url: `${base}/${locale}${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: path === "" ? 1 : .6 })));
}
