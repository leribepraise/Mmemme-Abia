# Frontend and backend connection

The current React design now uses the Django API for the flows listed below. Existing layouts and styling remain in place. Listing content comes from the database, so empty lists mean there are no eligible published records; sample listings are not created in your development database.

## Run locally

Keep three terminals open. Use `localhost` consistently in your browser.

**Terminal 1 — backend**

```powershell
cd C:\myprojects\Mmemme-Abia\backend
.\venv\Scripts\python.exe manage.py migrate --settings=config.settings.development
.\venv\Scripts\python.exe manage.py runserver --settings=config.settings.development
```

**Terminal 2 — background jobs**

```powershell
cd C:\myprojects\Mmemme-Abia\backend
.\venv\Scripts\python.exe manage.py process_jobs --settings=config.settings.development
```

**Terminal 3 — frontend**

```powershell
cd C:\myprojects\Mmemme-Abia\my-project
npm run dev
```

Open `http://localhost:5173`. The frontend forwards `/api`, `/admin`, `/media`, and `/static` to the backend on port 8000. If port 5173 is occupied, stop the old frontend process or add the actual frontend origin to the backend's allowed origins before using a different port.

The existing local SQLite database was checked for pending migrations; none remained at the time of verification. Other checkouts and Railway must still run migrations.

## Environment files

- Keep secrets only in the existing `backend/.env` locally, and in Railway service variables when deployed. Do not replace an existing environment file with the example.
- For local use, `FRONTEND_URL=http://localhost:5173` and `CORS_ALLOWED_ORIGINS=http://localhost:5173` must match the browser address. The payment callback is `http://localhost:5173/payment/return` for local testing.
- The frontend defaults to `VITE_API_BASE_URL=/api/v1`. No frontend environment file is needed for the normal local setup. An example is provided in `my-project/.env.example`.
- Never put Paystack secret keys, Resend keys, database passwords, or Django's secret key in a `VITE_` variable; those values are public in the browser bundle.
- Development email is printed by the worker. Use the newest verification link it produces. Real email delivery requires the production email configuration.
- Use Paystack test credentials for checkout testing. The browser redirects to Paystack; the server verifies payment before confirming bookings.

## Connected flows

| Existing frontend area | Backend connection |
| --- | --- |
| Accounts | Registration, email/password login, refresh-cookie sessions, logout, email verification/resend, password reset/change |
| Profile | Contact details, date of birth, bio, avatar, interests and email preference |
| Events | Published listings, detail pages, ticket availability, saved events, checkout, issued QR tickets and downloads |
| Hotels | Active listings, available starting price, room types, consecutive room-night reservations and confirmed-stay receipt |
| Food | Active restaurants, menus, one-item pickup ordering, food search and checkout |
| Transport | Published routes and departures, route/date search, seat availability and reservations |
| Tourism | Main listing/detail pages and scheduled tour departures |
| Payments/history | Paystack initialization and callback verification, actual booking totals, payment history and notifications |
| Organizer | Owned events, draft creation/editing, submission for staff approval, ticket types, attendees, sales reports, payout balances/requests and basic settings |
| Messaging | Booking-scoped customer/provider conversations, messages and read status; refreshed periodically while the tab is visible |

Frontend records use server IDs. Previous browser-only accounts and bookings are not real backend records and are cleared from the legacy authentication/booking storage. Sign in with the account's email on the website; Django admin uses its configured username field.

## Data needed for testing

Use Django admin to create or review real development listings:

1. Approve the provider account (`is_verified`), and verify the customer's email.
2. Events need a future date, ticket types and staff approval before appearing publicly. Creating an event from the organizer form submits it for review; it does not approve itself.
3. Hotels need active room types and room-night stock for **every night** in the selected stay.
4. Restaurants need active menu items with stock and must be accepting orders.
5. Transport routes need active future departures with seats. Tours need active packages and future departures.

Current event creation has a date-only control, so new events are saved as all-day events in Nigeria time. Existing precise times are preserved when the date is unchanged. Set precise start/end times in admin until time controls are added to the design. New hotel reservations currently use one room and one guest because the current form has no room-count/guest-count controls.

## Remaining work before a public launch

This integration is not a production-launch sign-off.

- **Hosting:** Railway deployment and same-origin API routing for `mmemme.com.ng` are still required. The last confirmed hosting status was that the backend had not yet been deployed. Follow `RAILWAY_SETUP_GUIDE.md`; do not point a deployed frontend at localhost. A Vercel SPA fallback returning HTML for `/api/v1/` is not a working API connection.
- **Real services:** Verify Resend delivery, Paystack test checkout/webhook/reconciliation, refunds and payout settlement in staging. No real charges, transfers or outgoing emails were made during integration tests.
- **Production database:** Run the PostgreSQL concurrency tests; SQLite skips those checks. Configure and verify backups, uploads, monitoring and supervised background jobs as described in `backend/docs/DEPLOYMENT.md`.
- **Additional UI features:** Community/blog content, some tourism category/editorial screens, paid membership plans, promotions/discounts, social sign-in, two-factor setup, wallet passes, message attachments/support/archive, granular marketing preferences, translations and saved payment methods still require their own implementations. Connected controls do not fabricate success for unsupported operations.
- **Broader booking interfaces:** Multi-item food carts/delivery choices, hotel guest/room counts, immediate rides, rentals, courier services and full provider fulfilment/finance administration are not supplied by the current connected customer screens. The existing backend supports additional operations documented in `backend/docs/API.md`; staff can manage supported records through admin until the corresponding UI is implemented.
- **Performance:** The frontend builds successfully but still has a large main bundle. Route-level code splitting remains a release optimization.
- **Code quality:** The targeted lint audit found no undefined variables, invalid hook ordering or parser errors. The full repository lint check still reports other findings (including unused imports and component-refresh/style rules); it is not a clean lint pass.

## Checks

Latest results: production frontend build passed; 11 frontend tests passed; backend suite ran 96 tests with 86 passing and 10 PostgreSQL-only tests skipped. Django system checks and migration-drift checks passed. Browser checks covered login/session reload, free event booking and QR display, hotel reservations and receipt download, pickup food and shuttle/tour checkout, booking conversation creation, and organizer draft submission for review.

```powershell
cd C:\myprojects\Mmemme-Abia\backend
.\venv\Scripts\python.exe manage.py test --settings=config.settings.test --noinput
.\venv\Scripts\python.exe manage.py makemigrations --check --dry-run --settings=config.settings.test
cd ..\my-project
npm test
npm run build
```

The backend suite includes account privilege protection, booking idempotency, inventory pricing, private attendee access and conversation isolation. Frontend tests cover authentication retries, CSRF, rejection of HTML API responses and financial-report calculations using booking snapshots.

Browser checks use `backend/tests/local_ui_server.py`, a separate disposable database on port 58000 with outbound payment credentials disabled. It must never be used as the real application server.
