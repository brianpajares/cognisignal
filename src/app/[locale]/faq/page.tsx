import { SiteHeader, SiteFooter } from "@/components/SiteChrome";
export default async function Faq({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const { info } = (await import(`../../../../messages/${locale}.json`)).default;
  return <><SiteHeader locale={locale} /><main className="shell info-content"><p className="eyebrow">COGNISIGNAL</p><h1>{info.faqTitle}</h1>{[1,2,3].map((n) => <section key={n}><h2>{info[`faqQ${n}` as "faqQ1" | "faqQ2" | "faqQ3"]}</h2><p>{info[`faqA${n}` as "faqA1" | "faqA2" | "faqA3"]}</p></section>)}</main><SiteFooter locale={locale} /></>;
}
