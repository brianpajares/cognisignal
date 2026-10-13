import { SiteHeader, SiteFooter } from "@/components/SiteChrome";

export default async function HowItWorks({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { info, landing, result } = (await import(`../../../../messages/${locale}.json`)).default;
  return <><SiteHeader locale={locale} /><main className="shell info-content"><p className="eyebrow">COGNISIGNAL · CS-LCM 1.0</p><h1>{info.howTitle}</h1><p>{info.howLead}</p><h2>1. {landing.how1}</h2><p>{landing.how1b}</p><h2>2. {landing.how2}</h2><p>{landing.how2b}</p><h2>3. {landing.how3}</h2><p>{landing.how3b}</p><p>{result.methodText}</p><div className="disclaimer">{landing.note}</div></main><SiteFooter locale={locale} /></>;
}
