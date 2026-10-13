"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export function Brand({ locale }: { locale: string }) { return <Link className="brand" href={`/${locale}`}><span className="brand-mark" aria-hidden="true">c</span><span>CogniSignal</span></Link>; }
export function SiteHeader({ locale }: { locale: string }) {
  const t = useTranslations("nav");
  return <header className="shell topbar"><Brand locale={locale} /><nav className="nav" aria-label={t("language")}><Link href={`/${locale}/how-it-works`}>{t("how")}</Link><Link href={`/${locale}/faq`}>{t("faq")}</Link><div className="language-switch" aria-label={t("language")}>
    {(["es", "en", "pt"] as const).map((code) => <Link key={code} href={`/${code}`} aria-current={locale === code ? "page" : undefined}>{code.toUpperCase()}</Link>)}
  </div><Link className="button" href={`/${locale}`}>{t("start")}</Link></nav></header>;
}
export function SiteFooter({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  return <footer className="footer" lang={locale}><div className="shell footer-inner"><span>© {new Date().getFullYear()} CogniSignal · {t("disclaimer")}</span><nav className="footer-links" aria-label={t("language")}><Link href={`/${locale}/how-it-works`}>{t("method")}</Link><Link href={`/${locale}/faq`}>{t("faq")}</Link><Link href={`/${locale}/legal/privacy`}>{t("privacy")}</Link><Link href={`/${locale}/legal/terms`}>{t("terms")}</Link><Link href={`/${locale}/legal/medical`}>{t("medical")}</Link></nav></div></footer>;
}
