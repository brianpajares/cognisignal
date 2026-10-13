# CogniSignal

CogniSignal is an experimental, non-diagnostic personal tracking app. It compares repeated task observations with a person's own baseline. It does not diagnose or predict a condition, and a stable signal does not rule one out.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
cp .env.example .env.local
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default language is Spanish; English and Portuguese are available in the header. The current assessment stores age, profile choices, and session scores in this browser only. It does not send those values to a server. Do not use real clinical or personal data while evaluating the prototype.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run test:vectors
npm run build
npm run test:e2e
```

`src/lib/model.ts` is a TypeScript port of `model/engine_reference.py`; the serialized regression cases are in `spec/test_vectors.json`. All calculations set `clinical_probability` to `null`.

## Current implementation boundary

The landing page, localized public content, onboarding, memory/attention/executive task flow, local session history, personal trend preview, and calculate/health API are implemented. The task protocol is an unvalidated prototype and is not a clinical instrument. The full PRD integrations (Supabase persistence/RLS, encrypted report intake, PDF and email delivery, Google Drive sync/fallback, admin, Turnstile/rate limiting, analytics, Sentry, Stripe, and production accessibility/performance audits) need further implementation and provider configuration before production. Stripe is intentionally inactive.

Keep secrets only in deployment environment settings. See `.env.example`, `docs/DRIVE_SETUP.md`, and `docs/LAUNCH_CHECKLIST.md`. Never put secret values in the repository.
