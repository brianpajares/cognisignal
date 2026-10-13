# START HERE · CogniSignal v4

Este paquete convierte la salida de Etapa 3 en un build package autocontenido para un LLM programador.

## Orden de lectura
1. `BUILD_PROMPT.md`
2. `docs/PRD.md`
3. `TASKS.md`
4. `docs/ACCEPTANCE_TESTS.md`
5. `spec/inputs.schema.json`, `spec/model_spec.json`, `spec/outputs_spec.json`
6. `model/engine_reference.py` y `spec/test_vectors.json`
7. `spec/openapi.yaml` y `spec/db_schema.sql`
8. `ux/*`
9. `docs/DRIVE_SETUP.md`, `docs/LAUNCH_CHECKLIST.md`, `docs/TRACTION_PLAN.md`
10. `docs/final_audit.md`

## Regla principal
No inventar requisitos. El motor TypeScript debe igualar el motor Python y los 20 vectores serializados. Los 10 checks T21–T30 son robustez documentada, no casos serializados. `clinical_probability` permanece `null`.

## Stack
Next.js App Router + TypeScript strict, Tailwind + shadcn/ui, Supabase RLS, Google Drive API, Resend, react-pdf, next-intl, PostHog, Sentry, Turnstile, Vitest, Playwright y Vercel. Stripe detrás de flag.

## Histórico preservado
`01_estrategia/`, `02_datos_modelo/` y `03_qa_ux/` contienen el trabajo acumulativo recibido. Los artefactos normalizados para build están en `docs/`, `spec/`, `model/`, `ux/` y `drive/`.
