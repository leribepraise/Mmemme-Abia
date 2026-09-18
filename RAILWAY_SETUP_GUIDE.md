# MMEMME ABIA: Railway Hobby setup with Resend

Prepared 17 September 2026 for `mmemme.com.ng`. The project, PostgreSQL and Redis have already been created. This guide continues from there. Deployment files are prepared locally; Railway needs the commit containing them on GitHub before it can use them.

## What runs on Railway

| Name | Purpose | Public access |
| --- | --- | --- |
| `frontend` | React website, served by Caddy; forwards API/admin requests to Django | One HTTPS domain |
| `backend` | Django API and admin | Private network |
| `worker` | Email, payment reconciliation, booking expiry, refunds and payouts | Private; no HTTP server |
| `Postgres` | Persistent application database | Private |
| `Redis` | Cache and worker health signal | Private |
| `uploads` | Private S3 bucket for listing images | Time-limited signed image links |

Start with one replica per application service and keep sleeping/serverless disabled. The worker must run continuously. Use the same Railway region for the application services and databases where available. Review usage alerts: Hobby includes a usage allowance, and the whole deployment can cost more than the subscription minimum. [Railway plans](https://docs.railway.com/pricing/plans).

## 1. Verify Resend email sending

Railway Hobby requires email over HTTPS because outbound SMTP is blocked. The application now supports Resend's HTTPS API. [Railway email requirements](https://docs.railway.com/networking/outbound-networking).

1. Create/sign into your [Resend account](https://resend.com/).
2. Open **Domains**, add **`notifications.mmemme.com.ng`**, and enable sending. Use this subdomain for transactional emails.
3. Open the DNS manager that controls `mmemme.com.ng`. Add the exact records Resend shows, including their type, name, value and any priority. Some DNS panels append the domain automatically; avoid entering it twice. Preserve the root domain's existing website and mailbox records.
4. Return to Resend and verify the records. Continue when the sending domain shows **Verified**. Keep click/open tracking disabled for verification and password-reset emails.
5. Open **API Keys**, create a key named `Mmemme Abia Railway`, choose sending access and restrict it to this domain. Save its value privately; Resend does not display it again.

The planned sender is **`Mmemme Abia <noreply@notifications.mmemme.com.ng>`**. This is an outgoing identity; setting it up does not create a mailbox for receiving customer replies. Arrange a monitored support address separately.

References: [Resend domains](https://resend.com/docs/dashboard/domains/introduction), [API key management](https://resend.com/docs/dashboard/api-keys/introduction).

## 2. Add persistent image storage

In the Railway project, choose **Create → Bucket**, name it **`uploads`**, and choose its region. Open **Credentials**. The application reads its S3 credentials through variable references; keep these out of frontend variables.

Use `S3_ADDRESSING_STYLE=virtual` unless the bucket's Credentials tab explicitly specifies path style. Use the supplied base endpoint and `BUCKET` value, not the display name. The application produces signed image links valid for one hour. [Railway bucket setup and credentials](https://docs.railway.com/storage-buckets).

## 3. Put the deployment files on GitHub

Review and commit the current changes with your team, then push to the branch Railway will deploy. A suitable commit title is:

```text
feat(deploy): add Railway services, Resend email and S3 uploads
```

The configured repository is `leribepraise/Mmemme-Abia`, branch `main`. Confirm that GitHub contains this guide and the three Railway JSON files before connecting the services. Keep actual `.env` files, credentials, local SQLite data and `artifacts/` out of the commit.

## 4. Create the three application services

Create three empty services and name them exactly **`frontend`**, **`backend`** and **`worker`**. Configure each service's Settings before its first successful deployment, then connect the same GitHub repository and branch to all three. If source connection starts a build immediately, finish the variables/settings below and redeploy.

| Service | Root Directory | Railway Config File |
| --- | --- | --- |
| `frontend` | `/my-project` | `/my-project/railway.json` |
| `backend` | `/backend` | `/backend/railway.api.json` |
| `worker` | `/backend` | `/backend/railway.worker.json` |

The config-file path is relative to the repository root even when Root Directory is set. The JSON files supply Docker build, start, restart and health settings. Leave dashboard build/start overrides empty unless diagnosing a specific issue. [Railway monorepo configuration](https://docs.railway.com/deployments/monorepo).

Only **frontend** needs a public domain. In its **Settings → Networking**, generate a Railway domain with target port **8080**. Leave backend and worker without public domains. PostgreSQL and Redis use their private connection URLs.

## 5. Enter the variables

Railway injects values through each service's **Variables** tab. Keep your PC's `backend/.env` for local development; you do not upload it to Railway.

Use [backend/.env.railway.example](backend/.env.railway.example) as the reference template. Add its uncommented variables to **both backend and worker**, with identical values. You can use shared variables attached to both services, or copy them carefully. Variable references are case-sensitive: adjust `Postgres`/`Redis` if your database service names differ. Railway resolves `${{service.VARIABLE}}`; local dotenv files cannot.

### Values you must supply privately

- **SECRET_KEY:** generate a fresh random value, at least 50 characters, and use the same value for backend and worker. Do not reuse the old development key. To generate it locally:

  ```powershell
  C:\myprojects\Mmemme-Abia\backend\venv\Scripts\python.exe -c "import secrets; print(secrets.token_urlsafe(64))"
  ```

- **RESEND_API_KEY:** the private sending key from step 1.
- **DEFAULT_FROM_EMAIL:** `Mmemme Abia <noreply@notifications.mmemme.com.ng>`. Enter it without surrounding quotes in Railway's individual value field.
- **PAYSTACK_SECRET_KEY:** your `sk_test_...` key for the deployment checks. Leave transfers disabled. Keep the agreed commission/hold settings; the example starts at 0% and 7 days.

### Connection and storage values

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` |
| `DB_SSLMODE` | `require` |
| `REDIS_URL` | `${{Redis.REDIS_URL}}` |
| `EMAIL_PROVIDER` | `resend` |
| `MEDIA_STORAGE` | `s3` |
| `S3_BUCKET_NAME` | `${{uploads.BUCKET}}` |
| `S3_ACCESS_KEY_ID` | `${{uploads.ACCESS_KEY_ID}}` |
| `S3_SECRET_ACCESS_KEY` | `${{uploads.SECRET_ACCESS_KEY}}` |
| `S3_ENDPOINT_URL` | `${{uploads.ENDPOINT}}` |
| `S3_REGION` | `${{uploads.REGION}}` |
| `S3_ADDRESSING_STYLE` | `virtual` |

### Website address: start with the generated Railway domain

| Variable on backend and worker | Value |
| --- | --- |
| `ALLOWED_HOSTS` | `${{frontend.RAILWAY_PUBLIC_DOMAIN}}` |
| `FRONTEND_URL` | `https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}` |
| `CORS_ALLOWED_ORIGINS` | `https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}` |
| `TRUST_PROXY_SSL_HEADER` | `true` |

`ALLOWED_HOSTS` has no `https://` and no trailing slash. The other two values are HTTPS origins. The callback URL is automatically derived from `FRONTEND_URL`; do not copy the localhost callback into production variables.

Add these **only to backend**:

```dotenv
PORT=8000
WEB_CONCURRENCY=2
```

Add these **only to frontend**:

```dotenv
PORT=8080
BACKEND_UPSTREAM=${{backend.RAILWAY_PRIVATE_DOMAIN}}:8000
```

Frontend calls `/api/v1` on its own domain. Caddy forwards those calls privately to backend, preserving the public hostname and setting the HTTPS forwarding header. This supports secure login cookies. The backend's private port must stay 8000 unless you change `BACKEND_UPSTREAM` to match. Do not add secret keys or database credentials to frontend or any `VITE_` variable.

## 6. Deploy and check startup

1. Ensure PostgreSQL, Redis and uploads are available.
2. Deploy **backend**. Its pre-deploy command runs migrations once per deployment. Its start script collects static files inside the running container and then starts Gunicorn.
3. Deploy **worker** after backend's migrations finish. Its start command runs `process_jobs` continuously. It has no HTTP health-check path.
4. Deploy **frontend** and open its generated HTTPS domain.

The config files use `/health/live/` for backend and `/health/frontend/` for frontend. These startup checks deliberately do not wait for the other application services. Railway's health-check hostname is automatically allowed; its HTTP liveness request is exempt from HTTPS redirection. The rest of the backend still requires HTTPS through the proxy.

Now visit these paths on the **frontend's HTTPS domain**:

- `/` — website loads.
- `/admin/` — styled Django admin login loads.
- `/health/live/` — Django responds successfully.
- `/health/ready/` — PostgreSQL, Redis and the worker are ready. Allow the worker its first cycle; a persistent 503 needs investigation.
- `/login` — refreshing a frontend route loads the application.

Deploy health checks do not provide ongoing monitoring. Add an external monitor for `/health/ready/` with a team-owned alert destination. [Railway health checks](https://docs.railway.com/deployments/healthchecks).

### Create the Railway administrator

This PostgreSQL database is separate from your PC's SQLite database. Your local administrator and bookings do not automatically exist on Railway.

Open a shell **inside the deployed backend service** using Railway's service SSH option/CLI. Run:

```sh
python manage.py createsuperuser --settings=config.settings.production
python manage.py check --deploy --fail-level WARNING --settings=config.settings.production
python manage.py operational_status --settings=config.settings.production
```

Use a new strong password and log in at `/admin/` with that username. Running `createsuperuser` in an ordinary local terminal would create the user in your local database instead. Do not bulk-copy local payment test records into production.

## 7. Verify email and persistent uploads

1. Register a test customer with an inbox you control on the deployed site.
2. Check Resend's email activity and worker logs, open the newest verification link, then test a password reset.
3. Make sure links open the deployed site and login remains valid after refreshing.
4. Create/approve a test provider and upload a listing image. Confirm the image loads through a signed storage URL. Redeploy backend and verify the image remains available.

The worker marks email as sent when Resend accepts it. This does not prove inbox delivery; review bounces/suppressions and Resend delivery status. Retries reuse an idempotency key within Resend's 24-hour deduplication window. Permanent failures after eight attempts require operator investigation. This implementation sends text/HTML messages; ticket QR downloads remain in the authenticated site.

## 8. Connect mmemme.com.ng after the generated domain works

In **frontend → Settings → Networking**, add `mmemme.com.ng` as a custom domain, target port 8080. Add the exact DNS records Railway gives you at your DNS provider, and wait for domain verification and HTTPS certificate issuance. Use your provider's supported apex-domain configuration rather than inventing a CNAME target. Add `www.mmemme.com.ng` only if you intend to support it and configure it in Railway/DNS too. [Railway custom domains](https://docs.railway.com/networking/domains/working-with-domains).

Then update **both backend and worker** and redeploy them:

```dotenv
ALLOWED_HOSTS=mmemme.com.ng,${{frontend.RAILWAY_PUBLIC_DOMAIN}}
FRONTEND_URL=https://mmemme.com.ng
CORS_ALLOWED_ORIGINS=https://mmemme.com.ng,https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
```

Add `www.mmemme.com.ng` and its HTTPS origin to the appropriate lists only if configured. New email and payment callback links will use `https://mmemme.com.ng`. Sign in again on the custom domain; cookies from the temporary domain do not transfer.

## 9. Finish payment and launch checks

In Paystack test settings, set the webhook to:

```text
https://mmemme.com.ng/api/v1/payments/webhook/paystack/
```

The payment callback is `https://mmemme.com.ng/payment/return`. Before domain cutover, use the generated frontend domain for both instead. Complete hosted checkout, webhook reconciliation and the still-outstanding full refund test. Keep `PAYSTACK_TRANSFERS_ENABLED=false` until the finance/payout tests are complete.

Complete the existing [production launch gates](backend/docs/DEPLOYMENT.md#release-gates-and-remaining-work): database backups and a restore rehearsal, separate upload backups, alerts, staff MFA/access controls, abuse/rate limits, load/security checks and customer/provider acceptance. The Caddy upload limit is 6 MB per request; the application's image limit remains 5 MB. Bucket durability is not an independent backup. Live payment activation remains a merchant-owned release step after these checks.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Django says a setting is missing | Backend AND worker variables, exact names, secret placeholders replaced; apply changes/redeploy |
| Frontend shows 502 for API | Backend deployment/logs, `BACKEND_UPSTREAM`, private DNS, port 8000, services in same environment |
| API returns 400 / DisallowedHost | Public frontend hostname in `ALLOWED_HOSTS`, without scheme |
| Login CSRF error or redirect loop | Exact HTTPS origin, Caddy forwarding, `TRUST_PROXY_SSL_HEADER=true`, no stale localhost variables |
| `/health/ready/` returns 503 | PostgreSQL/Redis connectivity and worker's logs/heartbeat |
| Resend rejects delivery | Worker logs show safe HTTP status; check key, sending-domain verification, sender match, account quota and Resend activity |
| No email activity in Resend | Worker running; failed/queued notifications; correct environment/key |
| Image upload fails | Bucket credential references, actual `BUCKET` name, endpoint, region and URL style |
| Admin works locally but rejects credentials on Railway | Create a superuser inside Railway's backend database |
| `ModuleNotFoundError: config.setting` | Correct spelling is `config.settings.production` |

Share error text and service names when asking for help. Keep API keys, database URLs, passwords and email verification/reset links private.
