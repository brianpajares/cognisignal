import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
const keys = { privacy: ["privacyTitle", "privacyBody"], terms: ["termsTitle", "termsBody"], medical: ["medicalTitle", "medicalBody"] } as const;
export function generateStaticParams() { return Object.keys(keys).map((page) => ({ page })); }
export default async function LegalPage({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params; if (!(page in keys)) notFound();
  const [titleKey, bodyKey] = keys[page as keyof typeof keys]; const { info } = (await import(`../../../../../messages/${locale}.json`)).default;
  return <><SiteHeader locale={locale} /><main className="shell info-content"><p className="eyebrow">COGNISIGNAL · {page.toUpperCase()}</p><h1>{info[titleKey]}</h1><p>{info[bodyKey]}</p></main><SiteFooter locale={locale} /></>;
}
