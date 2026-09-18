# Production deployment and release gates

Target: a production launch by **30 September 2026**. Implementing the code does not certify an operating deployment. Treat every unchecked launch gate below as required work before taking public payments.

For this project's Railway Hobby deployment, follow [RAILWAY_SETUP_GUIDE.md](../../RAILWAY_SETUP_GUIDE.md), which supplies the service paths, private-network setup, Resend HTTPS email and S3 bucket variables. The Docker Compose instructions below are an alternative hosting layout.

## Runtime layout

- Django/DRF API on PostgreSQL 17; SQLite is for local development only.
- Redis shared cache for throttling, health signals and application cache. Keep it private.
- A continuously supervised `python manage.py process_jobs` process. It handles durable webhook jobs, payment reconciliation, reservation expiry, refunds, notifications and reminders. API-only deployment is incomplete.
- Transactional email through Resend over HTTPS or SMTP on hosts that support it, with a verified sending domain and its authentication records configured by the domain owner.
- React build hosted on the **same HTTPS origin** as `/api/`, `/admin/` and health checks, behind a trusted reverse proxy. Refresh cookies require this arrangement; do not deploy the frontend and API on unrelated sites.
- Persistent uploads in S3 storage or a backed-up media volume, collected static assets served by WhiteNoise, encrypted database/media backups, central logs and an alert destination owned by the team.

The database is the durable job queue. Redis loss must not lose payments. Jobs can be retried after crashes; notification delivery is at-least-once, so an email can repeat after a crash between provider acceptance and recording delivery. Resend retries reuse a payload-specific idempotency key within its 24-hour deduplication window. Financial writes with uncertain responses are never blindly resubmitted.

## Local development (Windows)

From `backend`, create a virtual environment if needed, install `requirements-production.txt`, copy `.env.example` to `.env` if no local environment file exists, and set a random development secret. Existing local secrets must not be overwritten. Then:

```powershell
.\venv\Scripts\python.exe manage.py migrate --settings=config.settings.development
.\venv\Scripts\python.exe manage.py createsuperuser --settings=config.settings.development
.\venv\Scripts\python.exe manage.py runserver --settings=config.settings.development
# A separate terminal:
.\venv\Scripts\python.exe manage.py process_jobs --settings=config.settings.development
```

From `my-project`: `npm ci --ignore-scripts`, then `npm run dev`. Vite proxies `/api` to port 8000. Development email appears in the worker terminal. Use Paystack test keys for test checkout. Never expose Django's development server publicly.

## Configuration and first deployment

1. Create a deployment secret store or untracked `backend/.env.production`. Set `SECRET_KEY` to a unique random value of at least 50 characters, `ALLOWED_HOSTS`, PostgreSQL `DATABASE_URL`, `REDIS_URL`, email provider credentials, `DEFAULT_FROM_EMAIL`, HTTPS `FRONTEND_URL`, and `PAYSTACK_SECRET_KEY`. Choose `EMAIL_PROVIDER=resend` with `RESEND_API_KEY`, or `EMAIL_PROVIDER=smtp` with the SMTP variables in the example. Keep keys out of browser code, source control and logs. `PLATFORM_COMMISSION_BPS` is basis points (500 = 5%); default 0 is deliberate until business terms are approved.
2. Set `DJANGO_SETTINGS_MODULE=config.settings.production`. WSGI/ASGI default to production. Production refuses weak/missing settings and requires PostgreSQL/Redis and the selected email provider's credentials. Railway also requires S3 upload storage. Use a same-origin frontend API base `/api/v1`.
3. `compose.production.yaml` supplies API, worker, PostgreSQL and Redis. Set the compose environment's `POSTGRES_PASSWORD` and use that same password in `DATABASE_URL`. Database hostname is `db`, Redis is `redis`. Database TLS defaults to `require`; use managed TLS PostgreSQL for production. `DB_SSLMODE=disable` is only appropriate if the database is confined to a trusted private container network and your security policy permits it. No database/cache ports are published.
4. Build with `docker compose -f compose.production.yaml build`. Pin approved base-image digests in the release manifest after scanning images. Do not rely on floating tags for rollback.
5. Start dependencies, then run migrations as a one-off release job, not once per web process:

```sh
docker compose -f compose.production.yaml up -d db redis
docker compose -f compose.production.yaml run --rm api python manage.py migrate --noinput
docker compose -f compose.production.yaml run --rm api python manage.py collectstatic --noinput
docker compose -f compose.production.yaml run --rm api python manage.py check --deploy --fail-level WARNING
docker compose -f compose.production.yaml run --rm api python manage.py createsuperuser
docker compose -f compose.production.yaml up -d api worker
```

6. Build the frontend using `npm ci --ignore-scripts` and `npm run build`. Serve `my-project/dist` with a history fallback to `index.html`. Forward `/api/`, `/admin/`, `/static/` and `/health/` to loopback port 8000; WhiteNoise serves collected static assets. Serve uploads from configured S3 storage or a separate media origin without execution permissions, and set up durable storage/backup. Do not use Django's development file server in production.
7. Terminate HTTPS at the trusted proxy, redirect HTTP to HTTPS, overwrite the forwarded protocol/IP headers, restrict upstream access, and set `TRUST_PROXY_SSL_HEADER=True` ONLY after this is configured. Set Django's `NUM_PROXIES`/edge rate limits for the actual proxy chain. Enforce an upload/request limit at the proxy (for example 6 MB; images themselves max 5 MB). Rate-limit login, reset and administrative access at the edge; DRF throttles alone are not a distributed brute-force defense. Restrict `/admin/` to staff through an identity-aware proxy with MFA or add a tested application MFA integration before launch.
8. In the Paystack dashboard set webhook URL to `https://<host>/api/v1/payments/webhook/paystack/`. Callback is `https://<host>/payment/return`. Check successful, failed, abandoned and duplicate payments, refunds and delayed callbacks in test mode. Live activation requires the merchant account owner's credentials and consent.
9. Check `/health/live/` and `/health/ready/` over HTTPS. Ready checks PostgreSQL, Redis and a worker heartbeat (180 seconds). Monitor `python manage.py operational_status`; a nonzero exit requires investigation. Configure external alerts and on-call ownership before launch.

### Existing databases

The supplied local SQLite file was empty during implementation. A fresh database is supported by the migration chain. **Do not assume a different environment has no historical transactions.** Back up before upgrading, stop writers and inspect its migration state and data on a restored copy.

The former booking implementation mixed unpaid reservations into sales counts and lacked reliable settlement. Migration `bookings.0003` intentionally refuses a database containing legacy bookings. Such an environment needs an explicit, reviewed data migration: reconcile every charge/refund with the provider, map each booking to one supplier/listing, split ambiguous mixed-event orders with preserved references, rebuild reserved/sold counters, map ticket issuance sequences, and establish opening ledger balances. Never bypass this guard using `--fake`, delete transaction history, or infer paid status from the old booking status alone. Also resolve case-insensitive duplicate emails and invalid event dates/capacity before applying the new constraints.

## Payments, refunds and provider earnings

Paystack initialization uses one server-generated reference per booking. If a request times out, the worker reconciles that reference. If no reusable checkout URL was recorded, the customer can let the hold expire and make a new booking; a later successful payment to the old reference is refunded. Do not create another transaction for the same booking manually.

Refund states UNKNOWN, FAILED and REVIEW require an operator to compare the provider dashboard/API with the local record. `operational_status` reports them. Reconciliation re-reads known provider refunds. An UNKNOWN result with no matching provider record is **not** proof that it is safe to resend: get provider confirmation first, document the decision, then use a reviewed administrative recovery change. Do not edit financial database rows casually. Full refunds are implemented; partial refunds and chargeback/dispute workflows still need business policy and implementation if required by the launch terms.

Mmemme Abia collects payments and pays providers later. Provider bank registration, finance reviews, payout requests, OTP finalization, transfer reconciliation and reversal handling are implemented. See `API.md`. The provider dashboard separates eligible earnings, reserved payouts and paid amounts; the older sales analytics total remains explicitly before payouts. These are accounting balances, not a confirmation of sufficient funds in the merchant's Paystack balance.

### Enable provider payouts

1. Start with `PAYSTACK_TRANSFERS_ENABLED=false`. Confirm `PAYOUT_HOLD_DAYS` (proposed default 7 days after completion) and `PLATFORM_COMMISSION_BPS` in provider contracts. Transfer fees are borne by the platform in this implementation; provider earnings are the sale less commission, without another fee deduction.
2. Verify the merchant business with Paystack and confirm transfer capability and funding arrangements. Keep sufficient transfer balance, including fees. Customer collections may settle separately; operational reconciliation is mandatory. Use individual transfers with OTP enabled, not bulk transfers requiring OTP removal.
3. Assign staff `payments.review_payoutaccount` and/or `payments.release_payout` using a superuser-controlled Django group. The finance section appears in the provider dashboard for authorized staff. Protect both the staff UI and `/api/v1/payouts/` and `/api/v1/payout-accounts/` finance actions with the staff MFA/access controls appropriate to your hosting setup. Restrict access by identity, not by hiding buttons.
4. Providers submit Nigerian bank details. Paystack resolves the account name; staff must verify the name and bank ownership against the provider's business records before approving it. Full account numbers are not stored. A changed account needs fresh approval. A suspension prevents new submissions but cannot recall a transfer already sent.
5. Staff review delivered services, refunds/disputes and available merchant funds for each requested payout, write a review note and approve it. The worker rechecks eligibility and sends it only when the transfer setting is enabled. Staff enter any required transfer OTP in the finance screen; do not put OTPs or full account numbers into review notes.
6. Test the entire flow with test credentials: rejected/unverified bank, duplicate request, insufficient balance, OTP expiry, success, reversal, timeout and webhook replay. Confirm Paystack dashboard records match local references and amounts. Only then enable live transfers as a controlled merchant-owned launch step.

UNKNOWN payouts are never automatically resent or cancelled. A timeout or 'not found' is not proof that no transfer occurred. Use Check with Paystack and the merchant dashboard; escalate to Paystack if needed. FAILED/REVERSED payouts may be retried or cancelled only after a fresh provider check. REVIEW requires investigation and a reviewed recovery change; do not alter rows ad hoc to bypass it. `operational_status` reports uncertain, failed, reversed, OTP and review cases, and stale approved/processing payouts. Monitor it frequently enough to respond within Paystack's OTP window.

The allocation uniqueness constraint prevents paying the same sale twice. Cancelled requests preserve their allocations as inactive history. Successful transfers are rechecked daily for missed reversals, in addition to webhook processing. Completed historical bookings with no `completed_at` remain ineligible; do not invent completion dates. Dispute/chargeback automation, partial refunds, tax reporting and automated KYC are still outside the implemented flow: define and staff the manual dispute/KYC process, suspend affected payout accounts while investigating, and verify that the release terms permit these workflows before launch.

Paystack references: [bank account verification](https://paystack.com/docs/api/verification/), [transfer API](https://paystack.com/docs/api/transfer/), [transfer states and retry rules](https://paystack.com/docs/transfers/how-transfers-work/).

## Backups, recovery and rollback

- Use encrypted, access-controlled off-host PostgreSQL backups with point-in-time recovery; back up media separately. Set retention and recovery targets with the owner. A reasonable launch test target is recovery within one hour and no more than 15 minutes of lost writes; confirm that the hosting plan actually supports it.
- Create PostgreSQL custom-format backups using `pg_dump --format=custom --file=<backup-path>` with connection credentials injected through a secret store. Avoid shell redirection for binary dumps on Windows. Never store backup files in this repository.
- Restore a backup into a NEW isolated database using `pg_restore --no-owner --dbname=<isolated-database> <backup-path>`. Restore media, disable all outbound payment/email jobs, verify record counts, constraints, ticket ownership and ledger totals, then run controlled smoke checks. Record restore duration and results. Do not test restores against the live database.
- For a release, snapshot database/media and retain the previous application image and frontend build. Migrations that change transaction semantics should not be reversed casually. Prefer roll-forward fixes; if restoring, stop traffic and workers, reconcile all provider activity after the backup timestamp, restore into a separate database, and cut over only after checks. Restoring a database does not undo Paystack charges/refunds.
- Schedule `python manage.py flushexpiredtokens` daily to remove expired JWT bookkeeping. Configure proxy logs to omit query strings on account verification/recovery pages, and never log authorization headers, passwords or raw Paystack payloads.

## Release gates and remaining work

- [ ] Production hosting, DNS, TLS, durable files, transactional email and merchant credentials configured.
- [ ] Real Paystack test-mode end-to-end checkout, webhook replay, late payment and refund completion verified; authorized low-value live smoke test performed by the merchant team.
- [ ] Provider contracts, identity verification, commission, cancellation/refund policy, settlement/payout process, tax treatment and dispute ownership approved. The implemented cancellation policy is full refund before service start, food before acceptance, hotels before the check-in date.
- [ ] Privacy notice, customer/provider terms, retention/deletion/export workflows and support escalation approved and implemented where needed. No fabricated legal text is supplied.
- [ ] Staff MFA/access proxy, abuse reporting/moderation escalation, dependency/image security scan, penetration testing and sensitive-data log review completed.
- [ ] Sustained load test with realistic events, hotel date ranges, payment callbacks and worker backlog; record capacity, latency and recovery thresholds. PostgreSQL race tests are necessary but do not substitute for load testing.
- [ ] Restore rehearsal completed and alerts proven with worker/email-provider/database outages.
- [ ] Customer/provider acceptance testing on desktop/mobile, accessibility review and required non-booking content pages completed. Legacy prototype components remain in source as references but are not active booking routes. Native mobile app, advanced recommendations and premium subscriptions are not implemented by these fixes.
- [ ] Production migration rehearsal on a restored copy and release rollback plan signed off.

Suggested remaining window: finish credentials/policies and settlement decisions by 20 September; staging integration/load/security/restore checks by 25 September; fixes and acceptance testing by 28 September; controlled release only after all gates pass by 30 September. This is a target, not a guarantee.

## Verification commands

```sh
python manage.py test tests --settings=config.settings.test --noinput
# Real PostgreSQL, disposable database with permission to create its test database:
python manage.py test tests --settings=config.settings.test_postgres --noinput
python manage.py makemigrations --check --dry-run --settings=config.settings.test
python manage.py check --deploy --fail-level WARNING --settings=config.settings.production
```

PostgreSQL test configuration reads POSTGRES_HOST/PORT/DB/USER/PASSWORD and never uses the production DATABASE_URL. CI runs PostgreSQL tests and a frontend build. The current source-of-truth repository is the root `C:\myprojects\Mmemme-Abia`; it has no nested backend Git repository after the user's folder changes. On 16 September the backend was recovered from the previously tested Docker image and the connected frontend from a local Git commit. Recovery backups and a manifest are under ignored `artifacts/recovery-20260916/`. Review and commit the restored source, migrations, frontend and CI together. Local `.env`, SQLite and Python caches have been removed from Git tracking while retained on disk. Rotate the formerly committed Django secret before deployment; removal from tracking does not erase old commits.
