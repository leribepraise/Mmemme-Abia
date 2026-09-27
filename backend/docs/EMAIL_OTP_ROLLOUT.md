# Email OTP rollout

Signup now requests a six-digit code, then verifies it while creating the account. Existing unverified users must request a code at `/verify-email` before logging in. Old verification links are retired. Existing verified users and Django admin session login are unchanged. Birth dates are checked in signup/onboarding/profile and the API; future or impossible dates are rejected, with no new minimum-age policy.

## Deploy on Railway

This is a coordinated backend, worker and frontend change. Commit and push these files before deploying. The migrations add an email-challenge table, an expiry field and an optional user on queued emails. They cancel queued legacy verification links, without deleting user accounts or booking data. They do not correct previously saved birth dates automatically.

1. Pause signup for the release window, or tell the team that signup may be briefly unavailable while versions change. The previous frontend cannot complete registration against the new API.
2. Stop the old worker for this short deployment window so it cannot send outdated verification links or process expired codes with the old implementation.
3. Deploy **Backend** from the new commit. Keep the pre-deploy command `python manage.py migrate --noinput --settings=config.settings.production`. Keep the normal web start command; migration must not replace it.
4. Deploy and start **worker** from the same commit with its existing `process_jobs` start command. It must share Backend's database, Redis and email configuration.
5. Deploy **frontend** from the same commit. No new environment variables are needed. The existing verified Resend sender and API key remain in use.
6. Check `/health/ready/`, then use an email inbox you control to sign up. Confirm no User record exists before the code is entered; after the correct code, confirm `email_verified` is true and login works. Try one incorrect code and a future birth date. Never share a real code or API key in logs/screenshots.
7. Test an existing unverified account: login should direct it to `/verify-email`; request a code there, verify, then log in again. Run `python manage.py operational_status --settings=config.settings.production` to confirm the worker and email queue are healthy.

Codes expire after 10 minutes. Resends wait 60 seconds; at most five codes can be requested per email per hour, with five wrong attempts per code. Resending replaces the old code. If email delivery is unavailable, signup remains blocked until delivery is restored; there is no verification bypass.

## Local setup

From `backend`, apply migrations using `venv\Scripts\python.exe manage.py migrate --settings=config.settings.development`. Run the Django server and the existing `process_jobs` worker, then start the frontend normally. With console email configured, the six-digit code appears in the worker terminal. Do not use console email in production.

## Validation

Run `python manage.py test tests --settings=config.settings.test` for SQLite checks and `python manage.py test tests --settings=config.settings.test_postgres` against an isolated PostgreSQL test database for row-lock/concurrency checks. GitHub's existing production-check workflow runs PostgreSQL tests. In `my-project`, run `npm test`, `npm run check:runtime` and `npm run build`.
