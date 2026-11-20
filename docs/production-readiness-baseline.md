# Production Readiness Baseline

Audit date: 2026-11-20

This document records the repository-level baseline before production-hardening work. It intentionally does not include environment variable values, credentials, or other secrets. Findings below describe code and schema in this checkout; live Supabase project settings and deployed policies still need to be inspected separately.

## Repository snapshot

- Next.js App Router application with 93 `app/**/page.js` routes.
- Supabase JavaScript client is initialized in `lib/supabase.js` from `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `DATABASE_SCHEMA.sql` defines users, categories, products, orders, API keys, audit logs, notifications, files, analytics data, user permissions, and events.
- The app includes client-side auth, demo role switching, direct browser-to-Supabase service calls, an import flow, and five Playwright E2E journeys.
- `package.json` and `package-lock.json` both declare `@playwright/test` at `^1.41.2`.
- No repository GitHub workflow or Next.js middleware file was found in this checkout.
- At audit time, the checkout was on `main`, tracking `origin/main`, with a clean working tree.

## Security findings to resolve

1. `app/contexts/AuthContext.js` initializes a first-time visitor as the first demo account when no local signed-out marker exists. This is convenient for a demo but must not be enabled in production.
2. `services/authService.js` falls back to matching an email in `public.users` after Supabase password sign-in fails. A directory match is not proof of identity; this fallback must be removed from production authentication.
3. `AuthContext` role flags and UI guards run in the browser. They improve the interface but cannot authorize database mutations. Every privileged action needs trusted server/database authorization.
4. `DATABASE_SCHEMA.sql` enables RLS on `users`, `products`, `orders`, `audit_logs`, and `notifications`, but not on the other defined tables. Its policy set does not define a complete least-privilege CRUD policy for each table.
5. The `users` self-update policy does not restrict sensitive columns such as `role`, `status`, or workspace membership. The schema needs explicit protection against self-promotion and unauthorized account changes.
6. No workspace/tenant identifier or membership relation is present in the schema. Customer-to-customer data isolation is therefore not represented by this database model.

## Reliability findings to resolve

- Order creation, stock adjustment, and audit logging are separate operations in `services/orderService.js`; failures can leave partially applied state.
- Bulk imports write records sequentially and keep import history in browser `localStorage`. That history is browser-specific and is not an authoritative shared job ledger.
- Several data services perform browser-side schema probing. This is compatibility logic, not a replacement for versioned migrations and a stable database contract.
- The Playwright suite covers five key journeys but does not yet establish auth bypass, direct RLS denial, tenant isolation, write rollback, or concurrent stock-update behavior.
- No CI workflow was found to run release checks automatically.

## Immediate release decision

Do not connect real customer workspaces or sensitive customer data to the current demo authentication and authorization model. The first hardening milestone is to remove implicit/demo authentication from production, require valid Supabase Auth sessions, and then implement workspace-aware RLS policies that are verified with direct database/API tests.

## Verification limits

This is a static repository audit. The live Supabase project's deployed schema, RLS policies, Auth configuration, secrets, backups, and Vercel environment settings were not inspected. No lint, build, or E2E command was run for this baseline.
