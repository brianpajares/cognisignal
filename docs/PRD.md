# PRD · CogniSignal
**Versión:** 4.0 · **Estado:** READY_TO_BUILD · **Fecha:** 13 octubre 2026 · **Owner:** Product/Engineering  
**Clasificación:** MVP de validación, monitorización longitudinal no diagnóstica.

## 0. Ficha y versión
CogniSignal es una aplicación web multilingüe (es/en/pt) para adultos de 55–90 años que realizan microtareas cognitivas breves de forma repetida. El producto construye un baseline personal, calcula cambio longitudinal mediante CS-LCM 1.0 y muestra una señal estadística no clínica. Versión de producto 4.0; modelo `CS-LCM-1.0`; `MONETIZATION_MODE=validation` por defecto.

## 1. Resumen ejecutivo
El MVP busca validar si usuarios 55+ completan una secuencia semanal, entienden una señal basada en su propio baseline y solicitan un informe ampliado. La hipótesis comercial se prueba antes de activar cobro. El cálculo es determinista y auditable; no diagnostica, no estima probabilidad de enfermedad y no usa percentiles poblacionales. La primera experiencia entrega vista previa gratuita y captura email/consentimiento para solicitar el informe completo. El dueño recibe la solicitud, inputs estructurados, outputs y PDF para revisión/envío.

## 2. Problema y evidencia
El usuario puede percibir cambios de memoria, atención o velocidad ejecutiva, pero una medición aislada es ruidosa y no constituye diagnóstico. CogniSignal reduce esa ambigüedad comparando al usuario consigo mismo a lo largo del tiempo. La evidencia y limitaciones de mercado están documentadas en `docs/brief_estrategico.md`, `docs/qa_report.md` y `model/model_card.md`. Cualquier utilidad clínica, fiabilidad test-retest, suficiencia de seis sesiones y equidad siguen siendo preliminares hasta validación prospectiva.

## 3. Mercado y segmentos
Mercados iniciales: Estados Unidos, Reino Unido, España, Brasil y México. Segmento primario: adultos 55–90 digitalmente autónomos con interés en seguimiento cognitivo personal. Segmento secundario: familiares/cuidadores que ayudan en el proceso sin recibir acceso automático a datos. Segmentos fuera de alcance: menores de 55, investigación clínica, diagnóstico profesional y screening poblacional.

## 4. Persona y JTBD
**Persona principal:** adulto 55+ que quiere observar si su rendimiento cambia respecto de su propio patrón habitual sin recibir un diagnóstico.  
**JTBD:** “Cuando noto o me preocupa un cambio, quiero una forma breve y repetible de observar mi tendencia personal para decidir si sigo monitorizando o si conviene conversar con un profesional.”  
**Criterios:** lenguaje simple, tareas cortas, progreso visible, accesibilidad AA y recordatorio explícito de que una señal estable no descarta enfermedad.

## 5. Competencia
La categoría incluye pruebas cognitivas, trackers de salud y herramientas clínicas. CogniSignal se diferencia por baseline intraindividual, ausencia de claims diagnósticos en MVP, transparencia metodológica y diseño de validación comercial. No incorpora estímulos propietarios de baterías clínicas ni depende de ADNI, Cogstate, OCTAL o TestMyBrain para el cálculo.

## 6. Propuesta de valor
“Observa tu cambio cognitivo respecto de tu propio baseline con una señal clara y trazable.” Beneficios: 4–5 minutos por sesión, comparación intraindividual, tendencia longitudinal, explicación de dominios en informe completo y próximos pasos no prescriptivos. Límites: no diagnostica, no predice MCI/Alzheimer/demencia y no reemplaza evaluación médica.

## 7. Alcance MVP, fuera de alcance y v2
**MVP:** onboarding, consentimiento, elegibilidad, microtareas, baseline de seis sesiones válidas, seguimiento, cálculo CS-LCM, vista previa, gate de email, PDF completo, emails, admin mínimo, Drive sync, analítica, Sentry y despliegue Vercel.  
**Fuera de alcance:** GPS, audio pasivo, keylogging, reconocimiento facial, diagnóstico, probabilidad clínica, tratamientos, benchmarking poblacional, app nativa, EHR y automatización clínica.  
**v2:** Stripe, entrega automática tras pago, suscripción/recordatorios, normas poblacionales solo después de validación, RCI cuando existan fiabilidad/SD apropiadas.

## 8. Flujo end-to-end
```mermaid
flowchart TD
A[Landing] --> B[Consentimiento y elegibilidad]
B --> C[Microtareas]
C --> D{Sesiones válidas >= 6?}
D -- No --> E[Baseline en construcción]
E --> C
D -- Sí --> F[Sesión de seguimiento]
F --> G[CS-LCM 1.0]
G --> H[Vista previa: índice, señal, tendencia, insight]
H --> I[Recibe tu informe completo]
I --> J[Email + consentimiento]
J --> K[Guardar lead y cálculo]
K --> L[Generar PDF completo]
L --> M[Email confirmación usuario]
L --> N[Email OWNER_EMAIL con PDF e inputs/outputs]
N --> O[/admin: leads, embudo, reenvío]
```

## 9. Historias de usuario US-xx con Gherkin
**US-01 · Elegibilidad.** Como visitante 55–90, quiero saber si puedo usar el producto.
```gherkin
Given que abro el onboarding
When ingreso edad, país, idioma y educación válidos y acepto el consentimiento
Then puedo iniciar la sesión y se registra el consentimiento versionado
```
**US-02 · Baseline.** Como usuario, quiero completar sesiones repetidas para crear mi referencia personal.
```gherkin
Given menos de 6 sesiones válidas
When completo una nueva sesión con quality_pass=true
Then veo progreso de baseline y no se presenta señal clínica
```
**US-03 · Señal.** Como usuario con baseline, quiero ver el cambio respecto de mi patrón.
```gherkin
Given 6 sesiones válidas y al menos una de seguimiento
When finaliza el cálculo
Then veo signal_index, category, trend_chart y free_insight
```
**US-04 · Calidad.**
```gherkin
Given una sesión marcada quality_pass=false
When se recalcula
Then la sesión se excluye y aumenta quality_excluded_sessions
```
**US-05 · Informe completo.**
```gherkin
Given una vista previa
When envío email y consentimiento
Then se crea un lead pseudónimo y se genera el PDF completo
```
**US-06 · Confirmación.**
```gherkin
Given una solicitud de informe válida
When se procesa
Then el usuario recibe confirmación y OWNER_EMAIL recibe asunto "[CogniSignal] Solicitud de informe <id>"
```
**US-07 · Admin.**
```gherkin
Given un administrador autenticado
When abre /admin
Then puede revisar leads, embudo y reenviar el informe
```
**US-08 · Drive resiliente.**
```gherkin
Given que Drive no responde
When la app requiere un archivo
Then usa la última copia válida cacheada hasta 24h y registra el fallo
```
**US-09 · Idiomas.**
```gherkin
Given locale es, en o pt
When navego
Then interfaz, emails y PDF usan el locale sin mezclar idiomas
```
**US-10 · Privacidad.**
```gherkin
Given un cálculo y un email
When persisten los datos
Then PII y resultados quedan separados por identificador pseudónimo
```
**US-11 · Stripe opcional.**
```gherkin
Given MONETIZATION_MODE=stripe
When el pago confirmado llega por webhook firmado
Then el pedido se procesa una sola vez y se entrega el PDF
```
**US-12 · Accesibilidad.**
```gherkin
Given navegación solo con teclado
When recorro el flujo principal
Then foco, labels y orden son operables y conformes a WCAG 2.2 AA objetivo
```

## 10. Requisitos FR-xx y NFR-xx
**FR-01** validar inputs según `spec/inputs.schema.json`. **FR-02** portar CS-LCM a TypeScript manteniendo paridad con `model/engine_reference.py`. **FR-03** excluir sesiones `quality_pass=false`. **FR-04** construir baseline con 6 sesiones válidas. **FR-05** exigir mínimo 2 dominios con variabilidad suficiente. **FR-06** producir todos los outputs definidos en `spec/outputs_spec.json`. **FR-07** mostrar solo outputs GRATIS en preview. **FR-08** gate email+consentimiento antes del informe completo. **FR-09** persistir leads, cálculos y pedidos en Supabase con RLS. **FR-10** generar PDF con `@react-pdf/renderer`. **FR-11** enviar confirmación y notificación a owner vía Resend. **FR-12** leer archivos Drive por nombre, verificar SHA-256, cache 24 h y fallback a última versión válida. **FR-13** `npm run drive:sync` sube `drive/`. **FR-14** admin mínimo: leads, embudo, reenvío. **FR-15** locales es/en/pt mediante next-intl. **FR-16** emitir eventos de `spec/analytics_events.json`. **FR-17** Turnstile+rate limit en endpoints sensibles. **FR-18** Sentry para excepciones. **FR-19** Stripe detrás de feature flag. **FR-20** webhook Stripe firmado e idempotente. **FR-21** almacenar versión de consentimiento. **FR-22** soportar estados baseline_building, baseline_ready y scored. **FR-23** mantener `clinical_probability=null`. **FR-24** no presentar claims diagnósticos/predictivos. **FR-25** exportar PDF completo a owner en validación.

**NFR-01** p95 de Route Handlers de lectura/cálculo <2 s sin contar proveedores externos. **NFR-02** Lighthouse móvil >=90 en Performance, Accessibility, Best Practices y SEO en rutas públicas clave. **NFR-03** TypeScript strict sin `any` no justificado. **NFR-04** pruebas Vitest + Playwright; 20/20 vectores pasan. **NFR-05** disponibilidad objetivo MVP 99.5% mensual, excluyendo mantenimiento. **NFR-06** secretos solo en variables de entorno. **NFR-07** CSP, headers seguros, validación de origen y sanitización. **NFR-08** minimización de datos y borrado/exportación administrable. **NFR-09** costo variable objetivo por informe en validación <= US$0.50 excluyendo trabajo humano; alertar si >US$1.00. **NFR-10** PDF generado <10 s p95. **NFR-11** cache Drive máximo 24 h y checksum obligatorio. **NFR-12** logs sin email ni resultados cognitivos en texto plano. **NFR-13** responsive desde 320 px. **NFR-14** WCAG 2.2 AA objetivo. **NFR-15** dependencias críticas fijadas y auditadas en CI.

## 11. Inputs
Fuente canónica: `spec/inputs.schema.json`. UX de captura y restricciones: `ux/ux_spec.md`, `ux/components.md` y `ux/sitemap_flows.md`. No duplicar el esquema en código fuera de tipos generados/compartidos.

## 12. Modelo
Fuente canónica: `spec/model_spec.json`, `model/engine_reference.py`, `model/qa_engine.py` y `model/model_card.md`. El port TypeScript debe reproducir salidas con tolerancia definida en pruebas; cualquier divergencia bloquea release.

## 13. Base de datos y Drive
Esquema SQL y RLS: `spec/db_schema.sql`. Manifest Drive: `spec/drive_manifest.json`; contenido fuente: `drive/`; operación: `docs/DRIVE_SETUP.md`. La app busca bajo `/Apps/cognisignal/` por nombre/ruta lógica, verifica checksum y registra versión.

## 14. Outputs y niveles de acceso
Fuente canónica: `spec/outputs_spec.json`. GRATIS: `signal_index`, `category`, `trend_chart`, `free_insight`. INFORME_COMPLETO: `domain_breakdown`, `personal_baseline_comparison`, `sensitivity`, `methodology`, `action_plan`, `scenarios`. SUSCRIPCION: `longitudinal_tracking`. El acceso nunca cambia el cálculo subyacente.

## 15. UX/UI
Fuente canónica: `ux/ux_spec.md`, `ux/components.md`, `spec/design_tokens.json`, `spec/copy_i18n.json` y `ux/prototype.html`. Un CTA primario por pantalla; progreso explícito; disclaimers visibles; no usar patrones alarmistas.

## 16. Informe PDF
Layout canónico: `ux/report_layout.md`. Implementar con `@react-pdf/renderer`, locales es/en/pt, ID de informe, versión del modelo, fecha, señal, tendencia, desglose, sensibilidad, metodología, plan y disclaimer. No incluir diagnóstico ni probabilidad de enfermedad.

## 17. Monetización y tracción
`MONETIZATION_MODE=validation` por defecto. Preview gratis → formulario “Recibe tu informe completo” → lead → confirmación → owner recibe inputs, resultados y PDF. La lista de espera de suscripción es opcional. Umbral operativo de activación de cobro para este build: >=25% preview→email y >=50 solicitudes en 14 días; además revisar señales heredadas de `spec/monetizacion.json` (200 previews, >=35% preview→request, repetición >=25% en 30 días). Stripe solo se activa tras decisión documentada.

## 18. Emails
Usuario: confirmación de solicitud, sin claims clínicos. Owner: asunto exacto `[CogniSignal] Solicitud de informe <id>`, ID, locale, inputs estructurados sin PII innecesaria, outputs y PDF adjunto/enlace firmado. En Stripe: confirmación de pago y entrega. SPF/DKIM/DMARC obligatorios antes de producción.

## 19. Arquitectura y stack
Next.js App Router + TypeScript strict; Tailwind + shadcn/ui; Route Handlers; motor TypeScript portado desde Python; Supabase/Postgres+RLS; Google Drive API service account; Resend; `@react-pdf/renderer`; next-intl; PostHog; Sentry; Cloudflare Turnstile; rate limit; Vitest; Playwright; GitHub Actions; Stripe feature flag. Deploy primario Vercel; Netlify como alternativa si se preservan Route Handlers/runtime compatibles.

## 20. API (OpenAPI 3.1)
Contrato completo en `spec/openapi.yaml`. Endpoints mínimos: health, calculate, report request, report PDF, admin leads/resend, Drive manifest status y Stripe webhook opcional. Validar request/response y mantener errores sin revelar datos sensibles.

## 21. Modelo de datos con RLS
Ver `spec/db_schema.sql`. Entidades: profiles/participants pseudónimos, sessions, calculations, leads, reports, orders, webhook_events, consent_records. Cliente anónimo solo puede crear sesión/lead mediante funciones o Route Handlers; lectura directa de datos sensibles denegada. Admin mediante service role exclusivamente en servidor.

## 22. Seguridad, privacidad y legal
Aplicar minimización, separación PII/resultados, cifrado en tránsito y reposo del proveedor, rotación de secretos, retención configurable, registro de consentimiento y procesos de acceso/borrado. Diseñar para GDPR, CCPA/CPRA, LGPD y Ley peruana 29733; la aplicabilidad final y textos legales deben ser revisados por asesoría jurídica local antes de escalar. No vender datos ni reutilizar resultados para entrenamiento sin consentimiento específico. Disclaimers: monitor estadístico no diagnóstico; stable no descarta patología; síntomas funcionales requieren atención profesional.

## 23. Accesibilidad e i18n
WCAG 2.2 AA objetivo. Teclado completo, foco visible, targets adecuados, contraste AA, texto escalable, `aria-live` en progreso/resultados, no depender solo de color. Idiomas es/en/pt con next-intl; formatos locales de fecha/número; ninguna cadena UI hardcodeada fuera del catálogo salvo IDs técnicos.

## 24. Analítica y KPIs
Eventos canónicos en `spec/analytics_events.json`. KPIs: visit→start >=35%; start→preview >=70%; preview→email objetivo >=25% (go-to-charge fuerte >=35%); >=50 solicitudes/14 días como señal de demanda; repetición 30d >=25%; error rate <1%; PDF success >=99%; p95 <2 s. PostHog sin PII; embudo visible en `/admin`.

## 25. SEO y adquisición
Landing indexable con metadata localizada, OpenGraph, sitemap y JSON-LD de software/website cuando corresponda. No indexar `/admin`, resultados ni URLs con IDs. Mensaje SEO evita “diagnóstico”, “predice Alzheimer” o equivalentes. Canales iniciales y mensajes en `docs/TRACTION_PLAN.md`.

## 26. Plan de pruebas
Unit: motor, validadores, permisos, cálculo de hashes. Contract: OpenAPI. Regression: 20/20 `spec/test_vectors.json`. Robustez: T21–T30 documentados en QA (calidad, unidades, NaN/Infinity, fechas, >104, extras, monotonicidad). Integration: Supabase, Drive fallback, Resend mock, Stripe mock. E2E Playwright: onboarding→preview→lead→PDF→admin. A11y: axe + teclado. Performance: Lighthouse CI. Security: RLS tests, rate-limit, Turnstile, webhook signature/idempotency.

## 27. Despliegue y operación
GitHub Actions ejecuta lint, typecheck, unit, regression, build, Playwright smoke y Lighthouse. Preview deployments por PR; producción desde rama protegida. Variables según `.env.example`. Sentry release tracking. Runbook Drive: checksum/fallback. DB migrations versionadas. Rollback por Vercel deployment y migraciones backward-compatible.

## 28. Definition of Done
Build limpio; TypeScript strict; 20/20 vectores; e2e principal verde; Lighthouse móvil >=90; RLS probado; checksums Drive válidos; emails de prueba entregados; PDF visualmente correcto en 3 locales; admin funcional; sin marcadores pendientes; sin secretos; legal/disclaimer publicado; analítica recibe eventos; Sentry recibe evento de prueba; documentación consistente; `docs/final_audit.md` PASS.

## 29. Riesgos
R1: utilidad/fiabilidad no validada → mantener claims limitados y estudio prospectivo. R2: fatiga/práctica → medir calidad y repetición. R3: ansiedad del usuario → lenguaje neutral y contexto. R4: sesgo por dispositivo/idioma → telemetría y auditoría. R5: Drive indisponible → cache/fallback. R6: fuga de PII → separación, RLS y logs minimizados. R7: baja conversión → validar antes de cobro. R8: naming/trademark → revisión antes de inversión de marca.

## 30. Supuestos
Usuarios 55+ pueden completar microtareas web de 4–5 min; cadencia semanal es aceptable; seis sesiones forman un baseline preliminar; dos dominios válidos son suficientes preliminarmente; parámetros EWMA son estadísticos, no clínicos; scoring es idéntico en baseline/seguimiento; email es un proxy razonable de intención de valor; servicio de email/Drive/Supabase está disponible en mercados objetivo.

## 31. Trazabilidad US↔FR↔test
| US | FR | Prueba |
|---|---|---|
| US-01 | FR-01, FR-21 | AT-01, AT-02 |
| US-02 | FR-03, FR-04, FR-22 | AT-03, TV-T01..T20 |
| US-03 | FR-02, FR-06, FR-07, FR-23 | AT-04, REG-20 |
| US-04 | FR-03 | AT-05 |
| US-05 | FR-08, FR-09, FR-10, FR-25 | AT-06, E2E-01 |
| US-06 | FR-11 | AT-07 |
| US-07 | FR-14 | AT-08 |
| US-08 | FR-12, FR-13 | AT-09, AT-10 |
| US-09 | FR-15 | AT-11 |
| US-10 | FR-09, FR-21 | AT-12, SEC-01 |
| US-11 | FR-19, FR-20 | AT-13 |
| US-12 | NFR-13, NFR-14 | A11Y-01 |
| US-02 | FR-05 | AT-03, REG-20 |
| US-03 | FR-16 | OBS-01 |
| US-05 | FR-17 | AT-06, SEC-02 |
| US-06 | FR-18 | OBS-01 |
| US-03 | FR-24 | CONTENT-01 |

## 32. Anexos
Orden de lectura para implementación: `README_START_HERE.md` → `BUILD_PROMPT.md` → este PRD → `TASKS.md` → `spec/*` → `ux/*` → `docs/ACCEPTANCE_TESTS.md`. Evidencia heredada permanece en `01_estrategia/`, `02_datos_modelo/` y `03_qa_ux/`. Decisiones y supuestos: `docs/decisions_log.md` y `handoff.json`.
