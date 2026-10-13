# CogniSignal — Brief estratégico · Etapa 1

**Versión:** 1.0  
**Fecha:** 13 de octubre de 2026  
**Veredicto:** **PIVOT · 84/100**  
**Estado:** listo para Agente 2 (Datos y Modelo)

> Nota de naming: la idea llegó como **CogniWatch**. Se renombra a **CogniSignal** porque “CogniWatch” ya aparece públicamente en otros productos/proyectos, incluido un dominio activo y proyectos cognitivos/monitorización. El nombre final debe pasar búsqueda de marca y dominio antes de lanzamiento.

## 1. One-liner

Para adultos de 55+ y sus hijos cuidadores que notan cambios de memoria pero no saben si son variación normal o una señal que merece evaluación, **CogniSignal** predice el **riesgo de cambio cognitivo significativo respecto del baseline personal** a partir de micropruebas digitales de 4–5 minutos y datos simples de contexto, y entrega una **señal longitudinal explicable + informe para conversar con un profesional**, para que actúen antes **sin presentar un diagnóstico**.

**Pivot aplicado:** se elimina del MVP la promesa “detecta Alzheimer 2–7 años antes”. Es demasiado fuerte para un producto B2C inicial y elevaría de inmediato el riesgo regulatorio, clínico y reputacional. El producto debe detectar **cambio cognitivo longitudinal**, no enfermedad.

## 2. Dolor global con evidencia

| Dato | Cifra | Año | Región | Fuente |
|---|---:|---:|---|---|
| Personas que viven con demencia | **57 millones** | 2021 | Mundial | OMS [S1] |
| Casos nuevos | **casi 10 millones/año** | referencia OMS 2026 | Mundial | OMS [S2] |
| Coste económico | **USD 1,3 billones** | 2019 | Mundial | OMS [S3] |
| Cuidado informal | **5 h/día promedio** | dato citado por OMS 2026 | Mundial | OMS [S4] |
| Personas con demencia en LMIC | **>60%** | 2021 | Mundial | OMS [S5] |
| Riesgo asociado a factores modificables | **hasta 45%** potencialmente prevenible/retrasable | 2026 | Mundial | OMS [S6] |
| Población mundial 60+ proyectada | **1.411 millones** | 2030 | Mundial | ONU DESA [S7] |
| Alzheimer en 65+ EE.UU. | **7,4 M; ~11% (1 de 9)** | 2026 | EE.UU. | Alzheimer's Association [S8] |

**Cuántas personas:** el TAM demográfico no son “todos los 60+”, sino el subconjunto preocupado por memoria, con factores de riesgo, antecedentes familiares o cambios funcionales. Aun así, el techo demográfico es enorme: 1.411 millones de personas 60+ proyectadas para 2030.

**Frecuencia del dolor:** no es un evento puntual. La incertidumbre reaparece cada vez que ocurre un olvido, una repetición, un error funcional o una consulta médica; para familias con deterioro real puede ser diaria. La OMS estima además una carga media de **5 horas diarias** de cuidado informal en demencia.

**Coste actual:** la demencia generó **USD 1,3 billones** en costes globales en 2019. Esto no es “gasto disponible para la app”, pero prueba que el problema tiene coste económico masivo. En EE.UU., Neurotrack cita un coste anual medio por beneficiario Medicare de **US$44.814** con Alzheimer u otras demencias vs **US$15.053** sin ellas, una señal B2B2C relevante aunque no se usa como supuesto de ahorro del MVP.

## 3. Señales de demanda

### Búsqueda
- La literatura de Google Trends encontró que el interés global por Alzheimer subió de forma sostenida entre 2014 y 2020; entre temas relacionados, **“Dementia” tuvo RSV 100**, y también crecieron *early onset*, *cognitive* y *caregiver* [S12].
- **“memory loss evaluation”** aparece con ~**1.300 búsquedas/mes en UK** en una fuente SEO secundaria. Se marca **preliminar**: útil como dirección, no como dato para forecast.
- Clúster a validar con Semrush/Google Keyword Planner: **memory test, dementia test, Alzheimer's test, memory loss, cognitive test, early signs of dementia, memory test for parents, cognitive decline test**.
- **Open issue:** no se obtuvo en esta etapa un dataset consistente de volumen absoluto multi-país; Agente 4/Go-to-market debe validar volumen, CPC y dificultad antes del modelo SEO.

### Comunidades
- r/dementia y r/DementiaHelp muestran en 2026 preguntas recurrentes sobre señales tempranas, incertidumbre (“algo está mal”), pruebas inconclusas y deseo de **monitorizar declive**, no solo hacer un test único.
- Disparadores narrativos frecuentes: repetir historias, olvidar medicación/bills, perder noción de fechas, cambios de atención, conducción o tareas instrumentales.

### Gasto en alternativas
- Evaluaciones neuropsicológicas y clínicas, pruebas digitales B2B, biomarcadores, PET/MRI y consultas especializadas.
- BrainCheck publica **US$350/mes** por 10 baterías + **US$25** por batería adicional para su plan clínico.
- El mercado global de diagnóstico de Alzheimer se estima en **US$10,2B (2026)** y **US$21,5B (2033)**, CAGR 11,2% [S9]. Es fuente secundaria y se usa como contexto, no como TAM exacto de CogniSignal.

## 4. Competencia y hueco

| Alternativa | Precio visible | Modelo | Debilidad frente a CogniSignal |
|---|---|---|---|
| BrainCheck | US$350/mes / 10 baterías + US$25 extra | B2B clínico | Coste/fricción altos; orientado a profesionales y dispositivo médico |
| Cogstate Cognigram | Cotización | Healthcare + research | 10–15 min; foco institucional, no hábito B2C ultracorto |
| Linus Health | Cotización | B2B healthcare/life sciences | iPad/provider workflow; screening puntual muy fuerte |
| Altoida | Cotización | Investigación/healthcare | AR/tablet; producto más complejo y regulatoriamente ambicioso |
| Neurotrack | Cotización | Health plans/providers | B2B2C; menos auto-servicio directo para familia |

**Hueco:** un producto **B2C directo, longitudinal, de 4–5 minutos, centrado en baseline personal y cambio**, que no se vende como “diagnóstico desde casa” sino como **señal para decidir cuándo conversar con un profesional**. La mayoría de competidores fuertes están optimizados para workflows clínicos, trials o pagadores.

## 5. Público

### Segmentos
1. **Principal: adultos 55–74 preocupados por cambios de memoria.** Tienen autonomía digital y motivación para medir antes de entrar al sistema clínico.
2. **Hijos/cuidadores 35–60.** Detectan cambios antes que el propio adulto en algunos casos y tienen urgencia por “saber si esto merece consulta”.
3. **B2B2C futuro: clínicas, planes de salud y programas de healthy aging.**

### Países de entrada
1. **United States:** prevalencia y WTP altas; ecosistema de diagnóstico maduro. Claims conservadores por FDA.
2. **United Kingdom:** inglés, mercado digital, presión de acceso; revisar MHRA.
3. **Brazil:** escala y portugués; fuerte oportunidad PPP/LATAM.
4. **Mexico:** mercado hispano grande y adyacencia a EE.UU.
5. **Spain:** envejecimiento y UE; entrar tras estrategia MDR.

### Persona principal
**“Laura, 61”**: profesional/retirada activa, usa smartphone y banca online, ha notado que repite preguntas o tarda más en recordar nombres. No quiere “que una app le diga que tiene Alzheimer”; quiere saber si existe **un cambio real respecto de ella misma** y si debe pedir cita.

### JTBD
“Cuando noto que mi memoria ya no se siente igual, ayúdame a distinguir ruido cotidiano de un cambio persistente y dame una forma objetiva de explicarlo en consulta.”

### Disparador de compra
El momento exacto es **después de un incidente concreto**: olvidar un pago/medicación/cita, repetir una conversación, perderse en una ruta familiar, recibir un comentario de un hijo o salir de una consulta con “vigilemos y vuelva en unos meses”.

## 6. Tres enfoques y elección

Escala 1–5; en **riesgo legal, 5 = menor riesgo**.

| Enfoque | Valor | Precisión alcanzable | Inputs fáciles | Coste op. | Viralidad | Riesgo legal | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| A. Daily Cognitive Signal | 5 | 4 | 5 | 5 | 4 | 4 | **27** |
| B. Passive Life Sensor | 5 | 3 | 4 | 2 | 2 | 1 | **17** |
| C. One-shot Alzheimer Predictor | 5 | 1 | 4 | 4 | 4 | 1 | **19** |

**Elegido: A. Daily Cognitive Signal.** Es el mejor equilibrio entre valor, modelabilidad, privacidad, rapidez y regulación. El enfoque pasivo (GPS, tipeo, escucha) se reserva para investigación/V2; el predictor directo de Alzheimer se descarta como claim de MVP.

## 7. Qué predice

**Variable objetivo:** probabilidad calibrada de que el **score cognitivo compuesto** muestre un **descenso persistente y relevante respecto del baseline personal** en una ventana de 6–12 meses.

**Unidad:** probabilidad 0–1 + score 0–100 + categoría **Stable / Watch / Discuss with a clinician**.

**Horizonte:** seguimiento observado semanal/mensual; predicción 6–12 meses solo si el Agente 2 encuentra dataset longitudinal adecuado.

**Granularidad:** por usuario y por dominio: memoria, atención/velocidad y función ejecutiva.

**Tipo de problema:** clasificación/puntaje de riesgo longitudinal. Para MVP puede comenzar con un **motor determinista estadístico** de desviación intraindividual y calidad de sesión. Después, modelo supervisado calibrado.

**Candidatos de modelo:**
- z-score intraindividual + ajuste por efecto de práctica + reglas de persistencia;
- modelos de efectos mixtos para pendiente longitudinal;
- regresión logística / gradient boosting con datasets longitudinales abiertos/licenciables;
- supervivencia/Cox para conversión a MCI si existe etiqueta y horizonte apropiados;
- validación contra casos/publicaciones, nunca un LLM como calculadora.

**Regla de fábrica:** el cálculo es determinista o ML entrenado; el LLM solo transforma outputs estructurados en lenguaje comprensible.

## 8. Inputs — hipótesis

1. Edad.
2. País e idioma.
3. Nivel educativo en rangos.
4. Percepción de cambio en los últimos 6 meses.
5. Sueño de la noche anterior.
6. Contexto que pueda distorsionar rendimiento (enfermedad aguda/estrés/medicación, opcional y categórico).
7. Tres microtareas: memoria, atención/velocidad, inhibición/ejecutiva.
8. Repetición semanal para construir baseline/tendencia.

Todos deben conocerse o completarse en <2 minutos fuera del tiempo de test. **No** laboratorio, cámara obligatoria, wearables ni sensores especiales.

## 9. Alcance MVP

### IN
- Landing y onboarding EN/ES/PT.
- Consentimiento + disclaimer médico.
- Test 4–5 min, tres tareas.
- Score de calidad de sesión.
- Preview <90 s después de terminar.
- Email gate para informe completo; copia al dueño (Fase 1).
- Informe longitudinal y siguientes pasos.
- Repetición por enlace/email.

### OUT
- Diagnóstico de Alzheimer/MCI/demencia.
- Claim “2–7 años antes”.
- GPS continuo, keylogging, reconocimiento facial o escucha pasiva.
- Biomarcadores, EHR, wearables.
- Tratamiento o recomendación farmacológica.
- Evaluación de capacidad legal.

### V2
- Voz activa opt-in.
- Integraciones de salud.
- Portal cuidador con consentimiento.
- Estudio prospectivo y ruta SaMD.
- B2B2C.

## 10. Métricas y metas

### Producto
- Visita → inicio: **≥35%**
- Inicio → vista previa: **≥70%**
- Vista previa → solicitud de informe: **≥35%**
- Solicitud → pago en Fase 2: **≥12%**

### Modelo
- AUC decline/no-decline: **≥0,75** en validación externa antes de claim predictivo.
- Brier: **≤0,18**; calibration slope **0,8–1,2**.
- Test-retest ICC en usuarios estables: **≥0,80**.
- Sensibilidad a cambio predefinido: **≥80%** con especificidad **≥70%**, sujeto a dataset y definición clínica.

### Negocio
- CAC blended: **≤US$18**.
- ARPP: **US$29–49** informe inicial / **US$79–99** bundle trimestral.
- Margen bruto por informe: **≥85%** si no hay revisión humana.

## 11. Modelo de negocio

**Gratis:** test + preview + educación.  
**Fase 1 VALIDACIÓN:** email para recibir informe completo; el dueño recibe copia. No cobro.  
**Fase 2 COBRO:** informe completo detrás de pasarela; test de precio.

| País | Informe | Bundle 3 meses | Lógica |
|---|---:|---:|---|
| US | **US$39** | **US$89** | WTP y coste alternativo altos |
| UK | **£29** | **£69** | PPP |
| Spain | **€29** | **€69** | PPP |
| Brazil | **R$79** | **R$179** | PPP, estimación |
| Mexico | **MX$349** | **MX$799** | PPP, estimación |

**Upsells:** 2 perfiles familiares; seguimiento 6 meses; informe bilingüe; licencias B2B2C.  
**Canales:** SEO programático, comunidades, creadores 50+/longevity, clínicas, newsletters de caregiving.  
**Gancho viral:** tarjeta “My cognitive baseline is set” sin score médico; invitar a un familiar a crear su baseline.

## 12. Riesgos y mitigación

| Riesgo | Nivel | Mitigación |
|---|---|---|
| Regulación SaMD | Muy alto | Claims de wellness/monitoring; no diagnóstico; revisión legal por país |
| Falsos positivos / ansiedad | Muy alto | Repetición, persistencia, incertidumbre y derivación |
| Falsos negativos | Alto | Resultado estable no descarta enfermedad; red flags |
| Privacidad | Alto | Minimización, cifrado, borrado; sin GPS/keylogging MVP |
| Sesgo cultural/educativo | Alto | Tareas language-light, baseline personal, validación EN/ES/PT |
| Dataset/licencias | Medio-alto | Agente 2 confirma acceso/licencia; fallback estadístico |
| Competencia | Medio | B2C directo + longitudinal + <5 min + precio |

**Regulación crítica:** la FDA autorizó en 2025 un análisis sanguíneo para **ayudar** al diagnóstico en pacientes 55+ sintomáticos, dentro de un contexto clínico. BrainCheck, incluso como Class II, advierte que no debe interpretarse como dispositivo diagnóstico independiente. Esto refuerza el posicionamiento prudente del MVP.

## 13. Scorecard y veredicto

| Dimensión | Peso | Score |
|---|---:|---:|
| Mercado | 25 | **23** |
| Dolor | 20 | **20** |
| Disposición a pagar | 20 | **16** |
| Factibilidad datos/modelo | 15 | **10** |
| Viralidad | 10 | **7** |
| Rapidez MVP | 10 | **8** |
| **TOTAL** | **100** | **84** |

### Veredicto: **PIVOT — 84/100**
La necesidad es enorme, frecuente y costosa; hay demanda y gasto institucional. La idea original falla por **sobrepromesa predictiva, privacidad y regulación**. Aplicado el pivot a **señal longitudinal de cambio cognitivo**, el MVP es rápido, globalizable y puede validarse antes de asumir una ruta de dispositivo médico.

## Decisiones registradas
1. Renombrar CogniWatch → **CogniSignal** por conflicto público de naming; búsqueda legal/dominio pendiente.
2. Eliminar claim “Alzheimer 2–7 años antes”.
3. Eliminar sensores pasivos del MVP.
4. Diseñar primero un baseline longitudinal B2C con 3 microtareas.
5. Fase 1 sin cobro: email gate + copia al dueño.
6. Agente 2 debe decidir si el MVP usa motor estadístico determinista o ML longitudinal según datos/licencias.

## Supuestos
- Usuario objetivo puede completar 4–5 min de tareas web con smartphone/desktop.
- El valor percibido está más en “¿estoy cambiando?” que en un brain-game score genérico.
- Repetición semanal produce suficiente señal longitudinal para un baseline práctico.
- Pricing es hipótesis; validar con intent-to-pay.
- EN/ES/PT pueden lanzarse con normalización y QA cultural, no simple traducción.

## Open issues para Agente 2
- Dataset longitudinal utilizable comercialmente y licencias (ADNI u otros).
- Definición operacional de “declive persistente relevante”.
- Tareas exactas y propiedad intelectual/licencias.
- Efecto de práctica y normas por edad/educación/idioma.
- Validación de AUC/calibración posible con datos disponibles.
- Volumen keyword absoluto multi-país pendiente.
- Revisión regulatoria específica antes de claims de performance.

## Fuentes

- **[S1]** Personas que vivían con demencia — 57 millones (2021 (OMS, ficha actualizada 2026), Mundial). https://www.who.int/news-room/fact-sheets/detail/dementia
- **[S2]** Casos nuevos de demencia por año — casi 10 millones/año (2026 (referencia epidemiológica OMS), Mundial). https://www.who.int/news-room/fact-sheets/detail/dementia
- **[S3]** Coste económico de la demencia — USD 1,3 billones (trillion US) (2019, Mundial). https://www.who.int/news-room/fact-sheets/detail/dementia
- **[S4]** Carga media de cuidado informal — 5 horas/día (2019/2026, Mundial). https://www.who.int/news-room/fact-sheets/detail/dementia
- **[S5]** Personas con demencia en países de ingresos bajos y medianos — >60% (2021, Mundial). https://www.who.int/news-room/fact-sheets/detail/dementia
- **[S6]** Riesgo de demencia potencialmente prevenible o retrasable asociado a factores modificables — hasta 45% (2026, Mundial). https://www.who.int/es/news/item/15-07-2026-new-who-guidelines--up-to-45--of-dementia-risk-could-be-prevented-or-delayed
- **[S7]** Población mundial de 60+ proyectada — 1.411 millones (2030, Mundial). https://population.un.org/dataportal/data/indicators/70/locations/900/start/1999/end/2030/table/pivotbyvariant
- **[S8]** Adultos 65+ con Alzheimer en EE.UU. — 7,4 millones; ~1 de cada 9 (11%) (2026, Estados Unidos). https://www.alz.org/alzheimers-dementia/facts-figures
- **[S9]** Mercado global de diagnóstico de Alzheimer — USD 10,2B en 2026; USD 21,5B en 2033; CAGR 11,2% (2026-2033, Mundial). https://www.grandviewresearch.com/industry-analysis/alzheimers-disease-diagnostics-market-report
- **[S10]** FDA: primer análisis sanguíneo autorizado para ayudar al diagnóstico de Alzheimer — Autorizado para adultos 55+ sintomáticos; no es prueba independiente (2025, Estados Unidos). https://www.fda.gov/news-events/press-announcements/fda-clears-first-blood-test-used-diagnosing-alzheimers-disease
- **[S11]** Validez de evaluación cognitiva remota Cogstate en ADNI-3 — Evaluaciones remotas válidas, fiables y sensibles a deterioro relacionado con AD (2026, EE.UU./estudio ADNI). https://www.cogstate.com/publication/remote-unsupervised-assessment-of-cognitive-impairment-and-decline-in-alzheimers-disease-using-the-cogstate-brief-battery-in-adni-3/
- **[S12]** Interés de búsqueda relacionado con Alzheimer — tendencia global al alza 2014-2020; 'Dementia' RSV=100 entre temas relacionados (2004-2020, Mundial + 6 países anglófonos). https://pmc.ncbi.nlm.nih.gov/articles/PMC8703029/