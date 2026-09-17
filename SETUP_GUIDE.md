# MMEMME ABIA: your environment and launch setup

Updated 16 September 2026.

## Project restored in your confirmed folder

The backend and connected frontend have been recovered into `C:\myprojects\Mmemme-Abia`. The existing `.env` was preserved. The local database was backed up and upgraded with the payout migrations. Replaced source files are backed up under `artifacts/recovery-20260916/before/`, with a recovery manifest alongside them. The changes are local and have not been committed or pushed.

Recovery sources found locally:

- Docker image `mmemme-backend:readiness` contains the backend source, migrations, tests and deployment documentation. Its 49 tests passed against the disposable PostgreSQL database again on 16 September.
- Local Git commit `01d86affbdf687a7ea27cb7ca0f37fee400077a9` contains the frontend integration under `backend/my-project/`, plus the deployment composition and CI files under `backend/`.
- The provider payout implementation was rebuilt after recovery, with bank verification, staff approval, completion waiting periods, transfer OTPs, duplicate protection, reconciliation and reversals.

The instructions below describe the current implementation. See `backend/docs/DEPLOYMENT.md` for the detailed release checks. The service is not yet deployed or cleared for live payments.

## Which environment files belong where?

| File | Purpose | What you supply |
| --- | --- | --- |
| `backend/.env` | Development on this PC | A development-only secret and, when testing payments, your Paystack test secret |
| `backend/.env.production` | Values injected into the API and worker by the supplied production Docker Compose setup | Production database, Redis, email, domain and payment credentials |
| `my-project/.env.local` | Optional frontend development settings | `VITE_API_BASE_URL=/api/v1`; no passwords or secret keys |
| `backend/.env.production.example` | Production template to copy or use as a checklist | Replace every placeholder before use |
| `.env.example` templates | Safe examples to commit with source | Placeholders only |

The application loads `backend/.env` for local development. The name `.env.production` does **not** make Django load that file automatically: Docker Compose injects it through `env_file`. On another hosting platform, enter its values in that platform's environment-variable/secret settings instead.

Use separate development, staging and live values. Both the API and background worker need the same settings for their environment.

## 1. Development on your PC

Keep your existing `backend/.env`; do not overwrite it with a template. After source recovery, these settings are enough to start locally:

```dotenv
DJANGO_SETTINGS_MODULE=config.settings.development
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
CORS_ALLOWED_ORIGINS=http://localhost:5173
PAYSTACK_SECRET_KEY=
PLATFORM_COMMISSION_BPS=0
```

`SECRET_KEY` must also be set to a random development-only value. Generate a new one locally with the backend Python environment:

```powershell
.\venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(64))"
```

Copy its output into your local file. Do not paste it into chat or source code.

Development uses SQLite and prints outgoing email in the worker terminal. PostgreSQL, Redis and SMTP become mandatory when production settings are selected. Add a Paystack `sk_test_...` secret when testing checkout; blank means payment processing is unavailable.

Local email previews show verification and password-reset URLs as plain text on their own lines. Copy the complete URL from the newest preview. If an older email shows `token=3D` or a URL split with `=` at line endings, restart the worker and request a fresh link from the website. The worker must be restarted after changes to email settings; unlike the development web server, it does not reload automatically.

After installing the backend requirements, run from `backend`:

```powershell
.\venv\Scripts\python.exe manage.py migrate --settings=config.settings.development
.\venv\Scripts\python.exe manage.py createsuperuser --settings=config.settings.development
.\venv\Scripts\python.exe manage.py runserver --settings=config.settings.development
```

In another terminal, also from `backend`:

```powershell
.\venv\Scripts\python.exe manage.py process_jobs --settings=config.settings.development
```

From `my-project`, run `npm ci --ignore-scripts`, then `npm run dev`. Use `http://localhost:5173` consistently. The restored frontend proxies API requests to the backend at port 8000.

## 2. Production values you need to obtain

| Variable | Where the value comes from / format |
| --- | --- |
| `DJANGO_SETTINGS_MODULE` | Exactly `config.settings.production` |
| `SECRET_KEY` | A newly generated random secret, at least 50 characters, unique to production |
| `ALLOWED_HOSTS` | Your real hostnames, comma separated, without `https://` or paths; no `*` |
| `FRONTEND_URL` | The full public HTTPS website address, such as `https://your-domain.example` |
| `CORS_ALLOWED_ORIGINS` | The same HTTPS origin; include another origin only if your reviewed deployment needs it |
| `DATABASE_URL` | PostgreSQL connection URL from your database service; never the disposable test database |
| `DB_SSLMODE` | `require` for a TLS-enabled database; see the private Docker exception below |
| `REDIS_URL` | Private Redis connection URL from your cache service |
| `EMAIL_HOST` | Your transactional email provider's SMTP hostname |
| `EMAIL_PORT` | `587` for the implemented STARTTLS configuration |
| `EMAIL_HOST_USER` | SMTP username supplied by the email provider |
| `EMAIL_HOST_PASSWORD` | SMTP password/API credential supplied by the email provider |
| `DEFAULT_FROM_EMAIL` | A sender address on your verified sending domain |
| `PAYSTACK_SECRET_KEY` | Your Paystack dashboard's test secret for staging; live secret only after launch checks |
| `PLATFORM_COMMISSION_BPS` | Your approved commission in basis points: `500` means 5%; current default `0` means no commission |
| `TRUST_PROXY_SSL_HEADER` | `True` only after a trusted HTTPS proxy is configured to overwrite the forwarded protocol header |
| `PAYOUT_HOLD_DAYS` | Proposed default `7`: wait this many days after service completion; confirm it in your provider terms |
| `PAYSTACK_TRANSFERS_ENABLED` | Keep `false` until finance permissions, bank reviews, transfer testing and merchant funds are ready; then explicitly enable |

Do not substitute arbitrary placeholder values just to make production checks pass. The account owner must supply actual service credentials.

For the supplied Docker Compose deployment, the database hostname is `db` and Redis is `redis`. Supply `POSTGRES_PASSWORD` to the Compose environment and use the same password in `DATABASE_URL`. URL-encode special characters in the URL's username/password. Changing the password variable after a database volume is initialized does not rotate that database's password.

The bundled PostgreSQL container does not configure TLS itself. Prefer a managed TLS-enabled database. `DB_SSLMODE=disable` is an explicit exception only for the private container network if your security policy permits it; never use that exception for a publicly exposed connection.

Keep frontend and backend on the same public HTTPS origin, with `/api/` forwarded to Django. The current cookie login flow is designed for that arrangement. Variables prefixed with `VITE_` are visible in the browser: never put a Paystack secret, database password, SMTP password or Django secret there.

## 3. Paystack setup

The selected business model is: **Mmemme Abia collects customer payments and pays providers later.** The payout workflow is implemented, but actual Paystack account setup and end-to-end transfer verification remain launch requirements. Transfer submission defaults to disabled.

You need to:

1. Complete your Paystack merchant account verification and confirm that provider transfers are available for your business.
2. Add the test secret to staging.
3. Set the webhook URL to `https://YOUR-HOST/api/v1/payments/webhook/paystack/`.
4. Use `https://YOUR-HOST/payment/return` as the checkout return page.
5. Confirm the commission, waiting period, provider bank-account review process, transfer fees, refund terms and who handles disputes.
6. Arrange sufficient Paystack balance for approved transfers and fees. Incoming customer payments and funds available for transfers must be reconciled operationally.
7. Complete test-mode checks, then have the merchant team authorize a controlled low-value live payment/refund/payout test.

Paystack explains its registered-business and balance requirements in [How transfers work](https://paystack.com/docs/transfers/how-transfers-work/). Do not disable transfer OTP protections merely to simplify setup.

## 4. Protect the environment file already in Git

The previous checkout tracked `backend/.env`, and it contains a non-placeholder `SECRET_KEY`. Its Paystack and SMTP password fields were blank during inspection. Secret values were not printed. The file, local SQLite database and generated Python caches are now removed from Git tracking, with all local copies retained. The index contains those removals for your next reviewed commit.

Already handled: safe ignore rules and removal of `backend/.env` from tracking. What remains:

1. Replace the committed Django secret before deployment. Rotate any other real credential that was ever committed or shared.
2. Commit the ignore/tracking changes with the reviewed source changes.

Ignoring a file does not remove it from older commits. Coordinate any history cleanup with collaborators; do not rewrite shared history casually.

## 5. Decisions and accounts that need your involvement

- **Hosting and domain:** choose the host, provide the domain, configure DNS and HTTPS, and ensure persistent storage.
- **Email:** create a transactional email account and verify the sending domain, including the provider's DNS records.
- **Payments:** complete merchant verification and supply credentials through local files or hosting secret settings.
- **Business policies:** approve commission, cancellation/refund rules, provider settlement timing, support contacts, terms and privacy notice.
- **Staff:** name the people allowed to verify providers, review bank details, release money and respond to incidents; arrange staff MFA.
- **Operations:** approve backup retention and recovery targets, an alert destination and an on-call owner.
- **Acceptance:** test customer and provider journeys on your own devices and approve a controlled launch.

The remaining engineering and operating work includes deployment configuration, staging payment/email/transfer tests, load/security checks, and a backup restore rehearsal. These are not all tasks you must implement personally; the credentials, ownership decisions and approvals are what require you.

Passing automated tests alone does not make the service ready to accept public payments. Keep the 30 September launch conditional on the documented release checks passing.
