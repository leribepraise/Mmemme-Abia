# Accounts, onboarding and moderation

## Release steps

1. Deploy the updated backend and worker from the same commit.
2. Set `EVENT_COMMISSION_BPS=500` on **both** Railway services. This is 5% on ticket sales. Keep `PLATFORM_COMMISSION_BPS` at the agreed rate for other services.
3. Run the existing pre-deploy command: `python manage.py migrate --noinput --settings=config.settings.production`. This includes accounts migration 0005 and events migration 0005.
4. Deploy the updated frontend after the backend migrations succeed.
5. Confirm the worker is processing queued emails and the sending domain is verified. Test signup with a real inbox on staging, then check the approval notification and event visibility.

No existing sales are recalculated. Commission is recorded when a new payment is confirmed. Reconciliation retries preserve the original ledger entry. Refunds reverse the recorded commission.

## Account flow

- Signup sends a six-digit email code. A user record is created only after a valid code is supplied. Codes expire and cannot be reused.
- Regular users complete their profile and then reach the user dashboard. Completion is stored on the server. Future or invalid dates of birth remain rejected where the profile accepts a birth date.
- Organizers verify their email, provide business details, and accept the organizer terms. The application remains pending until staff approve it.
- Pending applications cannot be overwritten. Rejected applications and requests for more information can be corrected and resubmitted.
- Approved organizers can create draft events and submit them for review. Public listings exclude suspended events and events belonging to inactive or unverified organizers.
- Staff review decisions save the reviewer, time, feedback and audit history, and queue a notification for the owner.
- Account suspension blocks sign-in and invalidates existing access/refresh sessions. Reactivation requires a fresh sign-in. Staff cannot suspend themselves or other staff through the customer-management API.

## Staff access

Use `/admin/login` on the frontend. The Django administration remains available on the backend at `/admin/`.

An administrator must have a verified email, an active account and `is_staff=True`. Superusers already have all model permissions. For limited staff, assign the following permissions through Django groups:

| Work | Required Django permissions |
| --- | --- |
| View users | `accounts.view_user` |
| Suspend/reactivate customers | `accounts.view_user`, `accounts.change_user` |
| Review organizer applications | `accounts.view_organizerprofile`, `accounts.change_organizerprofile` |
| Suspend/reactivate organizer accounts | Organizer view permission plus `accounts.change_user` |
| Review events | `events.view_event`, `events.change_event` |
| Dashboard overview | View user, organizer profile and event permissions |
| Booking/payment metrics | `bookings.view_booking`, `payments.view_payment` |
| Recent audit activity | `common.view_auditlog` |

Staff cannot approve their own organizer application or event. Event approval requires a future event with an active ticket type and an active, verified organizer.

## Scope and policy notes

- The connected frontend admin areas are overview, users, organizers and events. Other admin modules are visibly unavailable instead of presenting sample data as real operations.
- Organizer verification currently uses supplied business details and an optional verification reference. Private identity-document uploads and automatic identity verification are not implemented.
- Social sign-in still requires provider setup; email/password and OTP flows are implemented.
- Review checkboxes guide the current event review; the saved decision, note and audit log are the authoritative record.
- The Figma screen says refunds are at the organizer's discretion. The displayed terms instead reflect the existing implemented policy: eligible event cancellations before the start receive a full refund. This release does not change refund eligibility.
- The terms show 5%. If the business later changes the ticket commission, update both the displayed terms and the environment setting together.

## Validation

Backend regression tests cover permissions, review transitions, self-review rejection, account suspension/session invalidation, first applications, onboarding, event visibility and booking restrictions. Commission tests cover 5% calculation, kobo rounding, reconciliation idempotency and the separate commission for other services.

Local browser checks use `tests/local_ui_server.py`, which creates a disposable database and does not contact the production database or payment provider. PostgreSQL concurrency tests must also pass in CI/staging; they are skipped by the local SQLite test settings.
