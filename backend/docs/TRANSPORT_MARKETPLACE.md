# Transport company marketplace deployment

## What is included

- Company applications, logo uploads, admin approval/suspension and explicit commission agreements.
- Owner, manager and boarding staff access; staff must already have email-verified user accounts.
- Company terminals, vehicles, routes, scheduled buses and event-linked shuttles.
- Exclusive seat allocations with reservation locks, vehicle capacity checks and overlapping-journey protection.
- Company and fare comparison, passenger names, Paystack checkout, signed QR boarding passes and passenger manifests.
- Operator departure cancellation queues full refunds through the existing worker. Refunds are not instant; the existing Paystack reconciliation and finance review apply.
- Passenger cancellation cutoffs, journey completion, company earnings and existing provider bank verification/payout workflows.
- Passenger support requests, company/admin replies, booking confirmation and departure reminder emails/push through the existing notification worker.
- Finance staff can review earnings allocations and approve/reconcile provider payouts in the admin Transport panel's Finance tab.

No additional payment or email credentials are required. Existing legacy routes and bookings remain intact. The upgrade does not connect to a company's separate ticketing software or sell car rentals, courier deliveries or on-demand rides.

## Railway deployment

1. Commit and push the changes to the branch connected to Railway.
2. Deploy the backend with its existing production settings. Keep the pre-deploy command:

   python manage.py migrate --noinput --settings=config.settings.production

   This applies transport migrations 0002 and 0003. Do not replace the backend start command with this migration command.
3. After backend migrations succeed, redeploy the worker and frontend from the same commit. Keep the worker command:

   python manage.py process_jobs --settings=config.settings.production

4. Confirm the backend readiness URL is healthy. Open the Transport page and confirm the company application and boarding-pass links work.
5. Use `/transport/company` while logged in to submit a real transport company application.
6. In the website admin dashboard, open Transport (`/admin/transport`). Review the company identity and contact details, agree the commission and explicitly enter it in basis points (500 = 5%, 700 = 7%, 0 = no commission). Approve the company. Transport does not automatically inherit the event commission.
7. The company owner then adds terminals, vehicles, routes and departures in that order. The quantity on each departure is the seat allocation reserved exclusively for MMEMME ABIA, not necessarily the total vehicle capacity. Publish both the route and its departure using their Accept bookings controls.
8. The company owner adds a Nigerian payout account in Payouts. Paystack verifies it. Provider payouts require completed journeys, the configured settlement hold and finance authorization, just like other provider payouts.
9. Add existing email-verified staff by email. Managers handle schedules, bookings and support. Boarding staff have manifest/check-in access, not financial or staff-management access. Disable a membership to revoke access.
10. Perform a controlled booking, verify the Paystack callback, boarding pass, manifest and confirmation email. At boarding, use a QR scanner to read the pass and submit its token in the manifest screen. Boarding opens four hours before departure; each booking checks in its entire passenger party once.
11. Test an operator cancellation with a controlled refundable payment and verify that the worker processes the refund. Never use real passenger bookings as test fixtures.

## Important operating rules

- Do not sell the same allocated seats at a terminal or on another platform. External ticketing synchronization requires a separate integration agreed with the company.
- A fare or schedule with held/sold seats cannot be changed. Cancel and refund if the journey cannot operate. Add a new departure for replacement travel.
- A vehicle cannot be assigned to overlapping journeys. Allocations cannot exceed its capacity.
- A terminal's identity cannot change once routes use it. Add a new terminal for a different location. Vehicle identity changes are blocked where bookings exist.
- Legal company identity changes reopen approval. Company suspension stops new sales; it does not silently cancel passengers' existing journeys.
- Passenger cancellation terms and commission are captured when the booking is created, so later policy changes do not rewrite existing contracts.
- Mark a journey completed only after scheduled arrival and actual completion. Finance must investigate disputed or undelivered journeys rather than marking them completed for settlement.
- Preserve the existing finance permissions for staff who review/release payouts. The company dashboard does not grant payment-release permissions.
- Event shuttle fares cover transportation only. Event admission and each return journey are booked separately.
- Logos use the existing media storage. Ensure production media storage and the notification worker are already configured.

## Staff permissions

Transport administrators need `transport.view_transportcompany` and `transport.change_transportcompany`. Support administrators additionally need `transport.view_transportrequest` and `transport.change_transportrequest`. Superusers already have these permissions. Ordinary company staff are managed through company memberships, not Django staff status.

## Checks performed locally

See the focused transport marketplace tests in `backend/tests/test_transport_marketplace.py`. Local browser fixtures in `backend/tests/local_ui_server.py` use a disposable SQLite database and fake transport data; they never use the live database.
