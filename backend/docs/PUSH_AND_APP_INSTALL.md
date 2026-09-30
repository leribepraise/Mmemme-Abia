# Notifications, app installation and Railway deployment

## What changed

- A single inbox is available at `/notifications` and Profile → Notifications. Read state is stored on the backend, including “Mark all as read”. New notices show a small in-site card by default while the site is open; the badge checks for changes every 10 seconds.
- Booking, refund, organizer review, event review and payout notifications open their relevant pages. Private OTP and password-reset emails never appear in the inbox or push messages.
- Browser push is opt-in per device. The existing worker delivers queued pushes, retries temporary failures and disables expired subscriptions. Signing out disables that browser subscription. Nothing is sent to newly subscribed devices from the old notification history.
- Newly approved events create an in-app announcement for active, email-verified users and a browser push for each device that enabled push. New-event email is on by default and follows the user's Email updates preference. The worker fans out announcements and sends email in batches; drafts, rejected events and repeated approvals do not broadcast.
- Open pages refresh their data automatically about every 30 seconds while visible, and after successful changes, refocus, or a network reconnect. This updates content without reloading the whole page.
- `/install` provides the supported browser installation flow and Apple Home Screen instructions. The footer and home app banner open it. This is an installable web app, not an App Store or Play Store package.
- The service worker caches only the public offline screen and app icons. Bookings, payments and account pages need a connection; personal API responses are never cached by it.
- Home ticket links use actual event IDs and preserve the destination through login. Search, category, hotel/food/tourism, profile settings, ticket, support, map and sharing links were connected to existing pages/actions.
- Unsupported transport services explain their availability. The contact form opens an email draft rather than claiming an unsent message was delivered; the support mailbox must be operational.

## 1. Install the backend dependency locally

From PowerShell in `C:\myprojects\Mmemme-Abia\backend`:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements-production.txt
.\venv\Scripts\python.exe manage.py migrate --settings=config.settings.development
```

Push subscriptions use `notifications.0003_pushsubscription_pushdelivery`; event announcements also require `events.0008_eventannouncement`. Railway needs both migrations. Existing notifications are retained.

## 2. Generate the push keys once

Run locally, in the same backend folder:

```powershell
.\venv\Scripts\python.exe manage.py generate_push_keys --settings=config.settings.development
```

This creates `backend/.push-keys.env`, which Git ignores. Open it locally to copy the two values. The command refuses to overwrite an existing file. Keep the pair in your password manager; don't send the private key in chat or commit it. Use the same pair across backend and worker, and keep it between deployments. Rotating it requires browsers to enable push again.

## 3. Add these variables to BOTH Railway backend and worker

| Variable | Value |
| --- | --- |
| `WEB_PUSH_ENABLED` | `true` |
| `VAPID_PUBLIC_KEY` | The complete public value from `.push-keys.env` |
| `VAPID_PRIVATE_KEY` | The complete private value from `.push-keys.env` |
| `VAPID_SUBJECT` | `mailto:` followed by a working team contact email |

Enter each value without surrounding quotation marks. The private key belongs only in backend/worker variables. The frontend obtains the public key through its authenticated API; it needs no push secrets or new Vite variable. This feature does not use your Resend key.

## 4. Redeploy in order

1. Commit and push the changes, including the new migration, service worker, manifest and PNG icons. Do not include `.push-keys.env` or `desktop.ini`.
2. Redeploy **backend** from the latest commit. Keep the existing migration pre-deploy command (`python manage.py migrate --noinput --settings=config.settings.production`). Do not replace the web server start command with it.
3. Once the backend migration succeeds, redeploy **worker** from the same commit. Its start command stays `python manage.py process_jobs --settings=config.settings.production`.
4. Redeploy **frontend** from the same commit. Keep its existing `/my-project` root and `BACKEND_UPSTREAM` configuration.
5. Open your normal HTTPS domain and refresh once. Use the same domain for installation and push: subscriptions are tied to the browser origin. Moving between `www`, the apex domain and a Railway preview address creates separate subscriptions.

Push delivery requires the keys above and the user's browser permission on each device. In-app notices and new-event emails are active by default. To pause push delivery, set `WEB_PUSH_ENABLED=false` on both backend and worker and redeploy.

## 5. Verify on a real device

1. Sign in to a test account on the deployed frontend. Open **Notifications** using the bell.
2. Click **Enable push notifications** and allow the browser prompt. There is no automatic permission request on page load.
3. On Android or desktop, use **Install Mmemme Abia** in the footer. If the install button isn't offered, use the browser's install menu. On iPhone/iPad, use Safari → Share → Add to Home Screen, then open the installed app and enable notifications there.
4. Trigger a new notification using a test account, such as an organizer review or a genuinely free test event booking. Avoid a real paid booking for this check.
5. With the worker running, check that the device receives an alert. Tap it: the app should mark it read and open the correct page. Repeat with the app closed.
   For a new-event check, approve a real future event after enabling push on a test user account. Its alert should show the event title and open the event page. Creating a draft alone must not send an alert.
6. Confirm “Mark all as read” stays applied after refresh and the bell badge changes. Sign out and confirm the device no longer receives new pushes for that account.

Apple web push requires a supported Home Screen web app (iOS/iPadOS 16.4 or later). Actual delivery also depends on permission, browser support, connectivity and device notification settings. See [Apple's web push guidance](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers) and [browser installation guidance](https://web.dev/learn/pwa/installation).

## Troubleshooting

- “Push notifications are not available yet”: check all four backend/worker variables and redeploy both.
- Permission denied: allow notifications in the browser/site or device settings, then enable again.
- No alert: confirm a NEW non-private notification was created after subscribing and the worker is running. Read notifications, revoked accounts and notifications older than one day aren't delivered.
- Worker log `Push delivery failed`: HTTP 404/410 deactivates the expired subscription; re-enable on the device. HTTP 401/403 usually needs checking the VAPID key pair/contact. HTTP 429 or a network/server failure retries with backoff, up to five attempts. Logs deliberately omit endpoints, keys and message bodies.
- No install button: use the browser menu or the instructions at `/install`. Installation support differs between browsers; the button cannot be forced by the website.
- Switching accounts on a shared browser requires enabling push for the new account. Subscription ownership is never silently transferred.

## Verification scope

Automated checks cover ownership, persistent read state, private/expired notification exclusion, push endpoint validation, subscription ownership, delivery retries, revoked subscriptions, real payload encryption/VAPID signing with transport mocked, safe push links and public-only offline caching. Browser checks use a disposable local database. Real device push and installation must also be checked on the HTTPS deployment with its own keys.

For the event-announcement change, the focused backend notification suite and frontend tests pass, and the frontend production build succeeds. Final push delivery still needs a real-device check on the deployed HTTPS domain with the worker and VAPID keys enabled.
