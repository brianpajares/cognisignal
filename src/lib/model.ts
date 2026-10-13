import parameterSnapshot from "../../drive/model/parameters_snapshot.json";

export const MODEL_VERSION = "CS-LCM-1.0" as const;
export type Session = {
  date: string;
  memory_dprime: number;
  attention_rt_ms: number;
  executive_ies_ms: number;
  quality_pass: boolean;
};
export type AssessmentInput = {
  age_years: number;
  country_code: "US" | "GB" | "ES" | "BR" | "MX";
  language: "es" | "en" | "pt";
  education_band: "primary_or_less" | "secondary" | "tertiary";
  context_issue: "none" | "poor_sleep" | "acute_illness" | "unusual_stress" | "medication_change" | "other";
  self_report_change_6m: "no" | "unsure" | "yes";
  sessions: Session[];
};
type Stats = { field: keyof Pick<Session, "memory_dprime" | "attention_rt_ms" | "executive_ies_ms">; sign: number; mean: number; sd: number; valid: boolean };
export type ModelOutput = Record<string, unknown> & {
  model_version: typeof MODEL_VERSION;
  is_clinical_probability: false;
  clinical_probability: null;
  status: "baseline_building" | "baseline_unstable" | "baseline_ready" | "scored";
  category: string;
  message_key: string;
  context_flags: string[];
  quality_excluded_sessions: number;
  valid_sessions: number;
  baseline_sessions_required: number;
  baseline_sessions_used: number;
  monitoring_sessions_used: number;
  signal_index_0_100: number | null;
  ewma: number | null;
  latest_composite_z: number | null;
  domain_z_latest: Record<string, number>;
  warn_limit: number | null;
  action_limit: number | null;
  valid_domains?: string[];
  baseline_domain_stats?: Record<string, { mean: number; sd: number }>;
  monitoring_composite_z_series?: number[];
  sensitivity?: Record<string, { scenario: string; signal_index_0_100: number; delta_signal_points: number }>;
};

const parameters = parameterSnapshot.parameters;
const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const sampleSd = (values: number[]) => values.length < 2 ? 0 : Math.sqrt(values.reduce((sum, x) => sum + (x - values.reduce((a, b) => a + b, 0) / values.length) ** 2, 0) / (values.length - 1));
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

export function validateInput(value: unknown): asserts value is AssessmentInput {
  if (!isObject(value)) throw new Error("La solicitud debe ser un objeto.");
  const required = ["age_years", "country_code", "language", "education_band", "context_issue", "self_report_change_6m", "sessions"];
  const extra = Object.keys(value).filter((key) => !required.includes(key));
  if (extra.length || required.some((key) => !(key in value))) throw new Error("La solicitud no coincide con el esquema de entrada.");
  if (!Number.isInteger(value.age_years) || Number(value.age_years) < 55 || Number(value.age_years) > 90) throw new Error("La edad debe estar entre 55 y 90 años.");
  if (!(<[string, ...string[]]>["US", "GB", "ES", "BR", "MX"]).includes(String(value.country_code))) throw new Error("País fuera del alcance de esta versión.");
  if (!(<[string, ...string[]]>["es", "en", "pt"]).includes(String(value.language))) throw new Error("Idioma no válido.");
  if (!(<[string, ...string[]]>["primary_or_less", "secondary", "tertiary"]).includes(String(value.education_band))) throw new Error("Nivel educativo no válido.");
  if (!(<[string, ...string[]]>["none", "poor_sleep", "acute_illness", "unusual_stress", "medication_change", "other"]).includes(String(value.context_issue))) throw new Error("Contexto no válido.");
  if (!(<[string, ...string[]]>["no", "unsure", "yes"]).includes(String(value.self_report_change_6m))) throw new Error("Respuesta de cambio percibido no válida.");
  if (!Array.isArray(value.sessions) || value.sessions.length < 1 || value.sessions.length > 104) throw new Error("Se requiere entre 1 y 104 sesiones.");
  let lastDate = "";
  value.sessions.forEach((raw, index) => {
    if (!isObject(raw)) throw new Error(`La sesión ${index + 1} no es válida.`);
    const keys = ["date", "memory_dprime", "attention_rt_ms", "executive_ies_ms", "quality_pass"];
    if (Object.keys(raw).length !== keys.length || keys.some((key) => !(key in raw))) throw new Error(`La sesión ${index + 1} no coincide con el esquema.`);
    const date = String(raw.date);
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.valueOf()) || parsedDate.toISOString().slice(0, 10) !== date || date <= lastDate) throw new Error("Las fechas deben ser válidas, únicas y crecientes.");
    lastDate = date;
    for (const [key, lo, hi] of [["memory_dprime", -6, 6], ["attention_rt_ms", 150, 3000], ["executive_ies_ms", 150, 6000]] as const) {
      const n = raw[key];
      if (typeof n !== "number" || !Number.isFinite(n) || n < lo || n > hi) throw new Error(`El valor ${key} de la sesión ${index + 1} está fuera de rango.`);
    }
    if (typeof raw.quality_pass !== "boolean") throw new Error("El indicador de calidad debe ser booleano.");
  });
}

export function calculate(input: AssessmentInput): ModelOutput {
  validateInput(input);
  const lambda = parameters.ewma_lambda;
  const baselineN = parameters.baseline_sessions;
  const eps = parameters.sd_epsilon;
  const valid = input.sessions.filter((session) => session.quality_pass);
  const base = { model_version: MODEL_VERSION, is_clinical_probability: false as const, clinical_probability: null, quality_excluded_sessions: input.sessions.length - valid.length, context_flags: [
    ...(input.context_issue === "none" ? [] : [`context_issue:${input.context_issue}`]),
    ...(input.self_report_change_6m === "no" ? [] : [`self_report_change_6m:${input.self_report_change_6m}`])
  ] };
  const early = (status: ModelOutput["status"], messageKey: string, n = valid.length, monitorN = 0, validDomains: string[] = []): ModelOutput => ({
    ...base, status, category: status, message_key: messageKey, valid_sessions: valid.length,
    baseline_sessions_required: baselineN, baseline_sessions_used: n, monitoring_sessions_used: monitorN,
    ...(status === "baseline_unstable" ? { valid_domains: validDomains } : {}),
    signal_index_0_100: null, ewma: null, latest_composite_z: null, domain_z_latest: {}, warn_limit: null, action_limit: null
  });
  if (valid.length < baselineN) return early("baseline_building", "need_more_baseline_sessions");
  const baseline = valid.slice(0, baselineN);
  const monitor = valid.slice(baselineN);
  const specs = { memory: ["memory_dprime", -1], attention: ["attention_rt_ms", 1], executive: ["executive_ies_ms", 1] } as const;
  const stats: Record<string, Stats> = {};
  for (const [domain, [field, sign]] of Object.entries(specs)) {
    const vals = baseline.map((session) => session[field]);
    const sd = sampleSd(vals);
    stats[domain] = { field, sign, mean: mean(vals), sd, valid: sd > eps };
  }
  const validDomains = Object.keys(stats).filter((domain) => stats[domain].valid);
  const stds = (session: Session) => Object.fromEntries(validDomains.map((domain) => {
    const stat = stats[domain]; return [domain, stat.sign * (session[stat.field] - stat.mean) / stat.sd];
  }));
  if (validDomains.length < parameters.min_valid_domains) return early("baseline_unstable", "insufficient_baseline_variability", baselineN, monitor.length, validDomains);
  const baselineComposites = baseline.map((session) => mean(Object.values(stds(session))));
  const compositeSd = sampleSd(baselineComposites);
  if (!Number.isFinite(compositeSd) || compositeSd <= eps) return early("baseline_unstable", "composite_baseline_variability_zero", baselineN, monitor.length, validDomains);
  const sigma = Math.sqrt(lambda / (2 - lambda));
  const warnLimit = parameters.ewma_k_warn * sigma;
  const actionLimit = parameters.ewma_k_action * sigma;
  const common = {
    ...base, valid_sessions: valid.length, baseline_sessions_required: baselineN, baseline_sessions_used: baselineN,
    monitoring_sessions_used: monitor.length, valid_domains: validDomains,
    baseline_domain_stats: Object.fromEntries(validDomains.map((domain) => [domain, { mean: stats[domain].mean, sd: stats[domain].sd }])),
    composite_baseline_sd: compositeSd, ewma_sigma_reference: sigma, warn_limit: warnLimit, action_limit: actionLimit
  };
  if (!monitor.length) return {
    ...common, status: "baseline_ready", category: "baseline_ready", signal_index_0_100: 0, ewma: 0,
    latest_composite_z: null, domain_z_latest: {}, message_key: "baseline_ready_waiting_followup"
  };
  let ewma = 0;
  const series: number[] = [];
  const domainSeries: Record<string, number>[] = [];
  for (const session of monitor) {
    const zs = stds(session);
    const d = mean(validDomains.map((domain) => zs[domain])) / compositeSd;
    ewma = lambda * d + (1 - lambda) * ewma;
    series.push(d);
    domainSeries.push(zs);
  }
  const category = ewma >= actionLimit ? "discuss_with_clinician" : ewma >= warnLimit ? "watch" : "stable";
  const messageKey = ewma >= actionLimit ? "persistent_change_crossed_action_limit" : ewma >= warnLimit ? "change_crossed_warning_limit" : "within_personal_reference_band";
  const signal = Math.max(0, Math.min(100, 100 * ewma / actionLimit));
  let previousEwma = 0;
  for (const d of series.slice(0, -1)) previousEwma = lambda * d + (1 - lambda) * previousEwma;
  const sensitivity = Object.fromEntries(validDomains.map((domain) => {
    const perturbed = { ...domainSeries.at(-1)! };
    perturbed[domain] += 1;
    const d = mean(validDomains.map((key) => perturbed[key])) / compositeSd;
    const next = lambda * d + (1 - lambda) * previousEwma;
    const sensitivitySignal = Math.max(0, Math.min(100, 100 * next / actionLimit));
    return [domain, { scenario: "+1_baseline_sd_worse_on_latest_session", signal_index_0_100: sensitivitySignal, delta_signal_points: sensitivitySignal - signal }];
  }));
  return {
    ...common, status: "scored", category, message_key: messageKey, signal_index_0_100: signal, ewma,
    latest_composite_z: series.at(-1)!, domain_z_latest: domainSeries.at(-1)!, monitoring_composite_z_series: series,
    sensitivity
  };
}
