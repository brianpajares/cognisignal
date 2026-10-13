# TASKS · M0–M5

## M0 · Fundación
- Scaffold Next.js App Router, TS strict, Tailwind, shadcn/ui, next-intl.
- Configurar lint/typecheck/Vitest/Playwright/GitHub Actions.
- Copiar variables desde `.env.example`.
**Aceptación:** `npm run build`, lint y typecheck verdes.

## M1 · Motor y contratos
- Portar CS-LCM a TypeScript.
- Validar inputs; implementar outputs/estados.
- `npm run test:vectors` con 20/20.
- Implementar OpenAPI o mantener handlers conformes.
**Aceptación:** paridad numérica dentro de rtol 1e-6/atol 1e-9.

## M2 · Datos, Drive y seguridad
- Migraciones Supabase + RLS.
- Cliente server-only con service role.
- Drive reader por nombre/ruta, SHA-256, cache 24 h, fallback.
- `drive:sync`.
**Aceptación:** pruebas RLS y fallo Drive verde.

## M3 · Producto y conversión
- Landing, onboarding, microtareas, progreso baseline, preview.
- Gate email+consentimiento, lead, PDF, Resend.
- Locales es/en/pt y a11y.
**Aceptación:** E2E onboarding→preview→solicitud→PDF→email.

## M4 · Operación y monetización
- `/admin` leads/embudo/reenvío.
- PostHog, Sentry, rate limit, Turnstile.
- Stripe detrás de `MONETIZATION_MODE=stripe`, checkout + webhook firmado/idempotente.
**Aceptación:** validación funciona sin Stripe; modo stripe pasa tests aislados.

## M5 · Release
- Lighthouse, seguridad, legal pages, SEO.
- GitHub Actions, Vercel deploy, smoke prod.
- Completar `docs/LAUNCH_CHECKLIST.md`.
**Aceptación:** Definition of Done del PRD completa.
