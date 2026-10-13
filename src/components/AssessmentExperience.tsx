"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { calculate, type AssessmentInput, type ModelOutput, type Session } from "@/lib/model";

type Profile = Omit<AssessmentInput, "sessions">;
type Stored = { profile: Profile; sessions: Session[]; consent?: { version: string; grantedAt: string } };
type Phase = "profile" | "memory" | "attention" | "executive" | "result";
const STORAGE_KEY = "cognisignal-v1-local";
const CONSENT_VERSION = "2026-10-13";
const wordPools = {
  es: ["jardín", "ventana", "plata", "río", "vela", "canasta", "nube", "botón", "naranja", "puente", "papel", "bosque", "bolsillo", "canica", "escalera", "isla"],
  en: ["garden", "window", "silver", "river", "candle", "basket", "cloud", "button", "orange", "bridge", "paper", "forest", "pocket", "marble", "ladder", "island"],
  pt: ["jardim", "janela", "prata", "rio", "vela", "cesta", "nuvem", "botão", "laranja", "ponte", "papel", "floresta", "bolso", "bolinha", "escada", "ilha"]
};
const colors = [{ name: "green", value: "#176e58" }, { name: "blue", value: "#2563eb" }, { name: "orange", value: "#be651e" }];
const colorWords = { es: { green: "VERDE", blue: "AZUL", orange: "NARANJA" }, en: { green: "GREEN", blue: "BLUE", orange: "ORANGE" }, pt: { green: "VERDE", blue: "AZUL", orange: "LARANJA" } };

const randomItems = <T,>(items: T[], count: number) => [...items].sort(() => Math.random() - 0.5).slice(0, count);
function normalQuantile(p: number): number {
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const plow = 0.02425;
  if (p < plow) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1); }
  if (p > 1 - plow) return -normalQuantile(1 - p);
  const q = p - 0.5; const r = q*q;
  return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
}
const percent = (n: number, total: number) => Math.max(0.5, Math.min(0.99, (n + 0.5) / (total + 1)));
const today = () => new Date().toISOString().slice(0, 10);

export function AssessmentExperience({ locale }: { locale: string }) {
  const a = useTranslations("assessment"); const r = useTranslations("result"); const c = useTranslations("common"); const g = useTranslations("gate");
  const [phase, setPhase] = useState<Phase>("profile");
  const [profile, setProfile] = useState<Profile>({ age_years: 65, country_code: "US", language: locale as Profile["language"], education_band: "secondary", context_issue: "none", self_report_change_6m: "unsure" });
  const taskWords = wordPools[profile.language];
  const [saved, setSaved] = useState<Stored | null>(null);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [targets, setTargets] = useState<string[]>([]);
  const [testWords, setTestWords] = useState<string[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [recognition, setRecognition] = useState({ hits: 0, falseAlarms: 0, correct: 0 });
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stimulus, setStimulus] = useState(false);
  const [round, setRound] = useState(0);
  const [execTrials, setExecTrials] = useState<{ word: string; color: string; isMatch: boolean }[]>([]);
  const [execTimes, setExecTimes] = useState<number[]>([]);
  const [execCorrect, setExecCorrect] = useState(0);
  const [reactionStart, setReactionStart] = useState(0);
  const [result, setResult] = useState<ModelOutput | null>(null);
  const [allSessions, setAllSessions] = useState<Session[]>([]);
  const stepNumber = phase === "profile" ? 1 : phase === "result" ? 4 : phase === "memory" ? 2 : phase === "attention" ? 3 : 4;
  const progressPct = phase === "profile" ? 22 : phase === "memory" ? 45 : phase === "attention" ? 69 : phase === "executive" ? 85 : 100;
  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) { const state = JSON.parse(raw) as Stored; const localized: Stored = { ...state, profile: { ...state.profile, language: locale as Profile["language"] } }; setSaved(localized); setProfile(localized.profile); setConsent(state.consent?.version === CONSENT_VERSION); } }
    catch { localStorage.removeItem(STORAGE_KEY); }
  }, [locale]);
  useEffect(() => {
    if (phase !== "attention" || round >= 5) return;
    setStimulus(false);
    const timer = window.setTimeout(() => { setStimulus(true); setReactionStart(performance.now()); }, 650 + Math.random() * 1050);
    return () => window.clearTimeout(timer);
  }, [phase, round]);
  useEffect(() => {
    if (phase !== "executive" || round >= execTrials.length) return;
    setStimulus(false);
    const timer = window.setTimeout(() => { setStimulus(true); setReactionStart(performance.now()); }, 500 + Math.random() * 650);
    return () => window.clearTimeout(timer);
  }, [phase, round, execTrials.length]);
  const output = useMemo(() => result, [result]);
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => setProfile((previous) => ({ ...previous, [key]: value }));
  const startMemory = () => { const chosen = randomItems(taskWords, 5); setTargets(chosen); setTestWords([]); setWordIndex(0); setRecognition({ hits: 0, falseAlarms: 0, correct: 0 }); setPhase("memory"); };
  const answerWord = (yes: boolean) => {
    const word = testWords[wordIndex]; const isTarget = targets.includes(word); const correct = yes === isTarget;
    setRecognition((old) => ({ hits: old.hits + (yes && isTarget ? 1 : 0), falseAlarms: old.falseAlarms + (yes && !isTarget ? 1 : 0), correct: old.correct + Number(correct) }));
    if (wordIndex + 1 >= testWords.length) { setPhase("attention"); setRound(0); setReactionTimes([]); }
    else setWordIndex((n) => n + 1);
  };
  const tapAttention = () => {
    if (!stimulus) return;
    const elapsed = performance.now() - reactionStart;
    const next = [...reactionTimes, elapsed]; setReactionTimes(next); setStimulus(false);
    if (next.length >= 5) {
      const trials = Array.from({ length: 5 }, () => { const wordColor = randomItems(colors, 1)[0]; const match = Math.random() > .45; const textColor = match ? wordColor : randomItems(colors.filter((item) => item.name !== wordColor.name), 1)[0]; return { word: colorWords[profile.language][wordColor.name as keyof typeof colorWords.es], color: textColor.value, isMatch: match }; });
      setExecTrials(trials); setRound(0); setExecTimes([]); setExecCorrect(0); setPhase("executive");
    } else setRound((n) => n + 1);
  };
  const answerExec = (isMatch: boolean) => {
    if (!stimulus) return;
    const expected = execTrials[round]; const elapsed = performance.now() - reactionStart;
    const correct = isMatch === expected.isMatch;
    const nextTimes = [...execTimes, Math.max(150, elapsed)]; const nextCorrect = execCorrect + Number(correct);
    setExecTimes(nextTimes); setExecCorrect(nextCorrect);
    if (round + 1 >= execTrials.length) {
      const accuracy = nextCorrect / execTrials.length;
      const memoryDprime = normalQuantile(percent(recognition.hits, targets.length)) - normalQuantile(percent(recognition.falseAlarms, testWords.length - targets.length));
      const meanRt = reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length;
      const ies = (nextTimes.reduce((sum, value) => sum + value, 0) / nextTimes.length) / Math.max(accuracy, .2);
      const quality = recognition.correct >= 4 && reactionTimes.filter((n) => n >= 150 && n <= 3000).length >= 3 && nextCorrect >= 3;
      const newSession: Session = { date: today(), memory_dprime: Math.max(-6, Math.min(6, memoryDprime)), attention_rt_ms: Math.max(150, Math.min(3000, meanRt)), executive_ies_ms: Math.max(150, Math.min(6000, ies)), quality_pass: quality };
      const previous = saved?.sessions ?? [];
      const list = [...previous, newSession].sort((x, y) => x.date.localeCompare(y.date));
      const updated: Stored = { profile, sessions: list, consent: saved?.consent ?? { version: CONSENT_VERSION, grantedAt: new Date().toISOString() } };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch { setError("This browser could not save the session on this device."); }
      setSaved(updated); setAllSessions(list);
      try { setResult(calculate({ ...profile, sessions: list })); } catch { setResult(null); }
      setPhase("result");
    } else { setStimulus(false); setRound((n) => n + 1); }
  };
  const nextFromProfile = () => {
    setError("");
    if (profile.age_years < 55 || profile.age_years > 90) { setError(a("errorAge")); return; }
    if ((saved?.sessions ?? []).some((session) => session.date === today())) { setError(a("sameDayError")); return; }
    if (!consent) { setError(a("consentRequired")); return; }
    const withConsent: Stored = { profile, sessions: saved?.sessions ?? [], consent: saved?.consent ?? { version: CONSENT_VERSION, grantedAt: new Date().toISOString() } };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(withConsent)); setSaved(withConsent); }
    catch { setError("This browser could not save your consent on this device."); return; }
    startMemory();
  };
  const countryNames: Record<Profile["country_code"], string> = { US: "countryUS", GB: "countryGB", ES: "countryES", BR: "countryBR", MX: "countryMX" };
  const educationNames: Record<Profile["education_band"], string> = { primary_or_less: "educationPrimary", secondary: "educationSecondary", tertiary: "educationTertiary" };
  const contextNames: Record<Profile["context_issue"], string> = { none: "contextNone", poor_sleep: "contextPoorSleep", acute_illness: "contextIllness", unusual_stress: "contextStress", medication_change: "contextMedication", other: "contextOther" };
  const changeNames: Record<Profile["self_report_change_6m"], string> = { no: "changeNo", unsure: "changeUnsure", yes: "changeYes" };
  return <><SiteHeader locale={locale} /><main className="shell page-main"><div className="app-grid"><section className="panel" aria-live="polite">
    {phase !== "result" && <><p className="eyebrow">{a("step", { current: stepNumber, total: 4 })}</p><div className="progress-track" aria-label={`${progressPct}% complete`}><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div></>}
    {phase === "profile" && <><h1 className="question">{a("age")}</h1><p className="muted">{a("ageHelp")}</p><div className="field"><label htmlFor="age">{a("ageLabel")}</label><input id="age" inputMode="numeric" type="number" min="55" max="90" value={profile.age_years} onChange={(event) => update("age_years", Number(event.target.value))}/></div><div className="field"><label htmlFor="country">{a("country")}</label><select id="country" value={profile.country_code} onChange={(event) => update("country_code", event.target.value as Profile["country_code"])}>{(Object.keys(countryNames) as Profile["country_code"][]).map((key) => <option key={key} value={key}>{c(countryNames[key])}</option>)}</select></div><div className="field"><label htmlFor="education">{a("education")}</label><select id="education" value={profile.education_band} onChange={(event) => update("education_band", event.target.value as Profile["education_band"])}>{(Object.keys(educationNames) as Profile["education_band"][]).map((key) => <option key={key} value={key}>{c(educationNames[key])}</option>)}</select></div><div className="field"><label htmlFor="context">{a("context")}</label><select id="context" value={profile.context_issue} onChange={(event) => update("context_issue", event.target.value as Profile["context_issue"])}>{(Object.keys(contextNames) as Profile["context_issue"][]).map((key) => <option key={key} value={key}>{c(contextNames[key])}</option>)}</select></div><div className="field"><label htmlFor="change">{a("change")}</label><select id="change" value={profile.self_report_change_6m} onChange={(event) => update("self_report_change_6m", event.target.value as Profile["self_report_change_6m"])}>{(Object.keys(changeNames) as Profile["self_report_change_6m"][]).map((key) => <option key={key} value={key}>{c(changeNames[key])}</option>)}</select></div><label className="check-row" style={{ marginTop: 24 }}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span className="note-small">{a("consent")}<br/>{a("consentDetails")}</span></label>{error && <p role="alert" style={{ color: "#9d3a2d" }}>{error}</p>}<div className="actions"><button className="button" onClick={nextFromProfile}>{a("begin")} →</button></div><p className="note-small">{a("quality")} {a("local")}</p></>}
    {phase === "memory" && <><p className="eyebrow">{a("memoryTitle")} · {wordIndex + 1}/{testWords.length || 5}</p><h1 className="question">{wordIndex === 0 && testWords.length === 0 ? a("memoryTitle") : a("recognize")}</h1><p className="muted">{wordIndex === 0 && testWords.length === 0 ? a("memoryIntro") : a("recognize")}</p>{testWords.length === 0 ? <><div className="word-grid">{targets.map((word) => <div className="word-chip" key={word}>{word}</div>)}</div><button className="button" onClick={() => { setTestWords([...targets, ...randomItems(taskWords.filter((word) => !targets.includes(word)), 3)].sort(() => Math.random() - .5)); setWordIndex(0); }}>{a("ready")}</button></> : <div className="task-box"><div className="stimulus">{testWords[wordIndex]}</div><p>{a("recognize")}</p><div className="actions" style={{ justifyContent: "center" }}><button className="button secondary" onClick={() => answerWord(false)}>{a("no")}</button><button className="button" onClick={() => answerWord(true)}>{a("yes")}</button></div></div>}</>}
    {phase === "attention" && <><p className="eyebrow">{a("attentionTitle")} · {Math.min(round + 1, 5)}/5</p><h1 className="question">{a("attentionTitle")}</h1><p className="muted">{a("attentionIntro")}</p><div className="task-box task-center"><div className="stimulus" aria-label={stimulus ? a("tap") : a("wait")}>{stimulus ? <span className="stimulus-dot"/> : <span aria-hidden="true">···</span>}</div><button className="button" onClick={tapAttention} disabled={!stimulus}>{stimulus ? a("tap") : a("wait")}</button></div></>}
    {phase === "executive" && <><p className="eyebrow">{a("executiveTitle")} · {round + 1}/5</p><h1 className="question">{a("executiveTitle")}</h1><p className="muted">{a("executiveIntro")}</p><div className="task-box task-center"><div className="color-word" style={{ color: execTrials[round]?.color }}>{execTrials[round]?.word}</div><div className="actions" style={{ justifyContent: "center" }}><button className="button secondary" disabled={!stimulus} onClick={() => answerExec(true)}>{a("match")}</button><button className="button" disabled={!stimulus} onClick={() => answerExec(false)}>{a("different")}</button></div></div></>}
    {phase === "result" && output && <ResultView output={output} sessions={allSessions} onNew={() => { setResult(null); setError(""); setPhase("profile"); }} onRequest={() => setModal(true)} t={r} />}
    {phase === "result" && !output && <><h1>{r("title")}</h1><p role="alert">{error || r("noScore")}</p><button className="button" onClick={() => setPhase("profile")}>{r("restart")}</button></>}
  </section><aside className="side-panel"><p className="eyebrow">{a("baseline")}</p><h3>{phase === "result" ? r("progress") : a("local")}</h3><p>{Math.min(saved?.sessions.filter((session) => session.quality_pass).length ?? 0, 6)} {r("of")}</p><div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, (saved?.sessions.filter((session) => session.quality_pass).length ?? 0) / 6 * 100)}%` }}/></div><p>{r("methodText")}</p></aside></div></main>{modal && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="report-title"><button aria-label={a("close")} className="text-link" style={{ float: "right", border: 0, background: "none", cursor: "pointer" }} onClick={() => setModal(false)}>✕</button><p className="eyebrow">COGNISIGNAL</p><h2 id="report-title">{g("title")}</h2><p className="muted">{g("description")}</p><div className="category" role="status">{g("offline")}</div><div className="actions"><button className="button secondary" onClick={() => setModal(false)}>{g("close")}</button></div></section></div>}<SiteFooter locale={locale} /></>;
}

function ResultView({ output, sessions, onNew, onRequest, t }: { output: ModelOutput; sessions: Session[]; onNew: () => void; onRequest: () => void; t: ReturnType<typeof useTranslations> }) {
  const scored = output.status === "scored";
  const valid = sessions.filter((session) => session.quality_pass);
  const domainStats = output.baseline_domain_stats ?? {};
  const recent = valid.at(-1);
  const domainFields: Record<string, keyof Session> = { memory: "memory_dprime", attention: "attention_rt_ms", executive: "executive_ies_ms" };
  const domainKeys: Record<string, string> = { memory: "memory", attention: "attention", executive: "executive" };
  const values = (output.monitoring_composite_z_series ?? []).slice(-12);
  const points = values.map((value, index) => `${24 + index * (252 / Math.max(1, values.length - 1))},${150 - Math.max(-3, Math.min(3, value)) * 28}`).join(" ");
  const title = output.category === "baseline_building" ? t("building") : output.category === "baseline_ready" ? t("ready") : output.category === "discuss_with_clinician" ? t("discuss") : output.category === "watch" ? t("watch") : t("stable");
  return <><p className="eyebrow">CS-LCM 1.0 · {output.valid_sessions} {t("sessions").toLowerCase()}</p><h1 className="question">{t("title")}</h1><div className={`category ${output.category === "watch" ? "watch" : output.category === "discuss_with_clinician" ? "discuss" : ""}`}>{title}</div><p className="muted" style={{ marginTop: 13 }}>{output.status === "baseline_building" ? t("building") : output.status === "baseline_ready" ? t("ready") : t("disclaimer")}</p>
    {scored && <><div className="metric-grid" style={{ marginTop: 23 }}><div className="metric-card"><small>{t("index")}</small><strong>{output.signal_index_0_100?.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 500 }}> / 100</span></strong></div><div className="metric-card"><small>{t("sessions")}</small><strong>{output.valid_sessions}</strong></div><div className="metric-card"><small>{t("excluded")}</small><strong>{output.quality_excluded_sessions}</strong></div></div><div className="signal-bar" role="img" aria-label={`${t("index")}: ${output.signal_index_0_100?.toFixed(1)} out of 100`}><span className="signal-marker" style={{ left: `${output.signal_index_0_100}%` }}/></div><div style={{ display: "flex", justifyContent: "space-between" }} className="note-small"><span>0</span><span>{t("watch")}</span><span>{t("discuss")}</span><span>100</span></div></>}
    {output.status === "baseline_building" && <div style={{ marginTop: 25 }}><strong>{Math.min(output.valid_sessions, 6)} {t("of")}</strong><div className="progress-track"><div className="progress-fill" style={{ width: `${Math.min(100, output.valid_sessions / 6 * 100)}%` }}/></div></div>}
    {values.length > 0 && <section className="method"><h3>{t("trend")}</h3><svg viewBox="0 0 300 175" className="chart" role="img" aria-label={`${t("trend")}: ${values.length} follow-up sessions`}><line x1="20" y1="66" x2="280" y2="66" className="chart-grid"/><line x1="20" y1="94" x2="280" y2="94" className="chart-grid"/><line x1="20" y1="122" x2="280" y2="122" className="chart-grid"/><polyline points={points} className="chart-line"/>{values.map((value, index) => <circle key={index} cx={24 + index * (252 / Math.max(1, values.length - 1))} cy={150 - Math.max(-3, Math.min(3, value)) * 28} r="4" className="chart-dot"/>)}<text x="20" y="169" fill="#60746d" fontSize="10">{t("older")}</text><text x="224" y="169" fill="#60746d" fontSize="10">{t("mostRecent")}</text></svg></section>}
    {scored && <section className="method"><h3>{t("domain")}</h3><p className="note-small">{t("baseline")} = first six valid sessions · {t("latest")} = latest valid session</p>{Object.entries(domainFields).map(([domain, field]) => { const stats = domainStats[domain]; const z = output.domain_z_latest[domain] ?? 0; const latestValue = recent?.[field] as number | undefined; const label = t(domainKeys[domain]); const raw = domain === "memory" ? latestValue?.toFixed(2) : `${latestValue?.toFixed(0)} ms`; return <div className="bar-row" key={domain}><span>{label}</span><div className="bar-track"><span className="bar-mid"/><span className="bar-fill" style={{ left: z < 0 ? `${Math.max(0, 50 + z * 10)}%` : "50%", width: `${Math.min(50, Math.abs(z) * 10)}%`, background: z > 1 ? "#c18a4b" : undefined }}/></div><span style={{ textAlign: "right" }}>{raw ?? "—"}</span><small className="note-small" style={{ gridColumn: "2 / 4" }}>{t("baseline")}: {stats?.mean.toFixed(domain === "memory" ? 2 : 0)} · z {z.toFixed(2)}</small></div>; })}</section>}
    <details className="method"><summary>{t("method")}</summary><p className="note-small" style={{ marginTop: 13 }}>{t("methodText")} Model version: {output.model_version}. `clinical_probability` is always null.</p></details>
    {output.context_flags.length > 0 && <p className="note-small">{t("context")}: {output.context_flags.join(" · ")}</p>}
    <div className="disclaimer">{t("disclaimer")}</div><div className="actions"><button className="button secondary" onClick={onNew}>{t("restart")}</button><button className="button" onClick={onRequest}>{t("report")}</button></div></>;
}
