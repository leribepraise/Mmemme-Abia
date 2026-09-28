# Live platform deployment

## Current release

- Paid memberships use Paystack in NGN. Bronze is free; the seeded Silver plan is NGN 2,000/month and Diamond is NGN 5,000/month. Renewals require a new checkout; automatic recurring billing is not implemented.
- Only server-verified payment results grant benefits. With a live secret key, booking and membership settlement require Paystack's `domain` to be `live`; test or missing modes go to review.
- Community posts and group creation are free and publish immediately. Staff can moderate content. Service reviews are a separate feature available to the customer after a completed booking.
- Direct chat supports messages, images, read status, typing status, archive and blocking. It uses polling. It does not provide WhatsApp's end-to-end encryption, calls or group messaging.
- Admin management pages use live data and staff model permissions. Financial history is read-only except for explicit supported reconciliation actions.
- Mobile customer navigation has Home, Explore, Bookings, Saved and Profile. The header retains access to other sections and organizer tools.
- Signup interests are selectable choices; onboarding does not ask for a photo or description.

## Publish this code

1. Review and commit the changes, including `my-project/public/optimized/`, `my-project/src/lib/imageAssets.json` and `optimize_frontend_images.py`. Do not commit `.env` files or `artifacts/` backups.
2. Push that commit to the connected Railway branch.
3. Deploy the backend from that commit. Keep the existing production variables, including the live Paystack key, database, Redis, email and storage configuration.
4. Keep the migration command in the backend's **Pre-deploy Command**, not its Start Command:

   ```sh
   python manage.py migrate --noinput --settings=config.settings.production
   ```

   Earlier platform features include migrations; no new migration is needed specifically for the image, skeleton, mobile navigation or live-payment mode changes.

5. Deploy the worker from the same commit, using the same live Paystack key as the backend. Retain its existing background-job start command.
6. Deploy the frontend from the same commit with its existing backend upstream configuration. Generated image copies are already included, so Railway does not need Pillow or an image-build step.
7. Check backend `/health/ready/`, then run `python manage.py operational_status --settings=config.settings.production` in the backend service. Investigate any nonzero operational alerts.
8. Check the site on a phone: bottom navigation, account skeleton, event images, organizer menu, community and admin pages using the appropriate accounts.
9. Make one intentional live Paystack purchase and verify the correct membership or booking, receipt notification and payment record. Refresh the return page to check that benefits are not granted twice. This real-money purchase has not been performed by the automated tests.

## Test-payment cleanup already applied

The explicitly authorized Railway production cleanup removed 9 provider-verified test transactions (4 booking payments and 5 plan payments), cancelled 4 associated test bookings and reset 2 paid memberships to Bronze. One live booking transaction was preserved. There were no unclassified transactions in that inspection.

A private serialized backup was saved under the ignored workspace `artifacts/` directory before deletion. Keep it out of Git. Do not rerun `prepare_live_launch --apply` as part of deployment: the cleanup is a one-off administrative operation, not a migration or startup task.

## Image delivery and loading

91 large bundled images have versioned WebP copies (about 33.3 MB of originals becomes 5.3 MB of delivery copies). Originals are retained. `SiteImage` selects the optimized copy where mapped; offscreen images load lazily and key hero images are prioritized. Existing remote uploads retain their original URLs and sizes.

Secondary pages and PDF download libraries load on demand. Skeletons cover initial startup, account checks, route loading and home event loading. The original page designs remain intact after loading.

The frontend Caddy configuration caches versioned assets for a year and unversioned images for a day; HTML and update files remain revalidatable. Local browser checks use Vite, so confirm these response headers after Railway deployment.

After changing bundled artwork, regenerate delivery copies from the repository root:

```powershell
backend/venv/Scripts/python.exe optimize_frontend_images.py
```

Commit both generated assets and the manifest together. The reported reduction applies to those bundled images, not total page-load time or user uploads.
