#!/usr/bin/env python3
"""
CogniSignal CS-LCM v1.0
Motor de referencia determinista y auditable.

calculate(inputs, base) -> outputs

- `inputs` es un dict validado con la forma documentada en inputs.schema.json.
- `base` puede ser:
  a) ruta a base_cognisignal.xlsx (lee hoja Parametros con stdlib); o
  b) dict de parámetros para tests internos.

No produce diagnóstico, probabilidad de Alzheimer/MCI/demencia ni decisión clínica.
"""
from __future__ import annotations

import math
import statistics
import datetime
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, Dict, List, Tuple

MODEL_VERSION = "CS-LCM-1.0"
NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
NS_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
NS_PKG_REL = "http://schemas.openxmlformats.org/package/2006/relationships"


class ModelInputError(ValueError):
    pass


def _col_letters_to_index(letters: str) -> int:
    n = 0
    for ch in letters:
        if "A" <= ch <= "Z":
            n = n * 26 + (ord(ch) - 64)
    return n - 1


def _read_shared_strings(zf: zipfile.ZipFile) -> List[str]:
    try:
        data = zf.read("xl/sharedStrings.xml")
    except KeyError:
        return []
    root = ET.fromstring(data)
    ns = {"m": NS_MAIN}
    out = []
    for si in root.findall("m:si", ns):
        texts = []
        for t in si.iter(f"{{{NS_MAIN}}}t"):
            texts.append(t.text or "")
        out.append("".join(texts))
    return out


def _sheet_target(zf: zipfile.ZipFile, sheet_name: str) -> str:
    wb = ET.fromstring(zf.read("xl/workbook.xml"))
    ns = {"m": NS_MAIN, "r": NS_REL}
    rid = None
    for s in wb.findall("m:sheets/m:sheet", ns):
        if s.attrib.get("name") == sheet_name:
            rid = s.attrib.get(f"{{{NS_REL}}}id")
            break
    if rid is None:
        raise ModelInputError(f"No existe la hoja {sheet_name!r} en la base Excel.")

    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    for rel in rels:
        if rel.attrib.get("Id") == rid:
            target = rel.attrib["Target"].lstrip("/")
            if target.startswith("xl/"):
                return target
            return "xl/" + target
    raise ModelInputError(f"No se pudo resolver la hoja {sheet_name!r}.")


def _read_sheet_rows(path: str | Path, sheet_name: str) -> List[List[Any]]:
    path = str(path)
    with zipfile.ZipFile(path, "r") as zf:
        shared = _read_shared_strings(zf)
        target = _sheet_target(zf, sheet_name)
        root = ET.fromstring(zf.read(target))
        rows: List[List[Any]] = []
        max_col = 0
        parsed = []
        for row in root.findall(f".//{{{NS_MAIN}}}row"):
            cells = {}
            for c in row.findall(f"{{{NS_MAIN}}}c"):
                ref = c.attrib.get("r", "A1")
                letters = "".join(ch for ch in ref if ch.isalpha()).upper()
                idx = _col_letters_to_index(letters)
                max_col = max(max_col, idx)
                typ = c.attrib.get("t")
                value = None
                if typ == "inlineStr":
                    texts = [t.text or "" for t in c.iter(f"{{{NS_MAIN}}}t")]
                    value = "".join(texts)
                else:
                    v = c.find(f"{{{NS_MAIN}}}v")
                    raw = None if v is None else v.text
                    if raw is None:
                        value = None
                    elif typ == "s":
                        value = shared[int(raw)]
                    elif typ == "b":
                        value = raw == "1"
                    elif typ == "str":
                        value = raw
                    else:
                        try:
                            num = float(raw)
                            value = int(num) if num.is_integer() else num
                        except Exception:
                            value = raw
                cells[idx] = value
            parsed.append(cells)
        for cells in parsed:
            rows.append([cells.get(i) for i in range(max_col + 1)])
        return rows


def _load_parameters_xlsx(path: str | Path) -> Dict[str, Any]:
    rows = _read_sheet_rows(path, "Parametros")
    if not rows:
        raise ModelInputError("Hoja Parametros vacía.")
    header = [str(x).strip() if x is not None else "" for x in rows[0]]
    try:
        pcol = header.index("parametro")
        vcol = header.index("valor")
    except ValueError as e:
        raise ModelInputError("Parametros debe contener columnas 'parametro' y 'valor'.") from e
    params: Dict[str, Any] = {}
    for row in rows[1:]:
        if pcol >= len(row):
            continue
        key = row[pcol]
        if key in (None, ""):
            continue
        val = row[vcol] if vcol < len(row) else None
        params[str(key)] = val
    return params


def _params(base: str | Path | Dict[str, Any]) -> Dict[str, Any]:
    if isinstance(base, dict):
        return dict(base)
    return _load_parameters_xlsx(base)


def _f(params: Dict[str, Any], key: str) -> float:
    if key not in params:
        raise ModelInputError(f"Falta parámetro {key!r} en la base.")
    try:
        return float(params[key])
    except Exception as e:
        raise ModelInputError(f"Parámetro {key!r} no es numérico: {params[key]!r}") from e


def _i(params: Dict[str, Any], key: str) -> int:
    return int(round(_f(params, key)))


def _validate_top_level(inputs: Dict[str, Any]) -> None:
    required = [
        "age_years", "country_code", "language", "education_band",
        "context_issue", "self_report_change_6m", "sessions"
    ]
    missing = [k for k in required if k not in inputs]
    if missing:
        raise ModelInputError("Faltan inputs: " + ", ".join(missing))
    extra = sorted(set(inputs) - set(required))
    if extra:
        raise ModelInputError("Inputs no permitidos: " + ", ".join(extra))

    age = inputs["age_years"]
    if not isinstance(age, int) or isinstance(age, bool) or not (55 <= age <= 90):
        raise ModelInputError("age_years debe ser entero entre 55 y 90 para el MVP.")

    if inputs["country_code"] not in {"US", "GB", "ES", "BR", "MX"}:
        raise ModelInputError("country_code fuera del alcance MVP.")
    if inputs["language"] not in {"en", "es", "pt"}:
        raise ModelInputError("language debe ser en/es/pt.")
    if inputs["education_band"] not in {"primary_or_less", "secondary", "tertiary"}:
        raise ModelInputError("education_band inválido.")
    if inputs["context_issue"] not in {
        "none", "poor_sleep", "acute_illness", "unusual_stress", "medication_change", "other"
    }:
        raise ModelInputError("context_issue inválido.")
    if inputs["self_report_change_6m"] not in {"no", "unsure", "yes"}:
        raise ModelInputError("self_report_change_6m inválido.")
    if not isinstance(inputs["sessions"], list) or not (1 <= len(inputs["sessions"]) <= 104):
        raise ModelInputError("sessions debe contener entre 1 y 104 registros.")


def _validate_sessions(sessions: List[Dict[str, Any]]) -> None:
    last_date = None
    for idx, s in enumerate(sessions):
        if not isinstance(s, dict):
            raise ModelInputError(f"sessions[{idx}] debe ser objeto.")
        req = {"date", "memory_dprime", "attention_rt_ms", "executive_ies_ms", "quality_pass"}
        if set(s) != req:
            missing = sorted(req - set(s))
            extra = sorted(set(s) - req)
            detail = []
            if missing:
                detail.append("faltan " + ", ".join(missing))
            if extra:
                detail.append("sobran " + ", ".join(extra))
            raise ModelInputError(f"sessions[{idx}] campos inválidos: " + "; ".join(detail))
        date = s["date"]
        if not isinstance(date, str) or len(date) != 10 or date[4] != "-" or date[7] != "-":
            raise ModelInputError(f"sessions[{idx}].date debe ser YYYY-MM-DD.")
        try:
            datetime.date.fromisoformat(date)
        except ValueError as e:
            raise ModelInputError(f"sessions[{idx}].date no es una fecha de calendario válida.") from e
        if last_date is not None and date <= last_date:
            raise ModelInputError("Las fechas de sessions deben ser únicas y estrictamente crecientes.")
        last_date = date

        vals = [
            ("memory_dprime", s["memory_dprime"], -6.0, 6.0),
            ("attention_rt_ms", s["attention_rt_ms"], 150.0, 3000.0),
            ("executive_ies_ms", s["executive_ies_ms"], 150.0, 6000.0),
        ]
        for name, value, lo, hi in vals:
            if not isinstance(value, (int, float)) or isinstance(value, bool) or not math.isfinite(value):
                raise ModelInputError(f"sessions[{idx}].{name} debe ser número finito.")
            if not (lo <= float(value) <= hi):
                raise ModelInputError(f"sessions[{idx}].{name} fuera de rango [{lo}, {hi}].")
        if not isinstance(s["quality_pass"], bool):
            raise ModelInputError(f"sessions[{idx}].quality_pass debe ser booleano.")


def _sample_sd(xs: List[float]) -> float:
    return statistics.stdev(xs) if len(xs) >= 2 else 0.0


def _domain_stats(baseline: List[Dict[str, Any]], eps: float) -> Dict[str, Dict[str, float]]:
    specs = {
        "memory": ("memory_dprime", -1.0),      # menor memoria = peor
        "attention": ("attention_rt_ms", 1.0),  # mayor RT = peor
        "executive": ("executive_ies_ms", 1.0), # mayor IES = peor
    }
    out = {}
    for domain, (field, sign) in specs.items():
        vals = [float(s[field]) for s in baseline]
        mu = statistics.mean(vals)
        sd = _sample_sd(vals)
        out[domain] = {"field": field, "sign": sign, "mean": mu, "sd": sd, "valid": sd > eps}
    return out


def _z_for_session(s: Dict[str, Any], stats: Dict[str, Dict[str, float]]) -> Dict[str, float]:
    z = {}
    for domain, st in stats.items():
        if not st["valid"]:
            continue
        x = float(s[st["field"]])
        z[domain] = st["sign"] * (x - st["mean"]) / st["sd"]
    return z


def _context_flags(inputs: Dict[str, Any]) -> List[str]:
    flags = []
    if inputs["context_issue"] != "none":
        flags.append("context_issue:" + inputs["context_issue"])
    if inputs["self_report_change_6m"] in {"yes", "unsure"}:
        flags.append("self_report_change_6m:" + inputs["self_report_change_6m"])
    return flags


def calculate(inputs: Dict[str, Any], base: str | Path | Dict[str, Any]) -> Dict[str, Any]:
    """
    Calcula señal longitudinal observada. No es una probabilidad clínica.
    """
    _validate_top_level(inputs)
    _validate_sessions(inputs["sessions"])
    p = _params(base)

    lam = _f(p, "ewma_lambda")
    k_warn = _f(p, "ewma_k_warn")
    k_action = _f(p, "ewma_k_action")
    baseline_n = _i(p, "baseline_sessions")
    min_domains = _i(p, "min_valid_domains")
    eps = _f(p, "sd_epsilon")

    if not (0 < lam <= 1):
        raise ModelInputError("ewma_lambda debe estar en (0,1].")
    if not (0 < k_warn < k_action):
        raise ModelInputError("Se requiere 0 < ewma_k_warn < ewma_k_action.")

    valid = [s for s in inputs["sessions"] if s["quality_pass"]]
    excluded = len(inputs["sessions"]) - len(valid)
    base_output = {
        "model_version": MODEL_VERSION,
        "is_clinical_probability": False,
        "clinical_probability": None,
        "quality_excluded_sessions": excluded,
        "context_flags": _context_flags(inputs),
    }

    if len(valid) < baseline_n:
        return {
            **base_output,
            "status": "baseline_building",
            "category": "baseline_building",
            "valid_sessions": len(valid),
            "baseline_sessions_required": baseline_n,
            "baseline_sessions_used": len(valid),
            "monitoring_sessions_used": 0,
            "signal_index_0_100": None,
            "ewma": None,
            "latest_composite_z": None,
            "domain_z_latest": {},
            "warn_limit": None,
            "action_limit": None,
            "message_key": "need_more_baseline_sessions",
        }

    baseline = valid[:baseline_n]
    monitor = valid[baseline_n:]
    stats = _domain_stats(baseline, eps)
    valid_domains = [d for d, st in stats.items() if st["valid"]]

    if len(valid_domains) < min_domains:
        return {
            **base_output,
            "status": "baseline_unstable",
            "category": "baseline_unstable",
            "valid_sessions": len(valid),
            "baseline_sessions_required": baseline_n,
            "baseline_sessions_used": baseline_n,
            "monitoring_sessions_used": len(monitor),
            "valid_domains": valid_domains,
            "signal_index_0_100": None,
            "ewma": None,
            "latest_composite_z": None,
            "domain_z_latest": {},
            "warn_limit": None,
            "action_limit": None,
            "message_key": "insufficient_baseline_variability",
        }

    # Estandarización del compuesto usando la variabilidad conjunta observada en baseline.
    baseline_composites = []
    for s in baseline:
        zz = _z_for_session(s, stats)
        vals = [zz[d] for d in valid_domains]
        baseline_composites.append(statistics.mean(vals))
    composite_sd = _sample_sd(baseline_composites)

    if not math.isfinite(composite_sd) or composite_sd <= eps:
        return {
            **base_output,
            "status": "baseline_unstable",
            "category": "baseline_unstable",
            "valid_sessions": len(valid),
            "baseline_sessions_required": baseline_n,
            "baseline_sessions_used": baseline_n,
            "monitoring_sessions_used": len(monitor),
            "valid_domains": valid_domains,
            "signal_index_0_100": None,
            "ewma": None,
            "latest_composite_z": None,
            "domain_z_latest": {},
            "warn_limit": None,
            "action_limit": None,
            "message_key": "composite_baseline_variability_zero",
        }

    sigma_ewma = math.sqrt(lam / (2.0 - lam))
    warn_limit = k_warn * sigma_ewma
    action_limit = k_action * sigma_ewma

    # Si todavía no hay sesión posterior al baseline, el baseline está listo pero aún no existe señal de cambio.
    if not monitor:
        return {
            **base_output,
            "status": "baseline_ready",
            "category": "baseline_ready",
            "valid_sessions": len(valid),
            "baseline_sessions_required": baseline_n,
            "baseline_sessions_used": baseline_n,
            "monitoring_sessions_used": 0,
            "valid_domains": valid_domains,
            "baseline_domain_stats": {
                d: {"mean": stats[d]["mean"], "sd": stats[d]["sd"]} for d in valid_domains
            },
            "composite_baseline_sd": composite_sd,
            "signal_index_0_100": 0.0,
            "ewma": 0.0,
            "latest_composite_z": None,
            "domain_z_latest": {},
            "warn_limit": warn_limit,
            "action_limit": action_limit,
            "message_key": "baseline_ready_waiting_followup",
        }

    e = 0.0
    d_series = []
    domain_series = []
    for s in monitor:
        zz = _z_for_session(s, stats)
        raw_comp = statistics.mean([zz[d] for d in valid_domains])
        d_std = raw_comp / composite_sd
        e = lam * d_std + (1.0 - lam) * e
        d_series.append(d_std)
        domain_series.append(zz)

    if e >= action_limit:
        category = "discuss_with_clinician"
        msg = "persistent_change_crossed_action_limit"
    elif e >= warn_limit:
        category = "watch"
        msg = "change_crossed_warning_limit"
    else:
        category = "stable"
        msg = "within_personal_reference_band"

    signal = max(0.0, min(100.0, 100.0 * e / action_limit))

    # Sensibilidad: efecto en índice si el último valor empeora +1 DE de baseline en cada dominio por separado.
    sensitivity = {}
    prev_e = 0.0
    if len(d_series) > 1:
        for d0 in d_series[:-1]:
            prev_e = lam * d0 + (1.0 - lam) * prev_e
    last_zz = domain_series[-1]
    for domain in valid_domains:
        perturbed = dict(last_zz)
        perturbed[domain] = perturbed[domain] + 1.0
        d_perturbed = statistics.mean([perturbed[d] for d in valid_domains]) / composite_sd
        e_perturbed = lam * d_perturbed + (1.0 - lam) * prev_e
        sig_perturbed = max(0.0, min(100.0, 100.0 * e_perturbed / action_limit))
        sensitivity[domain] = {
            "scenario": "+1_baseline_sd_worse_on_latest_session",
            "signal_index_0_100": sig_perturbed,
            "delta_signal_points": sig_perturbed - signal,
        }

    return {
        **base_output,
        "status": "scored",
        "category": category,
        "message_key": msg,
        "valid_sessions": len(valid),
        "baseline_sessions_required": baseline_n,
        "baseline_sessions_used": baseline_n,
        "monitoring_sessions_used": len(monitor),
        "valid_domains": valid_domains,
        "baseline_domain_stats": {
            d: {"mean": stats[d]["mean"], "sd": stats[d]["sd"]} for d in valid_domains
        },
        "composite_baseline_sd": composite_sd,
        "latest_composite_z": d_series[-1],
        "ewma": e,
        "ewma_sigma_reference": sigma_ewma,
        "warn_limit": warn_limit,
        "action_limit": action_limit,
        "signal_index_0_100": signal,
        "domain_z_latest": domain_series[-1],
        "monitoring_composite_z_series": d_series,
        "sensitivity": sensitivity,
    }


if __name__ == "__main__":
    import argparse, json
    parser = argparse.ArgumentParser()
    parser.add_argument("inputs_json")
    parser.add_argument("base_xlsx")
    args = parser.parse_args()
    with open(args.inputs_json, "r", encoding="utf-8") as f:
        inputs = json.load(f)
    print(json.dumps(calculate(inputs, args.base_xlsx), ensure_ascii=False, indent=2))
