# BUILD PROMPT · CogniSignal v4

Actúa como Staff Engineer responsable de entregar un MVP desplegable y probado. Trabaja sin inventar requisitos y registra toda decisión técnica no especificada en `DECISIONS.md`.

## Objetivo
Implementa CogniSignal según `docs/PRD.md` con Next.js App Router + TypeScript strict. El cálculo es no diagnóstico y debe portar exactamente `model/engine_reference.py`.

## Reglas obligatorias
- Lee primero `README_START_HERE.md`, `docs/PRD.md`, `TASKS.md`, `docs/ACCEPTANCE_TESTS.md`.
- No cambies fórmulas, umbrales, outputs ni copy clínico sin documentar y sin mantener paridad.
- Genera tipos desde los schemas cuando sea práctico.
- `clinical_probability` siempre `null`.
- No expongas service role, Drive credentials, Resend, Stripe secrets ni PII en cliente/logs.
- Implementa RLS y prueba denegación directa.
- Drive: buscar bajo carpeta configurada, verificar SHA-256, cache 24 h, fallback a última versión válida.
- `npm run drive:sync` debe subir `drive/` a `GOOGLE_DRIVE_FOLDER_ID`.
- `MONETIZATION_MODE=validation` por defecto; Stripe solo por feature flag.
- Usa next-intl para es/en/pt.
- Crea `DECISIONS.md` y registra decisiones reales, no requisitos nuevos.

## Orden de trabajo
1. Scaffold y calidad: Next.js, TS strict, Tailwind, shadcn/ui, lint/typecheck/test.
2. Port del motor y pruebas de regresión con `spec/test_vectors.json`.
3. DB/migraciones desde `spec/db_schema.sql` y Route Handlers según OpenAPI.
4. Flujo UX y microtareas conforme a `ux/*`.
5. Preview + report request + PDF + emails.
6. Drive integration + sync + checksum/cache.
7. `/admin`, analítica, Sentry, Turnstile/rate limit.
8. Stripe behind flag y webhook idempotente.
9. Playwright, Lighthouse CI, GitHub Actions.
10. Deploy preview/production y completar checklist.

## Entregables
Repositorio ejecutable, migraciones, tests, workflow CI, README técnico, DECISIONS.md, variables documentadas, Vercel-ready y sin secretos.

## Definition of Done
Cumple sección 28 del PRD y todos los tests de `docs/ACCEPTANCE_TESTS.md`; 20/20 vectores; Lighthouse móvil >=90; p95 API interno <2 s; RLS probado; PDF y emails en es/en/pt; Drive fallback probado; `docs/final_audit.md` no debe quedar contradicho.
