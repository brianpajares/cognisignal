#!/usr/bin/env python3
"""
CogniSignal QA engine — independent implementation for Stage 3.
Derived from model_spec.json + base workbook parameters only.
It intentionally does not import or call engine_reference.py.
"""
from __future__ import annotations
import math, statistics
from copy import deepcopy

DOMAIN_FIELDS = {
    "memory": ("memory_dprime", "higher_is_better"),
    "attention": ("attention_rt_ms", "lower_is_better"),
    "executive": ("executive_ies_ms", "lower_is_better"),
}

DEFAULT_PARAMS = {
    "ewma_lambda": 0.2,
    "ewma_k_warn": 2.0,
    "ewma_k_action": 3.0,
    "baseline_sessions": 6,
    "min_valid_domains": 2,
    "sd_epsilon": 1e-9,
}
MODEL_VERSION = "CS-LCM-1.0"


class ModelInputError(ValueError):
    pass

def validate_inputs(inputs):
    required=["age_years","country_code","language","education_band","context_issue","self_report_change_6m","sessions"]
    missing=[k for k in required if k not in inputs]
    if missing:
        raise ModelInputError("missing:"+",".join(missing))
    extra=sorted(set(inputs)-set(required))
    if extra:
        raise ModelInputError("extra:"+",".join(extra))
    age=inputs["age_years"]
    if not isinstance(age,int) or isinstance(age,bool) or not (55<=age<=90):
        raise ModelInputError("age_years out of range/type")
    if inputs["country_code"] not in {"US","GB","ES","BR","MX"}:
        raise ModelInputError("country_code invalid")
    if inputs["language"] not in {"en","es","pt"}:
        raise ModelInputError("language invalid")
    if inputs["education_band"] not in {"primary_or_less","secondary","tertiary"}:
        raise ModelInputError("education_band invalid")
    if inputs["context_issue"] not in {"none","poor_sleep","acute_illness","unusual_stress","medication_change","other"}:
        raise ModelInputError("context_issue invalid")
    if inputs["self_report_change_6m"] not in {"no","unsure","yes"}:
        raise ModelInputError("self_report_change_6m invalid")
    sessions=inputs["sessions"]
    if not isinstance(sessions,list) or not (1 <= len(sessions) <= 104):
        raise ModelInputError("sessions invalid length")
    prev=None
    for i,ss in enumerate(sessions):
        if not isinstance(ss,dict):
            raise ModelInputError(f"sessions[{i}] invalid")
        req={"date","memory_dprime","attention_rt_ms","executive_ies_ms","quality_pass"}
        if set(ss.keys()) != req:
            raise ModelInputError(f"sessions[{i}] fields invalid")
        d=ss["date"]
        if not isinstance(d,str) or not re_date(d):
            raise ModelInputError(f"sessions[{i}].date invalid")
        if prev is not None and d <= prev:
            raise ModelInputError("dates not strictly increasing")
        prev=d
        limits={"memory_dprime":(-6.0,6.0),"attention_rt_ms":(150.0,3000.0),"executive_ies_ms":(150.0,6000.0)}
        for f,(lo,hi) in limits.items():
            v=ss[f]
            if not isinstance(v,(int,float)) or isinstance(v,bool) or not math.isfinite(float(v)):
                raise ModelInputError(f"{f} not finite")
            if not (lo <= float(v) <= hi):
                raise ModelInputError(f"{f} out of range")
        if not isinstance(ss["quality_pass"],bool):
            raise ModelInputError("quality_pass invalid")
    return True

def re_date(s):
    if len(s)!=10 or s[4]!="-" or s[7]!="-":
        return False
    try:
        y,m,d=map(int,s.split("-"))
        import datetime as _dt
        _dt.date(y,m,d)
        return True
    except Exception:
        return False


def _context_flags(inputs):
    flags=[]
    if inputs.get("context_issue","none") != "none":
        flags.append(f"context_issue:{inputs['context_issue']}")
    if inputs.get("self_report_change_6m","no") != "no":
        flags.append(f"self_report_change_6m:{inputs['self_report_change_6m']}")
    return flags

def _base_output(inputs, valid, excluded, p):
    return {
        "model_version": MODEL_VERSION,
        "is_clinical_probability": False,
        "clinical_probability": None,
        "quality_excluded_sessions": excluded,
        "context_flags": _context_flags(inputs),
        "valid_sessions": len(valid),
        "baseline_sessions_required": int(p["baseline_sessions"]),
        "baseline_sessions_used": min(len(valid), int(p["baseline_sessions"])),
        "monitoring_sessions_used": max(0, len(valid)-int(p["baseline_sessions"])),
    }

def _domain_stats(baseline, p):
    stats={}
    valid_domains=[]
    for d,(field,_) in DOMAIN_FIELDS.items():
        vals=[float(s[field]) for s in baseline]
        mu=statistics.fmean(vals)
        sd=statistics.stdev(vals)
        stats[d]={"mean":mu,"sd":sd}
        if sd > p["sd_epsilon"]:
            valid_domains.append(d)
    return stats, valid_domains

def _z(session, domain, stats):
    field, direction=DOMAIN_FIELDS[domain]
    x=float(session[field]); mu=stats[domain]["mean"]; sd=stats[domain]["sd"]
    return (mu-x)/sd if direction=="higher_is_better" else (x-mu)/sd

def _comp(session, valid_domains, stats):
    z={d:_z(session,d,stats) for d in valid_domains}
    return statistics.fmean(z.values()), z

def calculate(inputs, params=None):
    validate_inputs(inputs)
    p=dict(DEFAULT_PARAMS)
    if params: p.update(params)
    sessions=list(inputs.get("sessions",[]))
    valid=[s for s in sessions if s.get("quality_pass") is True]
    excluded=len(sessions)-len(valid)
    out=_base_output(inputs, valid, excluded, p)
    B=int(p["baseline_sessions"])
    if len(valid)<B:
        out.update({
            "status":"baseline_building","category":"baseline_building",
            "signal_index_0_100":None,"ewma":None,"latest_composite_z":None,
            "domain_z_latest":{},"warn_limit":None,"action_limit":None,
            "message_key":"need_more_baseline_sessions",
        })
        return out

    baseline=valid[:B]
    monitoring=valid[B:]
    stats, valid_domains=_domain_stats(baseline,p)
    if len(valid_domains) < int(p["min_valid_domains"]):
        out.update({
            "status":"baseline_unstable","category":"baseline_unstable",
            "valid_domains":valid_domains,
            "signal_index_0_100":None,"ewma":None,"latest_composite_z":None,
            "domain_z_latest":{},"warn_limit":None,"action_limit":None,
            "message_key":"insufficient_baseline_variability",
        })
        return out

    baseline_comps=[_comp(s,valid_domains,stats)[0] for s in baseline]
    sc=statistics.stdev(baseline_comps)
    if not math.isfinite(sc) or sc <= p["sd_epsilon"]:
        out.update({
            "status":"baseline_unstable","category":"baseline_unstable",
            "valid_domains":valid_domains,
            "baseline_domain_stats":{d:stats[d] for d in valid_domains},
            "signal_index_0_100":None,"ewma":None,"latest_composite_z":None,
            "domain_z_latest":{},"warn_limit":None,"action_limit":None,
            "message_key":"insufficient_baseline_variability",
        })
        return out

    lam=float(p["ewma_lambda"])
    sigma_e=math.sqrt(lam/(2.0-lam))
    warn=float(p["ewma_k_warn"])*sigma_e
    action=float(p["ewma_k_action"])*sigma_e
    out.update({
        "valid_domains":valid_domains,
        "baseline_domain_stats":{d:stats[d] for d in valid_domains},
        "composite_baseline_sd":sc,
    })
    if not monitoring:
        out.update({
            "status":"baseline_ready","category":"baseline_ready",
            "signal_index_0_100":0.0,"ewma":0.0,"latest_composite_z":None,
            "domain_z_latest":{},"warn_limit":warn,"action_limit":action,
            "message_key":"baseline_ready_waiting_followup",
        })
        return out

    ewma=0.0
    D_series=[]
    latest_z={}
    for s in monitoring:
        c, z=_comp(s,valid_domains,stats)
        D=c/sc
        D_series.append(D)
        ewma=lam*D+(1-lam)*ewma
        latest_z=z

    signal=min(100.0,max(0.0,100.0*max(0.0,ewma)/action))
    if ewma < warn:
        category="stable"; message="within_personal_reference_band"
    elif ewma < action:
        category="watch"; message="change_crossed_warning_limit"
    else:
        category="discuss_with_clinician"; message="persistent_change_crossed_action_limit"

    out.update({
        "status":"scored","category":category,"message_key":message,
        "latest_composite_z":D_series[-1],"ewma":ewma,
        "ewma_sigma_reference":sigma_e,"warn_limit":warn,"action_limit":action,
        "signal_index_0_100":signal,"domain_z_latest":latest_z,
        "monitoring_composite_z_series":D_series,
    })

    sens={}
    for d in valid_domains:
        # +1 baseline SD worse in one domain on latest session increases raw
        # composite by 1/|domains|, then standardized composite by 1/(n*sc).
        shifted_D=D_series[-1]+1.0/(len(valid_domains)*sc)
        e=0.0
        for D in D_series[:-1]:
            e=lam*D+(1-lam)*e
        shifted_e=lam*shifted_D+(1-lam)*e
        shifted_signal=min(100.0,max(0.0,100.0*max(0.0,shifted_e)/action))
        sens[d]={
            "scenario":"+1_baseline_sd_worse_on_latest_session",
            "signal_index_0_100":shifted_signal,
            "delta_signal_points":shifted_signal-signal,
        }
    out["sensitivity"]=sens
    return out

def validate_finite(inputs):
    for s in inputs.get("sessions",[]):
        for field,_ in DOMAIN_FIELDS.values():
            v=s.get(field)
            if not isinstance(v,(int,float)) or isinstance(v,bool) or not math.isfinite(float(v)):
                raise ValueError(f"{field} must be a finite number")
    return True
