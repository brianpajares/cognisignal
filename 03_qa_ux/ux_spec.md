# UX/UI Spec · CogniSignal

## B1 · Posicionamiento y voz
**Promesa:** ayudar a una persona 55+ a observar cambio cognitivo longitudinal respecto de su propio baseline mediante una experiencia simple, transparente y no diagnóstica.

**Tono:** calmado, preciso, adulto y no alarmista. Evitar lenguaje médico determinista. Explicar primero “qué significa para ti” y después “cómo se calcula”.

**Tres mensajes clave**
1. Tu comparación principal es contigo mismo, no con un promedio poblacional.
2. Una sesión aislada no decide: la señal usa baseline y persistencia.
3. El resultado es estadístico, no diagnóstico; la metodología y límites están visibles.

Nombre/tagline:
- ES: **CogniSignal — Observa cambios. Decide con contexto.**
- EN: **CogniSignal — See change. Decide with context.**
- PT: **CogniSignal — Veja mudanças. Decida com contexto.**

## B3 · Pantalla por pantalla

### 1. Landing `/`
**Objetivo:** iniciar evaluación con confianza.
**Jerarquía:** promesa → cómo funciona en 3 pasos → confianza → CTA único.
**Componentes:** hero, chips de confianza, mini gráfico de ejemplo, prueba social factual (“motor reproducible; fuentes visibles”), CTA.
**Estados:** normal; error de carga con CTA reintentar.
**Analítica:** `landing_view`, `assessment_start`.
**Confianza:** “No diagnóstico”, “Sin datos pasivos”, “Metodología visible”.

### 2. Calculadora multipaso `/evaluacion/:step`
**Objetivo:** completar en <90 s la capa de contexto no cognitiva y luego las microtareas.
**Móvil:** un input por pantalla; botón fijo inferior; progreso persistente.
**Desktop:** máximo un foco principal por pantalla.
**Validación:** en línea al abandonar campo; nunca esperar al submit final.
**Defaults:** idioma del navegador; país sugerido por selección explícita previa o locale, nunca por GPS; contexto “ninguno”.
**Analítica:** `step_view`, `step_complete`, `error_shown`.

### 3. Procesando `/procesando`
**Objetivo:** reducir ansiedad y explicar brevemente el cálculo.
**Contenido:** animación sutil, 3 checks: “sesiones válidas”, “baseline personal”, “tendencia EWMA”.
**Rendimiento percibido:** progreso determinista de UI ≤1.2 s; si cálculo ya acabó, completar transición, no fingir trabajo largo.
**Analítica:** `processing_view`.

### 4. Vista previa `/resultado`
**Objetivo:** entregar valor inmediato y generar curiosidad sin manipulación.
**Jerarquía:** categoría → índice → tendencia → insight → contenido premium visible/bloqueado → CTA.
**Gráfico:** línea temporal de señal + bandas de referencia; no velocímetro ni rojo dominante.
**Incertidumbre:** texto “límite estadístico” y contexto visible.
**CTA:** “Recibir mi informe completo”.
**Analítica:** `preview_view`, `report_gate_view`, `methodology_open`.

### 5. Gate de email `/informe/solicitar`
**Objetivo:** capturar intención con beneficio explícito.
**Campos:** email y checkbox de consentimiento; nada más.
**Microcopy:** ver `copy_i18n.json`.
**Privacidad:** resultados asociados internamente a ID pseudónimo; no usar email como identificador de scoring.
**Analítica:** `report_request_submit`.

### 6. Pago `/checkout`
Se muestra solo cuando Fase 2 esté activada. Un único plan focal por país y alternativa bundle secundaria. Precio localizado; incluir “pago único” y qué desbloquea. No usar countdowns, falsa escasez ni “descuento médico”.
**Analítica:** `checkout_start`, `purchase_success`.

### 7. Éxito `/informe/listo`
Confirmación + CTA “Ver informe”; no depender del correo para acceso inmediato.

### 8. Informe `/informe/:id`
Resumen superior, dominios, sensibilidad, contexto, metodología, próximos pasos, disclaimer y botón PDF. Evitar lenguaje de “riesgo de Alzheimer”.

### 9. Cómo funciona `/como-funciona`
Explicación visual de baseline → z intraindividual → compuesto → EWMA → límites. Mostrar parámetros con estado “verificado” o “preliminar”.

### 10. FAQ `/faq`
Preguntas prioritarias: “¿Diagnostica?”, “¿Por qué 6 sesiones?”, “¿Qué pasa si dormí mal?”, “¿Qué datos guardan?”, “¿Puedo comparar mi resultado con otra persona?”.

### 11. Legal `/legal/*`
Privacidad, términos, aviso médico y licencias/fuentes.

### 12. Admin `/admin`
Acceso autenticado; métricas de funnel agregadas; nunca mostrar PII junto a resultados cognitivos salvo necesidad operativa estricta.

## B4 · Conversión
- Primer valor percibido antes de 90 s en la sesión de seguimiento; durante construcción de baseline, devolver progreso y una conclusión útil (“3 de 6 sesiones válidas”).
- Barra de progreso con texto, no solo porcentaje.
- Un CTA principal por pantalla.
- Vista previa gratuita suficiente para confianza, pero desglose causal/sensibilidad/plan quedan tras gate.
- Contenido bloqueado visible con títulos concretos; sin blur excesivo.
- Prueba social solo con datos verificables: metodología, número de sesiones procesadas o testimonios reales con permiso.
- Email gate después del valor, nunca antes de mostrar la señal.

## B5 · Visualización
- `signal_index`: número grande + barra horizontal de 0–100 con marcadores de límites, no gauge radial.
- `trend_chart`: línea temporal; banda de warning/action con etiquetas de texto.
- `domain_breakdown`: barras horizontales divergentes en DE personales; dirección “más cambio” claramente indicada.
- `sensitivity`: tabla compacta + mini barras, no tornado complejo en móvil.
- `baseline comparison`: tabla actual vs baseline + DE.
- Siempre mostrar unidades y explicar que DE es desviación estándar personal.

## B6 · Accesibilidad, responsive, rendimiento
- WCAG 2.2 AA; contraste documentado en `design_tokens.json`.
- Focus visible 3 px; targets ≥44x44; labels persistentes; errores asociados con `aria-describedby`.
- No depender solo de color para categorías.
- 360 px: una columna, sticky CTA; 768 px: tarjetas apiladas; 1280 px: contenido 720 px + rail contextual.
- Soporte `prefers-reduced-motion`.
- HTML crítico <100 KB objetivo; JS de app diferido; gráficos SVG/CSS; fuentes del sistema.
- I18n: locale independiente de país; moneda por `Intl.NumberFormat`; fecha local; métricas cognitivas siempre ms/d′ sin conversión imperial.

## B7 · Confianza
En cada resultado: fuente/método accesible en un toque, fecha de cálculo, versión de motor, sesiones incluidas/excluidas y disclaimer. El ID de verificación del informe debe permitir comprobar hash/versión, no revelar identidad.
