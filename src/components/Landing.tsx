"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { AssessmentExperience } from "./AssessmentExperience";

export function Landing({ locale }: { locale: string }) {
  const [started, setStarted] = useState(false);
  const t = useTranslations("landing");
  if (started) return <AssessmentExperience locale={locale} />;
  return <><SiteHeader locale={locale} /><main>
    <section className="shell hero"><div className="hero-copy"><p className="eyebrow">{t("eyebrow")}</p><h1>{t("title")}</h1><p>{t("sub")}</p><button className="button" onClick={() => setStarted(true)}>{t("cta")} <span aria-hidden="true"> →</span></button><div className="hero-foot">◷ &nbsp;{t("time")}</div><div className="trust-row"><span className="trust-pill">✓ &nbsp;{t("trust1")}</span><span className="trust-pill">✓ &nbsp;{t("trust2")}</span><span className="trust-pill">✓ &nbsp;{t("trust3")}</span></div></div>
      <div className="hero-art" aria-hidden="true"><div className="art-orb"/><div className="signal-card"><small>PERSONAL CHANGE SIGNAL</small><strong>↗</strong><span>Observed over time</span><svg className="sparkline" viewBox="0 0 220 70"><path d="M2 52 C30 48 28 40 52 44 S75 31 93 38 S119 23 139 30 S174 15 218 19" fill="none" stroke="#176e58" strokeWidth="3" strokeLinecap="round"/><path d="M2 61H218" stroke="#dce5df"/></svg></div><div className="art-plant"><i className="leaf"/><i className="leaf"/><i className="leaf"/><i className="leaf"/></div></div>
    </section>
      <section className="how"><div className="shell"><div className="section-head"><p className="eyebrow">A CALM, PERSONAL APPROACH</p><h2>{t("howTitle")}</h2></div><div className="steps">{[1,2,3].map((i) => <article className="step-card" key={i}><span className="step-number">0{i}</span><h3>{t(`how${i}`)}</h3><p>{t(`how${i}b`)}</p></article>)}</div><div className="disclaimer">{t("note")}</div><div style={{ marginTop: 26 }}><Link className="text-link" href={`/${locale}/how-it-works`}>Explore the method →</Link></div></div></section>
  </main><SiteFooter locale={locale} /></>;
}
