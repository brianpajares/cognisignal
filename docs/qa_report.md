# QA Report · CogniSignal · Etapa 3

## Veredicto
**PASS_WITH_FIXES.** No quedan bloqueadores de integridad o reproducibilidad para pasar a PRD. El motor sigue siendo un monitor estadístico longitudinal no clínico; su utilidad clínica, fiabilidad de microtareas, suficiencia de 6 sesiones y equidad requieren validación prospectiva antes de cualquier claim diagnóstico o predictivo.

## Entrada e integridad
- `handoff.json`: `stage_completed = 2`, válido.
- Archivos esperados: completos.
- `drive_manifest.json`: 9/9 hashes originales coincidían antes de las modificaciones QA.
- Excel: 9 hojas (`LEEME`, `Diccionario`, `Parametros`, `Tablas_Paises`, `Tablas_Evidencia`, `Motor`, `Casos_Prueba`, `Fuentes`, `Changelog`).
- Errores de fórmula: ninguno encontrado en el escaneo final.
- Casos de prueba Excel ampliados de T01–T20 a T01–T30.

## A1 · Doble verificación
Se implementó `03_qa_ux/qa_engine.py` usando únicamente `model_spec.json` y los parámetros del Excel; no importa ni llama a `engine_reference.py`.
- QA independiente vs `test_vectors.json`: **20/20** vectores originales coinciden con tolerancia relativa `1e-6` y absoluta `1e-9`.
- QA independiente vs `engine_reference.py`: **20/20** vectores originales coinciden.
- Casos válidos de robustez: los dos motores coinciden.
- Motor Excel del caso reproducible T01: métricas coinciden con los vectores originales.

## A2 · Robustez
Nuevos casos T21–T30:
- quality exclusions masivas → `baseline_building`;
- confusión segundos/ms → rechazo por rango;
- NaN e Infinity → rechazo;
- fechas duplicadas → rechazo;
- fecha imposible (`2026-02-30`) → rechazo;
- >104 sesiones → rechazo;
- campos extra → rechazo;
- monotonicidad: con baseline idéntico, deterioro moderado T29 produce 17.1657 y deterioro mayor T30 produce 49.1266.
Correcciones al motor de referencia: validación real de calendario, `maxItems=104` y rechazo de propiedades extra, alineándolo con `inputs.schema.json`.

## A3 · Parámetros y licencias
Verificación web realizada el 2026-10-13:
1. EWMA λ=0.2: **verificado**. NIST sugiere 0.2–0.3. https://www.itl.nist.gov/div898/handbook/mpc/section2/mpc2211.htm
2. EWMA k=2: **verificado** como elección estadística habitual. Misma fuente.
3. EWMA k=3: **verificado** como elección estadística habitual. Misma fuente.
4. Corrección d′ +0.5 hits/FA: **verificado**. https://pmc.ncbi.nlm.nih.gov/articles/PMC3434682/
5. Corrección d′ +1 totales: **verificado**. Misma fuente.
6. RCI = (X2-X1)/SEdiff y ±1.96: **verificado**. https://pmc.ncbi.nlm.nih.gov/articles/PMC8581253/
7. PPP 2025 US 1.00: **verificado**.
8. PPP 2025 GB 0.68: **verificado**.
9. PPP 2025 ES 0.57: **verificado**.
10. PPP 2025 BR 2.55: **verificado**.
11. PPP 2025 MX 10.33: **verificado**. Fuente World Bank PA.NUS.PPP: https://data.worldbank.org/indicator/PA.NUS.PPP
12. Stripe US 2.9% + $0.30: **verificado**. https://stripe.com/pricing
13. Stripe GB 1.5% + £0.20: **verificado**. https://stripe.com/gb/pricing
14. Stripe ES 1.5% + €0.25: **verificado**. https://stripe.com/es/pricing
15. Stripe BR 3.99% + R$0.39: **verificado**. https://stripe.com/br/pricing
16. Stripe MX 3.6% + MXN3: **verificado**. https://stripe.com/mx/pricing
17. `baseline_sessions=6`: **no_verificado / preliminar**.
18. `min_valid_domains=2`: **no_verificado / preliminar**.

Licencias:
- NIST: información pública salvo material marcado como copyright. https://www.nist.gov/copyrights-disclaimers
- World Bank: datasets propios abiertos por defecto bajo CC BY-4.0; el indicador muestra CC BY-4.0. https://datacatalog.worldbank.org/public-licenses
- jsPsych: MIT. https://github.com/jspsych/jsPsych
- statsmodels: BSD-3-Clause. https://github.com/statsmodels/statsmodels
- XGBoost: Apache-2.0. https://github.com/dmlc/xgboost
- TestMyBrain: LGPLv3 para código y CC-BY-SA-4.0 para estímulos; no incorporado. https://github.com/manybrainsproject/TestMyBrainCodeRepo
- ADNI: materiales del sitio con limitaciones no comerciales/no clínicas salvo permiso; no incorporado. https://adni.loni.usc.edu/terms-of-use/
- OCTAL/MiniOCTAL: licencia académica y vía separada para comercial; no incorporado. https://octalportal.com/about/

## A4 · Coherencia producto-modelo
Hallazgo MAYOR corregido: `brief.json` aún prometía “probabilidad 0–1” y horizonte 6–12 meses. Se sustituyó por monitorización observacional intraindividual; ahora coincide con `model_spec`, `outputs_spec`, `model_card` y monetización. El free preview entrega señal, categoría y tendencia; el informe de pago desbloquea interpretación por dominio, sensibilidad, metodología y plan de seguimiento, sin canibalización completa.

## A5 · Legal, ética y privacidad
- Salud: UI e informe deben indicar “no diagnostica ni estima probabilidad de enfermedad”; un resultado estable no descarta patología; síntomas funcionales requieren consulta profesional.
- Datos: minimizar PII; email separado de resultados mediante ID pseudónimo; no GPS, audio pasivo, reconocimiento facial ni keylogging.
- Sesgo: edad, educación, país e idioma no ajustan el score v1; deben auditarse antes de cualquier norma poblacional.
- Marketing prohibido: “detecta Alzheimer”, “predice demencia”, “diagnóstico”, sensibilidad/especificidad propias sin estudio, “clínicamente validado” sin evidencia.
- Países: avisos regulatorios/locales requieren revisión jurídica antes del cobro.

## Hallazgos
- CRÍTICOS: 0 abiertos.
- MAYORES corregidos: 4 (coherencia del brief; validación de fecha; límite de 104 sesiones; rechazo de propiedades extra).
- MAYORES abiertos/preliminares: 2 de evidencia (`baseline_sessions`, `min_valid_domains`) + validación prospectiva de microtareas. No bloquean PRD si los claims permanecen no clínicos.
- MENORES: revalidar tarifas de pago inmediatamente antes de activar cobro.

## Cambios realizados
`brief.json`, `engine_reference.py` (y mirror), `test_vectors.json` (y mirror), `base_cognisignal.xlsx` (y mirror), `drive_manifest.json`, `handoff.json`, `00_START_HERE.md` y carpeta `03_qa_ux/`.
