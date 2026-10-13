# Implementation decisions

- **Development shell:** Next.js App Router, TypeScript strict mode, next-intl with Spanish, English, and Portuguese routes. This follows the supplied PRD.
- **Browser-only persistence for the first runnable slice:** session history and age/profile fields stay in localStorage. This keeps the local prototype usable without Supabase credentials and avoids silently sending sensitive observations to an unconfigured server. It does not satisfy the PRD's server-backed report/admin flows.
- **Task protocol is a prototype:** the supplied package specifies output fields and ranges but does not define validated task stimuli or a collection protocol. The current brief recognition, reaction-time, and color-word tasks are engineering scaffolding only; their thresholds and outputs are not validated. Do not present them as clinical measurements.
- **Same-day repeat policy:** one task session per calendar day is allowed because the canonical schema requires unique, strictly increasing dates and provides no within-day session sequence field.
- **Report gate boundary:** report intent UI explains that delivery is not connected. Email is not submitted or retained. No fake request success is shown.
- **Optional providers:** persistence, report delivery, Drive, monitoring, and payment must be added behind server-only adapters with RLS, encryption, and tests before launch. Stripe stays off in validation mode.
