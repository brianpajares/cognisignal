#!/usr/bin/env python3
"""Descarga y valida PPP 2025 del World Bank para los mercados de CogniSignal.

Uso:
  python ingest.py --out worldbank_ppp_2025.csv

No requiere paquetes de terceros. La app no necesita ejecutar este script en runtime:
es una utilidad reproducible de build/actualización de la base.
"""
from __future__ import annotations
import argparse, csv, json, sys, urllib.request

COUNTRIES = ["US", "GB", "ES", "BR", "MX"]
INDICATOR = "PA.NUS.PPP"
YEAR = 2025
URL = (
    "https://api.worldbank.org/v2/country/"
    + ";".join(COUNTRIES)
    + f"/indicator/{INDICATOR}?format=json&date={YEAR}&per_page=100"
)

def fetch(url: str = URL) -> list[dict]:
    req = urllib.request.Request(url, headers={"User-Agent": "CogniSignal-build/2.0"})
    with urllib.request.urlopen(req, timeout=30) as response:
        payload = json.load(response)
    if not isinstance(payload, list) or len(payload) < 2 or not isinstance(payload[1], list):
        raise RuntimeError("Respuesta inesperada de World Bank API")
    return payload[1]

def transform(rows: list[dict]) -> list[dict]:
    wanted = set(COUNTRIES)
    out = []
    for r in rows:
        code = r.get("countryiso3code")
        # API suele devolver ISO3; mapeamos explícitamente a ISO2 para evitar ambigüedad.
        iso3_to_iso2 = {"USA":"US","GBR":"GB","ESP":"ES","BRA":"BR","MEX":"MX"}
        code2 = iso3_to_iso2.get(code)
        if code2 not in wanted:
            continue
        value = r.get("value")
        if str(r.get("date")) != str(YEAR) or value is None:
            continue
        value = float(value)
        if not value > 0:
            raise ValueError(f"PPP no positivo para {code2}: {value}")
        out.append({
            "country_code": code2,
            "country": r.get("country", {}).get("value", ""),
            "year": YEAR,
            "ppp_lcu_per_intl_dollar": value,
            "indicator": INDICATOR,
            "source_url": "https://data.worldbank.org/indicator/PA.NUS.PPP",
            "license": "CC BY-4.0",
            "estado": "verificado",
        })
    got = {r["country_code"] for r in out}
    missing = wanted - got
    if missing:
        raise ValueError(f"Faltan países en la respuesta: {sorted(missing)}")
    return sorted(out, key=lambda r: COUNTRIES.index(r["country_code"]))

def write_csv(rows: list[dict], path: str) -> None:
    cols = ["country_code","country","year","ppp_lcu_per_intl_dollar","indicator","source_url","license","estado"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols)
        w.writeheader()
        w.writerows(rows)

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="worldbank_ppp_2025.csv")
    args = ap.parse_args()
    rows = transform(fetch())
    write_csv(rows, args.out)
    print(f"OK: {len(rows)} filas verificadas -> {args.out}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
