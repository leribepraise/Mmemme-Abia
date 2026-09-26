# Backend API contract

Base path: `/api/v1/`. JSON request/response bodies; lists return `{count,next,previous,results}`. Use `page` and `page_size` (maximum 100). UUIDs identify bookable inventory. Tourism experiences and packages retain their existing numeric IDs.

Errors: `{error: <field errors or detail>, request_id: <identifier>}`. HTTP 400 means invalid input, 401 missing/expired login, 403 insufficient permission, 404 absent/inaccessible resource, 409 lifecycle or stock conflict, 429 rate limit, 503 unavailable dependency. Keep `X-Request-ID` when reporting failures. Do not retry financial writes with fresh identifiers.

## Authentication

1. `GET /auth/csrf/` returns `csrf_token` and sets its cookie.
2. `POST /auth/register/` with email, password, first_name, last_name, phone. Account starts unverified.
3. `POST /auth/login/` with email/password and `X-CSRFToken`. Returns access token and user; refresh token stays in an HttpOnly cookie.
4. Send `Authorization: Bearer <access>` for protected APIs. Keep access tokens in memory.
5. `POST /auth/refresh/` rotates the refresh cookie. Send cookies and CSRF token. `POST /auth/logout/` blacklists it. Register, login, refresh and logout enforce CSRF.

Use `GET/PATCH /auth/me/` for names, phone, interests and email reminder preference. Users cannot assign roles, staff access, provider approval or email verification. `/auth/verify-email/`, `/auth/resend-verification/`, `/auth/password-reset/`, `/auth/password-reset/confirm/`, `/auth/password-change/` handle signed verification and one-use password recovery. `/auth/organizer-application/` accepts business details; staff approve the application in Django admin.

## Catalog and approval

| Public listing | Bookable inventory | Relationship filter |
| --- | --- | --- |
| `/events/` | nested `ticket_types` | event detail |
| `/hotels/` | `/room-types/`, `/room-nights/` | `hotel`, `room_type`, `date_from`, `date_to` (exclusive) |
| `/restaurants/` | `/menu-items/` | `restaurant` |
| `/transport-routes/` | `/departures/` | `route` |
| `/tourism/` | `/tour-packages/`, `/tour-departures/` | `experience`, `package` |

Public reads show approved, active providers/listings. `GET <collection>/mine/` lists owned inventory; authorized staff can review all listings there. Providers create with POST and edit with PATCH. Parent ownership cannot be reassigned. Stock/price/date changes cannot invalidate reservations. Transactions are not deleted. Root listings require staff `POST <collection>/<id>/approve/`.

Events: create draft → add `/events/<id>/ticket-types/` → `/submit/` → staff `/approve/` or `/reject/`. Published events are immutable. `/cancel/` cancels the event and queues refunds. Tickets may be free. Unpublished events are private.

Hotel availability: `POST /room-nights/availability/` with `room_type,date_from,date_to,price,quantity` creates up to 366 nights, excluding date_to, preserving existing dates. Edit an existing night's quantity via PATCH; existing sales/holds are the lower bound.

## Reserve, pay, fulfill

`POST /bookings/`, header `Idempotency-Key: <unique stable request key, 8–100 characters>`:

```json
{
  "kind": "HOTEL",
  "items": [{"id": "room-night-uuid", "quantity": 1}],
  "customer_name": "Customer name",
  "customer_phone": "+2348000000000",
  "details": {"guests": 2}
}
```

Kinds: EVENT, HOTEL, FOOD, TRANSPORT, TOURISM. Hotels require one item for EVERY consecutive night (maximum 30), same room type and room count. Transport/tourism allow one departure per booking. Food details: `delivery_method` PICKUP or DELIVERY, plus `delivery_city` and `delivery_address` for delivery. Quantities 1–20. Orders must belong to one listing. Email verification is required. The server prices all items and delivery; customer-supplied totals/statuses are ignored. Reuse the same key for retries with identical payloads; changes require a new key.

Inventory is held for 15 minutes. `POST /payments/initialize/` with `{booking: <booking UUID>}` returns a Paystack authorization URL. Redirect the user there. The return page calls `/payments/verify-reference/` with `{reference: <reference>}`. It does not trust URL success flags. Signed Paystack webhooks at `/payments/webhook/paystack/` are stored durably; the worker independently verifies reference, amount in kobo, currency, customer and booking metadata before fulfillment.

Booking states: PENDING → CONFIRMED, EXPIRED or CANCELLED; paid cancellations go through REFUND_PENDING → REFUNDED. Late successful payments trigger refunds without issuing tickets. `POST /bookings/<id>/cancel/` applies cancellation cutoffs. Providers use `/decline/` to cancel undelivered services and queue refunds. Food customer cancellations close after acceptance; other services close when they start, hotels at the start of the check-in date. These implemented policies must match the approved customer/provider terms before launch.

Providers read `/bookings/received/` and call `/bookings/<id>/fulfill/` with `status`. Food: NEW → ACCEPTED → READY → IN_PROGRESS → COMPLETED. Other services: NEW → IN_PROGRESS → COMPLETED, starting no earlier than the service date/time. `/bookings/analytics/` reports sales/refunds/earnings BEFORE payouts. It does not transfer money.

## Provider bank accounts and payouts

All routes below use JWT authentication. Staff privileges alone do not authorize finance operations: assign `payments.review_payoutaccount` for bank reviews and `payments.release_payout` for payout approval/reconciliation. Staff cannot review their own bank account or release their own payout.

- `GET /payout-accounts/banks/`: supported Nigerian banks from Paystack (cached for one hour).
- `POST /payout-accounts/`: `{bank_code, account_number}`; a verified provider submits a 10-digit Nigerian account. Paystack resolves the name and creates a recipient. Only the name, bank, last four digits and recipient identifiers are persisted. The new account is PENDING. Existing account versions remain in history. Changes are blocked while payouts are outstanding.
- `GET /payout-accounts/`: the provider's current masked account. Staff review list: `/payout-accounts/queue/`.
- `POST /payout-accounts/<id>/review/`: `{decision: APPROVED|REJECTED|SUSPENDED, note}`. Require a meaningful note; it is visible to the provider. Verify account ownership against the approved provider's records before approval. Name resolution alone does not prove ownership.
- `GET /payouts/summary/`: eligible earnings, amounts reserved for requested/unresolved payouts, amounts paid, configured waiting period and finance capabilities.
- `POST /payouts/`, with a stable `Idempotency-Key`: request eligible earnings. No client total or destination is accepted. At most 1,000 eligible sale entries are included in a request. Eligibility requires a confirmed, completed booking, a recorded completion date older than `PAYOUT_HOLD_DAYS`, a successful NGN payment and no refund. Existing completed records without a completion timestamp remain ineligible pending reviewed migration.
- `GET /payouts/`, `/payouts/<id>/` and `/payouts/<id>/items/`: private history and paginated included bookings. Authorized finance staff use `/payouts/queue/` and may inspect included bookings.
- Staff `POST /payouts/<id>/approve/`, `/retry/`, `/cancel/`: `{note}`. Approval queues a transfer; retry requires a fresh verified conclusive failure. Cancellation releases allocations only for unsent or conclusively failed transfers. It retains the audit and financial records.
- Staff `POST /payouts/<id>/finalize/`: `{otp}` for a Paystack transfer awaiting OTP. The code is not stored. `/reconcile/` independently verifies the existing transfer.

Each sale has at most one active payout allocation. The worker sends only APPROVED payouts when `PAYSTACK_TRANSFERS_ENABLED=true`. An attempt/reference is saved before sending. Timeouts/crashes leave UNKNOWN, which is reconciled without another transfer. A new attempt is allowed only after staff requests a retry and Paystack confirms a conclusive failure. Signed `transfer.success`, `transfer.failed` and `transfer.reversed` events are queued and independently verified; amount, currency, reference and recipient must match. Mismatches enter REVIEW and require investigation. A bank reversal restores the provider liability while keeping earnings allocated for controlled retry.

Schedule-based services cannot be completed before their end time (hotels: checkout date). Completion starts the payout waiting period. Food completion is recorded through the fulfillment workflow; staff must check delivery/disputes before approving payment.

## Tickets, messages, saved events and reviews

`/tickets/` is owner-only. `/tickets/<id>/qr/` returns a private PNG. Providers send `{token: <QR value>}` to `/tickets/check-in/`; admission is one-use, event/provider scoped and limited to the event window (up to four hours before start).

`POST /conversations/` with `{booking: <id>}` creates/returns a booking-scoped customer/provider thread. `/conversations/<id>/messages/` supports paginated GET and POST `{body: <text>}`. `/read/` marks incoming messages read. `/notifications/` and notification `/read/` are private; password/verification messages are excluded.

`/saved-events/` supports GET, POST/DELETE `{event: <id>}`. `/reviews/` reads moderated event reviews; creation requires a used ticket after the event ends. Reviews require staff approval. Tourism's historical review model is not exposed as a public write API.
