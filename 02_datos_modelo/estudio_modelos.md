# CogniSignal · Estudio de modelos y fuentes

**Versión:** 2.0  
**Fecha:** 2026-10-13  
**Objetivo de etapa 2:** escoger un motor reproducible y comercialmente utilizable para detectar **cambio cognitivo longitudinal respecto del baseline personal**, sin diagnóstico ni probabilidad de Alzheimer/MCI/demencia.

## Decisión ejecutiva

Se elige **CS-LCM v1.0 (CogniSignal Longitudinal Change Monitor)**: estandarización intraindividual de tres dominios + EWMA unilateral de deterioro. La cifra principal sale de un cálculo determinista que puede reproducirse en Python y Excel. NIST documenta el EWMA, recomienda habitualmente λ entre 0,2 y 0,3 y factores de control k de 2 o 3. Para CogniSignal se fijan λ=0,2, k_aviso=2 y k_acción=3.  
Fuente: https://www.itl.nist.gov/div898/handbook/mpc/section2/mpc2211.htm

**Modelo de respaldo:** Reliable Change Index (RCI, Jacobson–Truax) cuando existan para cada tarea una SD y una fiabilidad test–retest válidas en la población objetivo. La fórmula y el umbral \|RCI\|>1,96 están bien establecidos, pero aplicarlos hoy con coeficientes prestados de otro test sería metodológicamente incorrecto.  
Referencia de fórmula: https://pmc.ncbi.nlm.nih.gov/articles/PMC8581253/

### Cambio respecto del brief de etapa 1

Se elimina de v1 la salida “probabilidad calibrada de declive en 6–12 meses”. No se encontró una base longitudinal, comercialmente limpia y directamente compatible con las tres microtareas del MVP que permita calibrar esa probabilidad sin inventar transferencia entre instrumentos. La v1 informa **cambio observado y persistencia estadística**. Un modelo predictivo supervisado queda condicionado a datos propios prospectivos o a un dataset con licencia comercial explícita y variables equivalentes.

## Evidencia de que el enfoque remoto/longitudinal es plausible

- Una revisión de evaluación cognitiva web en adultos mayores concluye que la medición remota repetida puede mejorar la fiabilidad dentro de persona, aunque advierte gran heterogeneidad psicométrica y confusores de entorno/dispositivo: https://pmc.ncbi.nlm.nih.gov/articles/PMC10487375/
- Brain on Track, una prueba web longitudinal autoaplicada, reportó AUC 0,75, alfa 0,90 y ICC >0,70 en 9/10 subtests, demostrando que el seguimiento web longitudinal puede ser psicométricamente viable: https://pmc.ncbi.nlm.nih.gov/articles/PMC4705487/
- En 2026, OCTAL reportó AUC 0,92 para un screen de 5 minutos y fiabilidad test–retest ICC ≥0,79; sin embargo su plataforma está sujeta a propiedad intelectual/licencia académica y el uso comercial requiere licencia: https://pmc.ncbi.nlm.nih.gov/articles/PMC12909784/ y https://octalportal.com/about/
- Cogstate reportó en 2026 validez, fiabilidad y sensibilidad longitudinal en administración remota no supervisada, pero es un producto propietario y por tanto se usa como benchmark, no como dependencia del motor: https://www.cogstate.com/publication/remote-unsupervised-assessment-of-cognitive-impairment-and-decline-in-alzheimers-disease-using-the-cogstate-brief-battery-in-adni-3/

## Matriz comparativa

| Candidato | Tipo | Precisión/evidencia reportada | Licencia comercial | Coste por consulta | Latencia | Explicabilidad | Dependencia externa | Veredicto |
|---|---|---|---|---:|---|---|---|---|
| **CS-LCM v1.0: z intraindividual + EWMA** | Fórmula publicada adaptada | No tiene AUC clínica genérica; EWMA es un método estándar para detectar deriva pequeña/persistente. Validar sensibilidad/especificidad prospectivamente. | Implementación propia; parámetros basados en información pública NIST. | **US$0 de inferencia externa** | Local, milisegundos | Muy alta | Ninguna | **PRINCIPAL** |
| **RCI Jacobson–Truax** | Fórmula publicada | \|RCI\|>1,96 indica cambio mayor que el esperado por error de medida bajo supuestos del método. | Fórmula matemática utilizable; referencias bibliográficas. | US$0 | Local | Muy alta | Necesita SD y fiabilidad de cada tarea | **RESPALDO** |
| Mixed-effects longitudinal | ML/estadístico entrenable | Precisión depende del dataset; adecuado para pendientes y medidas repetidas. | statsmodels BSD-3-Clause | US$0 | Local | Alta | Dataset longitudinal | Futuro cuando haya datos propios |
| XGBoost calibrado | ML entrenable | Precisión depende del dataset; puede capturar no linealidad. | Apache-2.0 | US$0 | Local | Media | Dataset etiquetado + calibración | No v1; riesgo de sobreajuste/explicabilidad |
| Brain on Track | Benchmark publicado | AUC 0,75; alfa 0,90; ICC>0,70 en 9/10 subtests | No se verificó licencia comercial del instrumento/código | Desconocido | Remoto | Media | Instrumento ajeno | Benchmark, no incorporar |
| OCTAL / MiniOCTAL | Plataforma cerrada/licenciable | AUC 0,92 (5 min); 0,97 en subset 20 min; ICC≥0,79 | Licencia académica; uso comercial por OUI | Cotización | Externa | Media/alta | Alta | Descartado para MVP |
| Cogstate Brief Battery | Plataforma cerrada | Estudio ADNI-3 2026: remoto válido/fiable/sensible a deterioro relacionado con AD | Propietaria | Cotización | Externa | Media | Alta | Descartado como cálculo principal |
| TestMyBrain | Código open source de tareas | Validación web disponible; no es un predictor longitudinal por sí mismo | LGPLv3; estímulos CC-BY-SA 4.0 salvo excepciones | US$0 | Local | Alta | Copyleft/atribución | No copiar en v1; mantener como referencia |
| ADNI + modelo supervisado | Dataset longitudinal + ML | Gran evidencia científica, pero no equivalente a las microtareas del MVP | Términos/DUA restringen reutilización y el sitio declara uso personal/no comercial salvo permiso | Acceso regulado | Entrenamiento pesado | Variable | Muy alta | **Descartado para producto comercial v1** |

Fuentes de licencias/software:  
- NIST: https://www.nist.gov/copyrights-disclaimers  
- statsmodels: https://github.com/statsmodels/statsmodels  
- XGBoost: https://github.com/dmlc/xgboost  
- jsPsych (recomendado como framework de ejecución de tareas, no como modelo): https://github.com/jspsych/jsPsych  
- TestMyBrain: https://github.com/manybrainsproject/TestMyBrainCodeRepo  
- ADNI terms: https://adni.loni.usc.edu/terms-of-use/

## Métricas de microtareas recomendadas

1. **Memoria de reconocimiento:** d′ = Φ⁻¹(H) − Φ⁻¹(FA). Para evitar infinitos en tasas 0/1, usar corrección log-lineal: `(hits+0,5)/(n_signal+1)` y `(false_alarms+0,5)/(n_noise+1)`. Evidencia del método/corrección: https://pmc.ncbi.nlm.nih.gov/articles/PMC3434682/
2. **Atención/velocidad:** mediana de RT correcto en milisegundos de una tarea de elección simple, con estímulos propios.
3. **Ejecutiva/inhibición:** IES = RT_correcto / proporción_correcta, en ms. Es una métrica conocida para integrar velocidad y precisión, pero tiene limitaciones; por ello se interpreta solo contra el baseline de la misma persona: https://pmc.ncbi.nlm.nih.gov/articles/PMC11493209/

**Implementación de tareas:** construir estímulos originales con jsPsych (MIT) para evitar copiar material de tests clínicos protegidos. No llamar a las tareas “MoCA”, “MMSE”, “Trail Making”, “Digit Symbol”, etc. si no se dispone de derechos correspondientes.

## Por qué no se usan normas por edad/educación/país en v1

Una corrección demográfica puede mejorar interpretación poblacional, pero transferir normas de una batería distinta a microtareas propias sería una falsa precisión. En v1, edad, educación, país e idioma son metadatos/UX y **no modifican el score numérico**. El motor se apoya en la comparación intraindividual. La normalización poblacional queda como V2 tras recolección prospectiva y análisis de sesgo.

## Criterios para promover a un modelo supervisado V2

No activar un claim predictivo hasta disponer de:
1. Cohorte prospectiva con las mismas tareas y timestamps del producto.
2. Definición pre-registrada de outcome y horizonte.
3. Split por persona (nunca por sesión), validación temporal y externa.
4. AUC ≥0,75, Brier ≤0,18 y calibration slope 0,8–1,2, conforme a metas del brief.
5. Auditoría de rendimiento por edad, sexo si se recoge, educación, idioma, país/dispositivo.
6. Licencia/derechos de uso comercial explícitos para cualquier dato externo.


## Monetización ligada al modelo

La vista gratuita enseña la cifra principal, categoría, un gráfico de tendencia y un insight estructurado. El informe completo reserva el desglose por dominio, sensibilidad, escenarios, control de calidad y plan de seguimiento: son los elementos que explican **por qué** cambió la señal y **qué hacer después**, sin convertirlos en diagnóstico.

La fase 1 no cobra: captura email + consentimiento para enviar el informe completo y medir intención real. El cobro se activa solo tras ≥200 previews, conversión preview→solicitud de informe ≥35% y repetición a 30 días ≥25% durante cuatro semanas estables. En fase 2 se proponen US$39 / £29 / €24,99 / R$99 / MX$399 por informe, con bundles de 3 informes. La suscripción queda bloqueada hasta demostrar recurrencia.

El coste del modelo es US$0 por consulta porque el cálculo es local y determinista. El único coste variable cuantificado en esta etapa es la comisión de pago por país; infraestructura, email, almacenamiento, impuestos, reembolsos y soporte quedan explícitamente preliminares hasta seleccionar proveedores. Por ello el margen reportado es margen de contribución antes de infraestructura, no margen contable final.

## Entrenamiento

`train.py` **no aplica en v1**: CS-LCM es un motor estadístico determinista sin coeficientes entrenados. Si V2 adopta mixed-effects/XGBoost con datos propios, deberá añadirse un `train.py` reproducible con semilla fija, split por persona, métricas de discriminación/calibración y exportación de artefactos.
