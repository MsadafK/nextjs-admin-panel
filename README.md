# NexAdmin — Monochrome SaaS Admin Workspace

NexAdmin is a responsive, monochrome administration workspace built with Next.js and Supabase. It brings catalog and inventory operations, user administration, calendar and messaging workflows, analytics, security controls, and system health into one App Router application.

The interface uses a strict black-and-white visual system, CSS-variable-backed theme tokens, reusable route managers, and responsive layouts. Live records are loaded through focused service modules that normalize database rows before pages render them.

## Contents

- [Product overview](#product-overview)
- [Architecture](#architecture)
- [Technology stack](#technology-stack)
- [Route inventory](#route-inventory)
- [Supabase data model](#supabase-data-model)
- [Local development](#local-development)
- [Vercel deployment](#vercel-deployment)
- [Operations and security](#operations-and-security)

## Product overview

The workspace is organized into four navigation pillars:

| Pillar | Modules | Route pages in this repository |
| --- | --- | ---: |
| Overview | Dashboard, Analytics, Reports | 19 |
| Management | Users, Products & Inventory | 22 |
| Workspace | Calendar, Messages, Notifications | 30 |
| System | Security, Performance, Settings, Authentication | 22 |
| **Total** |  | **93** |

**Route count note:** this checkout contains 93 `app/**/page.js` files, including the root dashboard and the three authentication pages. The requested 94-route count does not match the current App Router file inventory. The list below includes every implemented static page route; this README does not invent an additional route.

## Architecture

### Application layers

- **App Router pages (`app/**/page.js`)** define static URLs and typically pass a route mode into a shared manager. Route-specific page files stay small; common layouts and interactions live in shared view components.
- **Shared modules** include `app/AnalyticsReportsManager.js`, `app/SecurityManager.js`, `app/PerformanceManager.js`, `app/messages/MessagesManager.js`, and `app/calendar/CalendarEventsPage.js`. Product and User modules use shared headers, KPI summaries, and tables under `app/components/Products/**` and `app/components/Users/**`.
- **Application shell** is composed in `app/layout.js` and `app/components/ClientLayoutWrapper.js`. The wrapper integrates the responsive sidebar, navbar, page content, and floating workspace customizer. Theme, language, and font state are provided through `app/contexts/**`.
- **Service layer (`services/**`)** contains Supabase reads and mutations, record mapping, KPI support, and latency measurements. Pages should use these services rather than embedding schema-specific query logic.
- **Supabase client (`lib/supabase.js`)** is initialized with the public project URL and anonymous key. It is safe for browser-side use when database access is protected with appropriate Row Level Security policies.
- **Design system** uses Tailwind CSS with semantic CSS-variable tokens such as `bg-background`, `bg-card`, `bg-muted`, `text-foreground`, `text-muted-foreground`, and `border-border`. Dark mode is class-based; compact sidebar, sidebar position, content width, and radius are persisted locally.

### Main data services

| Service | Responsibility |
| --- | --- |
| `services/dashboardService.js` | Dashboard summary values and recent activity records. |
| `services/userService.js` | User directory, profile mutations, activity, and soft deletion. |
| `services/productService.js` | Product and category reads, catalog CRUD, stock changes, and category operations. |
| `services/eventService.js` | Calendar event reads and CRUD; form date/time values are converted from IST wall time to UTC timestamps. |
| `services/notificationService.js` | Notifications and messages, read state, archive/star flags, optimistic refresh events, and delete suppression. It inspects available columns and stores supported state markers when optional columns are absent. |
| `services/securityService.js` | Audit, user access, permissions, and API key workflows. |
| `services/performanceService.js` | Exact row-count queries with measured round-trip durations using `performance.now()` where available. |
| `services/settingsService.js` | Admin profile selection and updates in `public.users`. |
| `services/reportService.js` | Live source records and report calculations for orders, products, users, and categories. |

## Technology stack

- **Next.js 14** — App Router, client-rendered interactive workspace pages, and production routing.
- **React 18** — component state, hooks, and shared module views.
- **Supabase JavaScript client v2** — Postgres data access and Realtime subscriptions where used.
- **Tailwind CSS 3** — responsive utility styling and semantic theme tokens.
- **Lucide React** — consistent monochrome interface icons.
- **Framer Motion** — interface motion where used.
- **ESLint / `eslint-config-next`** — code quality checks.
- **Vercel** — recommended hosting for the Next.js application.

The project uses npm scripts from `package.json`. Node.js 18.17 or newer is required by the Next.js 14 line; use a current Node.js LTS release for local development and deployment.

## Route inventory

All entries below correspond to static `page.js` routes in `app/`. Route groups are documentation/navigation groupings; they do not add URL prefixes.

### Overview — 19 routes

**Dashboard**

- `/`

**Analytics**

- `/analytics/realtime/health`
- `/analytics/realtime/sales`
- `/analytics/realtime/users`
- `/analytics/reports/monthly`
- `/analytics/reports/quarterly`
- `/analytics/reports/yearly`
- `/analytics/trends/products`
- `/analytics/trends/sales`
- `/analytics/trends/users`

**Reports**

- `/reports/export/csv`
- `/reports/export/excel`
- `/reports/export/pdf`
- `/reports/import/data`
- `/reports/import/history`
- `/reports/import/templates`
- `/reports/sales/daily`
- `/reports/sales/forecast`
- `/reports/sales/monthly`

### Management — 22 routes

**Users**

- `/users`
- `/users/active/online`
- `/users/active/recent`
- `/users/active/stats`
- `/users/add`
- `/users/add/bulk`
- `/users/add/invite`
- `/users/add/single`
- `/users/all`
- `/users/all/activity`
- `/users/all/list`
- `/users/all/permissions`

**Products & Inventory**

- `/products/add`
- `/products/all/bestsellers`
- `/products/all/catalog`
- `/products/all/performance`
- `/products/categories/add`
- `/products/categories/analytics`
- `/products/categories/manage`
- `/products/inventory/alerts`
- `/products/inventory/reports`
- `/products/inventory/stock`

### Workspace — 30 routes

**Calendar & Events**

- `/calendar`
- `/calendar/add`
- `/calendar/categories`
- `/calendar/events/create`
- `/calendar/events/team`
- `/calendar/events/upcoming`
- `/calendar/reminders/active`
- `/calendar/reminders/create`
- `/calendar/reminders/recurring`
- `/calendar/schedule/blocks`
- `/calendar/schedule/my`
- `/calendar/schedule/team`
- `/calendar/view`

**Messages**

- `/messages`
- `/messages/archived`
- `/messages/archived/conversations`
- `/messages/archived/date`
- `/messages/archived/tags`
- `/messages/compose`
- `/messages/create`
- `/messages/drafts`
- `/messages/inbox`
- `/messages/inbox/priority`
- `/messages/inbox/team`
- `/messages/inbox/unread`
- `/messages/sent`
- `/messages/sent/recent`
- `/messages/sent/scheduled`
- `/messages/sent/status`

**Notifications**

- `/notifications`

### System — 19 routes

**Security**

- `/security/api-keys/active`
- `/security/api-keys/generate`
- `/security/api-keys/usage`
- `/security/audit/security`
- `/security/audit/system`
- `/security/audit/users`
- `/security/permissions/access`
- `/security/permissions/roles`
- `/security/permissions/users`

**Performance**

- `/performance/feedback`
- `/performance/kras/my`
- `/performance/kras/reports`
- `/performance/kras/team`
- `/performance/meetings/actions`
- `/performance/meetings/my`
- `/performance/meetings/templates`
- `/performance/reviews`
- `/performance/skills`

**Settings**

- `/settings`

**Authentication**

- `/login`
- `/signup`
- `/forgot-password`

## Supabase data model

The application expects its core records in the Supabase `public` schema. The service layer maps the listed columns and some optional fields. **This table is an application-facing schema guide, not a migration file or a promise that every deployment has every optional column.** Check the project’s actual database and policies before enabling a feature. Several services inspect returned columns or use graceful fallbacks; others assume the core columns listed below.

| Table | Core/service-used fields | Used by |
| --- | --- | --- |
| `public.users` | `id`, `full_name`, `email`, `role`, `status`, `department`; optional `phone`, `bio`, `avatar_url`, `is_deleted`, `created_at`, `updated_at`, `last_login` | User directory, role/status controls, profile settings, analytics, security, activity. |
| `public.categories` | `id`, `name`; optional `description`, `slug`, `status`, `is_active`, `created_at`, `updated_at` | Product/category management, inventory, analytics. |
| `public.products` | `id`, `name`, `sku`, `description`, `category_id`, `price`, `stock_quantity`, `status`, `created_at`, `updated_at`; optional `min_stock_level`, `sold_count` | Catalog CRUD, stock management, inventory value, performance, reports. Joins `categories(id, name)`. |
| `public.orders` | `id`, `created_at`, `status`; calculations can use `total_amount` or `amount`, and may use `order_number`, `product_id`, `quantity`, `unit_price`, `customer_name`, `customer_email` | Dashboard, sales analytics, reports, and activity fallback calculations. Orders are treated as optional by some report views. |
| `public.events` | `id`, `title`, `description`, `start_date`, `end_date`, `event_type`, `is_recurring`, `recurrence_pattern`, `created_at`; optional `location` | Calendar month/agenda, event lists, reminders, analytics. Event timestamps are interpreted/displayed in IST in the UI. |
| `public.notifications` | Common fields include `id`, `user_id`, `title`, `message`, `type`, `is_read`, `action_url`, `created_at`, `read_at`; services can also use `subject`, `content`, `body`, `recipient_id`, `category`, `is_starred`, `is_archived` when present | Messages, notification center, navbar/sidebar unread counters, analytics, security alerts. The service dynamically checks available columns and supports category markers in message text. |
| `public.audit_logs` | Commonly used: `id`, `user_id`, `action`, `resource_type`, `severity`, `ip_address`, `details`, `created_at`; security check logging uses only columns discovered from a sample row when available | Security audit views, user activity, dashboard activity, system reports. |
| `public.api_keys` | `id`, `key_name`, `key_hash`, `prefix`, `scope`, `environment`, `created_by`, `is_revoked`; optional `last_used`, `created_at` | API key generation, listing, usage, and revocation. The plaintext key is returned once at creation; the stored key material is hashed. |
| `public.user_permissions` | `id`, `user_id`, `permission_name`, `resource_type`, `access_level`; optional `granted_at` | Permission grants and access-control views. Upsert currently expects a unique constraint on `(user_id, permission_name, resource_type)`. |

### Data access and policies

1. Create or connect the Supabase project and provide its Project URL and public anon key to the app.
2. Create the tables and constraints required by the modules you intend to use. In particular, the user-permissions upsert requires its documented conflict key.
3. Enable Row Level Security and add policies for the authenticated roles that need to read or mutate each table. Browser requests use the anon key; they do not bypass RLS.
4. Test reads and each requested mutation with the same role used by the deployed application. An empty UI can indicate an RLS policy or missing-table issue, not necessarily missing records.
5. Keep Supabase secrets and service-role keys out of `NEXT_PUBLIC_*` variables and out of browser code. This application should not receive a service-role key.

## Local development

### Requirements

- Node.js 18.17+ (a current LTS version is recommended)
- npm
- A Supabase project with the required `public` tables and suitable RLS policies

### Install and configure

```bash
git clone <repository-url>
cd nextjs-admin-panel
npm install
```

Create a `.env.local` file at the repository root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLIC_ANON_KEY
```

Use the project URL and anon/public key from **Supabase → Project Settings → API**. Do not put a service-role key in this file. `.env.local` should remain untracked.

Demo role switching is enabled automatically in local development. Production deployments keep it disabled unless `NEXT_PUBLIC_ENABLE_DEMO_MODE=true` is set. Only enable that flag on an isolated showcase deployment backed by a separate demo Supabase project; never enable demo role switching against customer workspaces.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The application warns if the Supabase variables are missing; database-backed features require valid configuration.

### Project commands

```bash
npm run dev     # Start the Next.js development server
npm run lint    # Run Next.js ESLint checks
npm run build   # Create a production build
npm run start   # Serve a completed production build
npm run test:e2e     # Run core Chromium end-to-end journeys
npm run test:e2e:ui  # Open the Playwright test runner UI
```

## Automated E2E Testing

The Playwright Chromium suite lives in `tests/e2e/saas-core-flows.spec.js`. Install the project dependencies and Chromium (`npx playwright install chromium`), then run `npm run test:e2e` or `npm run test:e2e:ui`. The suite covers five journeys: demo sign-in and role switching, User-to-Admin RBAC controls, Ctrl+K Spotlight search, the Orders ledger/Kanban stages and invoice preview, and sample-batch import validation. The development server starts automatically when needed and an existing server on `localhost:3000` is reused.

## Vercel deployment

1. Push the repository to a Git provider supported by Vercel.
2. In Vercel, select **Add New → Project**, import the repository, and keep the detected **Next.js** framework preset.
3. Configure the environment variables for the desired deployment environment:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Confirm the build command is `npm run build` and the install command is `npm install` (or use Vercel’s detected defaults). No custom output directory is required for a standard Next.js deployment.
5. Deploy a preview and verify that the shell, data reads, RLS-protected CRUD, calendar dates, and realtime unread counters work against the intended Supabase project.
6. Add the production domain to the Supabase Auth URL configuration and allowed redirect URLs if authentication redirects are used. Configure any required CORS or redirect settings for the deployment domain.
7. Promote the verified deployment to production. Configure the same public environment variables for Production and redeploy after changing them.

### Deployment checklist

- Supabase URL and anon key are set for Preview and Production.
- Database tables, required constraints, and RLS policies are present in the target project.
- No service-role key or other secret is exposed through a `NEXT_PUBLIC_*` variable.
- Preview routes and expected empty/error states have been checked before promotion.
- The production Supabase project allows the deployed domain where relevant.

## Operations and security

- The UI is responsive and monochrome by design; keep reusable components on semantic theme tokens instead of introducing route-specific color palettes.
- `npm run lint` is the lightweight source-quality check. `npm run build` validates the production compilation and is appropriate when the Next.js build directory is not in use by another process.
- Performance pages make count-only Supabase queries and report measured client round-trip duration. These timings include network and service latency and are not database-server execution time.
- Calendar input times are local IST values converted to UTC for storage; preserve that boundary when changing event forms or date filters.
- Message category/state tags and soft-delete suppression exist to accommodate notification schemas with different optional columns. Keep realtime/unread updates synchronized when changing notification mutations.
- API key creation shows a generated secret once and stores a hash. Do not log or persist the returned plaintext secret in application storage.

