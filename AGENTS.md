# AGENTS.md · CogniSignal

Lee `BUILD_PROMPT.md` y sigue sus reglas. Comandos esperados:
- `npm ci`
- `npm run dev`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run test:e2e`
- `npm run test:vectors`
- `npm run drive:sync`
- `npm run build`

Convenciones: TypeScript strict; Route Handlers delgados; lógica de dominio pura/testeable; Zod/JSON Schema en límites; sin `any` no justificado; no PII en logs; migraciones versionadas; server-only para secrets.

Pruebas obligatorias antes de terminar: 20/20 vectores, unit, RLS, webhook idempotente si Stripe, Drive fallback, E2E principal, Lighthouse móvil >=90.

No inventes requisitos. Si una decisión de implementación no está especificada, toma la opción más simple compatible y regístrala en `DECISIONS.md`.
