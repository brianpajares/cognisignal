# START HERE — CogniSignal

**Etapa completada:** 3 · QA y UX/UI  
**Estado:** PASS_WITH_FIXES  
**Modelo:** CS-LCM v1.0 · baseline personal + EWMA  
**Doble verificación:** 20/20 vectores originales coinciden entre `qa_engine.py`, resultados esperados y `engine_reference.py`  
**Casos totales:** 30 (T01–T30, incluidos 10 de robustez)  
**Siguiente agente:** 4 · Arquitecto de PRD y Paquete

CogniSignal monitoriza cambio cognitivo longitudinal observado respecto del baseline personal. **No diagnostica ni estima probabilidad de Alzheimer, MCI o demencia.**

## Qué corrigió QA
- `brief.json`: se eliminó la incoherencia residual de “probabilidad 0–1” y horizonte clínico 6–12 meses.
- `engine_reference.py`: ahora valida fechas de calendario reales, 1–104 sesiones y rechaza propiedades extra.
- `test_vectors.json`: T21–T30 añaden calidad, unidades, NaN/Infinity runtime, fechas, límites de longitud y monotonicidad.
- `base_cognisignal.xlsx`: `Casos_Prueba` y `Changelog` actualizados.
- `drive_manifest.json`: hashes regenerados tras cambios.

## UX/UI listo para PRD
La carpeta `03_qa_ux/` contiene:
- `qa_report.md`, `qa_checks.json`, `qa_engine.py`
- `ux_spec.md`, `sitemap_flows.md`
- `design_tokens.json`, `components.md`, `copy_i18n.json`
- `report_layout.md`, `analytics_events.json`
- `prototype.html` autocontenido y navegable

## Riesgos que siguen siendo preliminares, no bugs
`baseline_sessions=6` y `min_valid_domains=2` no están validados prospectivamente. También faltan fiabilidad de microtareas, efecto práctica/fatiga, equidad y validación clínica externa. Mantener claims estrictamente observacionales.

## Siguiente paso
Sube este ZIP al **Agente 4 · Arquitecto de PRD y Paquete**.
