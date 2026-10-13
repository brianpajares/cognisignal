# ACCEPTANCE TESTS · CogniSignal

## Regresión
- **REG-20:** ejecutar los 20 casos de `spec/test_vectors.json`; todos coinciden con `model/engine_reference.py` (rtol 1e-6, atol 1e-9).
- Verificar `clinical_probability === null` y `is_clinical_probability === false`.

## Funcionales
- **AT-01:** edad fuera de 55–90 rechazada.
- **AT-02:** consentimiento versionado antes de crear lead.
- **AT-03:** con <6 sesiones válidas el estado es `baseline_building`.
- **AT-04:** con baseline+follow-up se muestran solo outputs GRATIS.
- **AT-05:** `quality_pass=false` excluye sesión.
- **AT-06:** report request crea lead, report y PDF.
- **AT-07:** usuario recibe confirmación; owner recibe `[CogniSignal] Solicitud de informe <id>`.
- **AT-08:** admin lista leads/embudo y reenvía.
- **AT-09:** checksum Drive incorrecto no sustituye cache válida.
- **AT-10:** Drive caído usa última versión válida <=24 h.
- **AT-11:** es/en/pt sin strings mezclados.
- **AT-12:** email/PII no aparece en payload de analítica ni logs.
- **AT-13:** webhook Stripe rechaza firma inválida y no duplica entrega.

## Robustez heredada T21–T30
Reproducir: exclusiones masivas de calidad, unidades segundos/ms, NaN, Infinity, fechas duplicadas/imposibles, >104 sesiones, campos extra y monotonicidad de deterioro. Estos checks están descritos en `docs/qa_report.md`; no son casos serializados en `test_vectors.json`.

## No funcionales
- **PERF-01:** p95 handler de cálculo <2 s local/preview bajo carga objetivo.
- **A11Y-01:** axe sin violaciones críticas; teclado completo.
- **LH-01:** Lighthouse móvil >=90 en categorías requeridas.
- **SEC-01:** anon/authenticated no puede leer tablas sensibles directamente.
- **PDF-01:** PDF abre correctamente en es/en/pt, sin desbordes.
- **OBS-01:** Sentry captura error sintético y PostHog recibe eventos sin PII.
