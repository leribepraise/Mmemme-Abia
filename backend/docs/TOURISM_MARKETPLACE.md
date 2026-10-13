# Tourism operator dashboards

## What is implemented

Verified users apply at `/tourism/operator`. Admins use `/admin/tourism` to review
operator identities, explicitly agree the commission (500 basis points = 5%),
approve/reject/suspend operators, review destinations and oversee support/payouts.
Tourism commission does not silently inherit the event commission.

Owners manage their profile/logo, staff, experiences, gallery uploads, packages,
scheduled tours, participants, check-in, support, earnings and payouts. Managers
manage operations and earnings; guides only get manifests and check-in. Staff must
already have active, email-verified accounts. Disable a membership to revoke access.

Create an experience, upload its photos, define packages and schedule departures.
Each package has an itinerary, meeting point, inclusions and exclusions. Departure
prices are authoritative for booking; the package price is a reference. Tours can
be free or paid in naira through the existing Paystack checkout.

New experiences and changes to their text/gallery require admin review. Operator
legal identity changes reopen approval. Unapproved/suspended operators and
unapproved destinations cannot accept bookings. Existing bookings are preserved.
Legacy experiences/packages/departures remain compatible; they are not reassigned
to a new operator automatically. Admins can move a legacy destination belonging
to the same owner into the operator dashboard once ongoing bookings are resolved.
It then requires listing review. Legacy listings remain accessible through
`/admin/tourism/records`; operator listings use the new dashboard.

Visitors choose a departure, supply names for each participant, reserve places,
pay if needed and receive a signed QR pass at `/tourism/bookings`. The reservation
system prevents overselling. Photos come from the experience gallery. Staff read
the QR using a scanner and paste its token into the participant screen. Check-in
opens two hours before start and closes at tour end. It checks in the whole party
once; there is no built-in camera scanner or offline check-in mode.

Passenger cancellation cutoffs and commission are captured at reservation time.
Operator cancellation before start queues full refunds for captured payments.
Refund delivery depends on the existing worker/Paystack reconciliation, not an
instant transfer. Started/completed tours require support review. Booked package
terms and departure fares/times cannot change; add a replacement package/departure
or cancel/refund. Participant manifests can be downloaded as JSON.

Mark a tour completed only after its end and actual delivery. Payouts reuse the
existing Paystack-verified bank account, settlement hold and independent finance
approval. Provider balances include the owner's other services. The Finance tab
shows those allocations before approval. Reminder emails/push are queued once
within 24 hours before start using the user's existing notification preferences.

## Railway deployment

1. Commit and push the changes to the connected branch.
2. Deploy backend with the existing pre-deploy command:

   `python manage.py migrate --noinput --settings=config.settings.production`

   This applies tourism migration 0003. Keep the backend's normal web start command.
3. Redeploy worker and frontend from the same commit. The worker keeps:

   `python manage.py process_jobs --settings=config.settings.production`

4. Check backend readiness, then submit a real operator application.
5. Approve the operator with its agreed commission; create a destination, upload
   photos, add a package and departure, and approve the destination.
6. Perform a controlled free/paid booking and verify the confirmation, pass,
   manifest, cancellation/refund and settlement workflow. Do not use existing
   passenger bookings as test fixtures. Live Paystack checks remain necessary.

No new secrets are required. Existing production media storage and notification
credentials must work. Operators must reserve their advertised allocation for
MMEMME ABIA; this does not synchronize with an external tourism booking system.

## Staff permissions

Tourism admins need `tourism.view_tourismoperator` and
`tourism.change_tourismoperator`. Destination review requires
`tourism.change_tourismexperience`. Support admins additionally need
`tourism.view_tourismrequest` and `tourism.change_tourismrequest`. Preserve existing
payment finance permissions for reviewing/releasing payouts. Superusers already
have these permissions; operator memberships do not grant Django staff status.

## Local validation

`tests.test_tourism_marketplace` covers approval, tenant boundaries, staff roles,
review/public visibility, inventory protection, guide overlap, commissions,
refunds, signed check-in/replay, completion, reminders and support access.
Browser fixtures in `tests/local_ui_server.py` use a disposable SQLite database.
No live charges, refunds or transfers are made by these checks.
