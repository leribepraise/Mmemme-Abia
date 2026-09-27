# Move the existing frontend to Railway

Updated 26 September 2026. This guide uses the existing Railway backend, worker,
Postgres, Redis and uploads bucket. It does not require another database or a
change to your pgAdmin connection. The frontend design is retained.

## 1. Push the deployment fixes

Review the local changes, commit them and push to `main` in
`leribepraise/Mmemme-Abia`. Suggested commit title:

```text
fix: prepare frontend for Railway and resolve page errors
```

Confirm GitHub shows the new commit and that its checks pass. The changes include
the resolutions to the frontend merge conflicts that were already being edited.
Keep `.env` files and secrets out of Git. Nothing has been committed, pushed or
deployed automatically by this review.

Deploy the same new commit to the existing backend and worker, since it also
restores production HTTPS enforcement. Keep the backend's existing start command
and migration pre-deploy command. If automatic deployments are unavailable, use
Railway's command palette (Ctrl+K), choose **Deploy Latest Commit**, and select
the service. Redeploying an older deployment can rebuild its older commit.

## 2. Create the frontend service

1. Open the existing MMEMME ABIA project on Railway and select `production`.
2. Click **Create / New**, choose **GitHub Repo**, and select
   `leribepraise/Mmemme-Abia`.
3. Rename this new service **frontend**. Leave the existing backend service in place.
4. Open **frontend → Settings** and enter:

| Setting | Exact value |
| --- | --- |
| Branch | `main` |
| Root Directory | `/my-project` |
| Railway Config File | `/my-project/railway.json` |
| Builder | Dockerfile (provided by the config file) |
| Custom Build Command | Empty |
| Custom Start Command | Empty |
| Pre-deploy Command | Empty |
| Healthcheck Path | `/health/frontend/` (provided by the config file) |

The Dockerfile builds the React website and starts Caddy to serve it. Do not put
`npm run dev`, `npm run preview`, `npm start`, or a Django command in this service's
start command. Choose the same region as the backend and keep one replica with
sleep/serverless disabled. A first automatic build may fail until the following
variables are entered; apply the completed configuration before retrying.

The config-file path is relative to the repository root.
[Railway monorepo documentation](https://docs.railway.com/deployments/monorepo).

## 3. Enter the frontend variables

Open **frontend → Variables → New Variable**. Add these two entries separately:

| Variable name | Variable value |
| --- | --- |
| `PORT` | `8080` |
| `BACKEND_UPSTREAM` | `${{backend.RAILWAY_PRIVATE_DOMAIN}}:8000` |

Copy the second value exactly, including `${{`, `}}` and `:8000`. It references
the service named `backend` in the same environment. If yours has another name,
select that service's `RAILWAY_PRIVATE_DOMAIN` using Railway's reference picker,
then append `:8000`.

The backend must still use `PORT=8000`. Do not add `https://` to this private
upstream value. The frontend Dockerfile already builds with
`VITE_API_BASE_URL=/api/v1`; no frontend API key or database credentials are needed.
Resend, Paystack, database, Redis and storage secrets stay in backend/worker.

## 4. Deploy and generate the temporary frontend address

1. Apply the changes and deploy **frontend** from the latest commit.
2. In **frontend → Settings → Networking → Public Networking**, click
   **Generate Domain**.
3. Set its target port to **8080**.
4. Copy the generated hostname, for example `frontend-production-xxxx.up.railway.app`.
   That example is a placeholder; use the actual name Railway gives you.
5. Open `https://YOUR-FRONTEND-HOSTNAME/health/frontend/`. It must show `ok`.

This checks the website server only. Configure Django below before testing API calls.

## 5. Allow the new hostname in Django

In **backend → Variables**, edit the following values. Replace
`YOUR-FRONTEND-HOSTNAME` with the generated hostname from step 4. Preserve any
other legitimate domains already in these lists.

| Variable | Value |
| --- | --- |
| `ALLOWED_HOSTS` | `backend-production-5722.up.railway.app,mmemme.com.ng,YOUR-FRONTEND-HOSTNAME` |
| `CORS_ALLOWED_ORIGINS` | `https://mmemme.com.ng,https://YOUR-FRONTEND-HOSTNAME,https://backend-production-5722.up.railway.app` |
| `FRONTEND_URL` | `https://mmemme.com.ng` |
| `TRUST_PROXY_SSL_HEADER` | `true` |

Repeat these values in **worker → Variables**. Apply changes and wait for both
services to run. Hostnames have no `https://` in `ALLOWED_HOSTS`; origins include
`https://` and have no trailing slash. This project's CSRF trusted origins use
`CORS_ALLOWED_ORIGINS` too.

Keep `FRONTEND_URL` on the existing live domain during testing so customer email
links and Paystack return links still point to the public website. Before the
domain switch, those links will continue to open the Vercel frontend. Account
sessions are separate between the temporary Railway hostname and the live domain.

Keep the existing backend public domain: Django admin uses it, and existing
integrations may still reference it. The frontend API calls use Railway's private
network behind the website's own `/api/v1` URL.

## 6. Test the temporary Railway website

Open the actual generated frontend domain and check:

| URL/action | Expected result |
| --- | --- |
| `/` | Current homepage design appears |
| `/events` then refresh | Events page when signed in; the existing sign-in redirect for guests. No server 404 |
| `/api/v1/events/` | JSON data, possibly an empty results list; not website HTML |
| `/health/ready/` | `{"status":"ready"}` |
| Sign in, open profile, refresh, sign out | Account session and profile work |
| Open an event and restaurant with real data | Detail pages and prices load |
| Save an event while signed in | It appears under profile → Saved Items |
| `/admin/login` | The current React staff login page |

Django admin remains at:
<https://backend-production-5722.up.railway.app/admin/>.
The React staff dashboard owns `/admin` on the frontend; these are separate pages.

Do not switch the domain until the temporary site and API checks pass.

## 7. Point mmemme.com.ng to the new service

1. In **frontend → Settings → Networking**, choose **Custom Domain**.
2. Enter `mmemme.com.ng` and select target port **8080**.
3. Copy the DNS record name/type/target and any verification TXT record Railway
   displays. Use the exact target from Railway, not the backend hostname.
4. In the Vercel team dashboard, open **Domains → mmemme.com.ng → DNS Records**.
5. Save a copy of the current website DNS records for rollback.
6. Replace/override the root website record with Railway's target. The root name
   is usually `@` (or blank as indicated by the DNS form). If Vercel does not allow
   a CNAME at the root, use its supported **ALIAS** record pointing to the same
   Railway target. Add any verification TXT record exactly as Railway supplies it.
7. Preserve all Resend/DKIM/SPF/MX records and other unrelated records, especially
   those under `notifications.mmemme.com.ng`. Keep the domain's nameservers in place.
8. Wait until Railway shows the custom domain and HTTPS certificate as active.
9. Open <https://mmemme.com.ng> and repeat the checks in step 6.

If you also use `www.mmemme.com.ng`, add it to the frontend service, add Railway's
DNS record for `www`, and add that hostname/origin to backend and worker
`ALLOWED_HOSTS`/`CORS_ALLOWED_ORIGINS`. Keep the main `FRONTEND_URL` as
`https://mmemme.com.ng`.

Vercel can continue managing DNS while Railway hosts the website. Keep the old
Vercel deployment available until the Railway site is confirmed working. To roll
back during the switch, restore the saved website DNS records. Do not delete the
DNS zone or remove the email records.

References: [Railway domains](https://docs.railway.com/networking/domains/working-with-domains),
[Vercel DNS records](https://vercel.com/docs/domains/managing-dns-records).

## 8. Confirm the complete customer flow

- Register with an email address you control; confirm delivery and click the
  verification link. Resend's sending domain must be verified. The worker must run.
- Check password reset, login, profile and uploaded images.
- Make a Paystack **test-mode** booking and confirm the return page and ticket.
  Keep existing working webhook settings; if the webhook uses the public website,
  its path remains `/api/v1/payments/webhook/paystack/` and is proxied to Django.
- From the backend Railway SSH shell run:

  ```sh
  python manage.py operational_status --settings=config.settings.production
  ```

- Confirm there are no worker/backlog errors and review Railway service logs.

## Review results and limits

- Live backend liveness and readiness returned HTTP 200 (`ok` and `ready`).
- The current public website and its events API returned HTTP 200.
- Fixed unfinished merge resolutions, missing page imports/functions, event saving
  inconsistencies, missing banner fallback, invisible API toast notifications,
  production HTTPS enforcement and the frontend/Django admin route collision.
- Production frontend build and runtime checks passed; 11 frontend tests passed.
- Browser smoke check: homepage, login refresh and React admin login rendered
  without console errors in the local production preview. Signed-in customer
  transactions still need the hosted acceptance checks above.
- Backend suite: 86 passed, 10 PostgreSQL-only tests skipped locally; no pending
  model migrations. The GitHub workflow runs the PostgreSQL suite.
- Existing general lint findings and a large JavaScript bundle remain follow-up
  work. The new runtime deployment gate checks undefined references, syntax,
  duplicate keys/arguments, unreachable code and hook ordering.
- The Docker engine was unavailable locally, so the final Linux container/private
  Railway proxy still needs the deployment checks above. This review is not a
  completed production acceptance test. No Railway settings or DNS were changed.
