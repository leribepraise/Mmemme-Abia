# Hotels and stays: dashboard and deployment

## Access and setup

- Providers apply at `/stays/provider` using an active, email-verified account.
- Admins review applications at `/admin/hotels/properties`. Approving a provider
  requires an explicit agreed commission: 500 basis points = 5%. Hotel commission
  does not automatically inherit the event commission.
- One provider can manage multiple hotels, guesthouses, apartments, resorts and
  holiday homes. For an entire apartment/home, create one room type and one
  physical unit, and allocate one unit per night.
- Create a property, upload real photos, create room types and physical rooms,
  then publish nightly availability/rates. New properties and text/photo changes
  require property review. Provider legal identity changes require fresh approval.
- Contact details, house rules, guest capacities and check-in/out times are
  displayed to guests. Booking snapshots preserve agreed prices and policies.

## Staff

Owners manage the business identity, properties, staff and payouts. Managers
manage property operations, calendar, reservations, earnings and support.
Reception staff see reservations and can assign ready rooms, check guests in/out
and record no-shows. Housekeeping staff can update readiness without seeing guest
reservation data or financial records. Staff accounts must already be verified;
disable a membership to revoke access. Membership applies across the business's
properties and does not grant Django staff access.

Hotel administrators need `hotels.view_hotelprovider` and
`hotels.change_hotelprovider`; property approval additionally requires
`hotels.change_hotel`. Support administrators need `hotels.view_hotelrequest` and
`hotels.change_hotelrequest`. Finance actions retain existing payment permissions
and require a different authorized reviewer. Superusers have these permissions.

## Calendar and inventory rules

Each date represents one night. The end date is excluded. A 10–13 October stay
uses the nights of 10, 11 and 12 October. Availability searches and reservations
require enough rooms of the same type on every night, with enough guest capacity.

The calendar supports 1–366 future nights at a time, seasonal/weekend rates,
quantity reductions and date blocking. Guest stays support 1–30 nights and
1–20 rooms. Physical rooms must exist before allocating stock; quantities cannot
exceed active units outside maintenance. A range update is all-or-nothing.
Booked nights cannot be repriced, blocked or reduced below held/sold quantities.

Allocate rooms exclusively to MMEMME ABIA and update allocations for other sales.
This release does not synchronize with Booking.com, another channel manager or a
hotel's separate property-management system. Dirty rooms may be advertised for a
future stay but must be cleaned before check-in. Maintenance reduces future
unsold allocations and is blocked if it would displace existing reservations.

## Reservations and reception

Guests search dates/rooms/guests, review a complete nightly price breakdown,
reserve rooms and pay through the existing Paystack checkout. Free stays confirm
without a payment. A temporary hold protects inventory during payment.

`/stays/bookings` shows the stay details, policy, real property photo, QR pass,
payment continuation, cancellation and support. Confirmation and reminder emails
reuse the notification worker. Reminder messages are queued once within 24 hours
before the snapshotted check-in time, following existing notification preferences.

At reception, find the reservation, choose one ready room of the booked type per
reserved room and check in. Staff can optionally read the QR with an external
scanner and paste its token for verification. Reference lookup is also supported.
There is no built-in camera scanner or offline check-in mode. Overlapping room
assignments and rooms still occupied by overstaying guests are rejected.

Check-in respects the booked check-in time and stay period. Checkout requires
actual check-in and the booked checkout date/time to have passed; early checkout
is a support case. Checkout completes the stay and marks assigned units DIRTY.
Housekeeping marks them READY after cleaning. A no-show records an exception and
does not complete the stay or release a payout. Managers can correct a no-show
with a reason so arrival can proceed, or cancel/refund the unused stay.

Guest cancellation follows the snapshotted cutoff before check-in. Property
cancellation of an unoccupied reservation requires a reason and queues a full
refund for captured payments. Refunds run through the worker and Paystack;
delivery is not instant. Occupied/completed stays require admin support review.

Earnings use the commission captured at reservation. Payouts use the existing
Paystack-verified bank account, completed-stay settlement hold and independent
finance approval. Provider balances may include the owner's other services;
review payout allocations before approval.

## Existing data

Legacy hotels, room types, inventory and bookings remain compatible. They are not
silently transferred into provider accounts. Admins can use Existing property
records (`/admin/hotels/records`) and move a property belonging to the same owner
into an approved provider dashboard after ongoing reservations are resolved.
The property then requires review. Add its real physical units before publishing
new allocations. Transaction histories are preserved.

## Railway deployment

1. Commit and push to the connected branch.
2. Deploy backend with the existing pre-deploy command:

   `python manage.py migrate --noinput --settings=config.settings.production`

   This applies hotel migration 0002. Keep the normal backend web start command.
3. Redeploy worker and frontend from the same commit. Worker command remains:

   `python manage.py process_jobs --settings=config.settings.production`

4. Check readiness, then test provider approval, property review, photos, rooms,
   date search, booking, reception, refund and settlement with controlled data.

No new secrets are required. Existing media storage, Paystack and notification
credentials must work. Local tests use disposable SQLite and mocked payments;
controlled live Paystack validation is still required after deployment.
