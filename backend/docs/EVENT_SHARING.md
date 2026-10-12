# Event sharing and registration

Organizers choose **Tickets on MMEMME ABIA** or **External registration** at stage 3 of event creation. External events require an HTTPS registration link, skip ticket setup, and display **Register now**. Approval is required for both types. Changing a published registration type or link sends it back for review. Events with booking history cannot switch types.

The Share button copies or shares a link such as `/share/events/abia-tech-rise`. Duplicate event names use `-2`, `-3`, etc. The shared name remains stable after title edits. Earlier UUID share links still resolve.

The shared page sends the event title, description and poster as Open Graph and Twitter metadata before JavaScript runs. A public image endpoint resolves a fresh storage URL for the poster. Messaging apps control whether and when they display or refresh their cached previews. An event without an uploaded poster uses the site logo.

Guests opening a shared link are sent to signup, with a login option for existing members. After OTP/account creation or login, they return to the event. Google and Apple continuation also preserve this destination. Signed-in users go directly to the event. Only approved, active, non-expired events can be previewed.

## Railway deployment

1. Deploy the backend with the normal pre-deploy migration command:

   ```sh
   python manage.py migrate --noinput --settings=config.settings.production
   ```

   This applies event migrations `0012` (registration types) and `0013` (readable share names) if pending. Existing events remain ticketed and receive readable names. No data reset is required.
2. Redeploy the worker with the same backend code.
3. Redeploy the frontend. Its updated Caddy configuration proxies `/share/events/*` and `/share/event-images/*` to the backend, and its build includes `share-shell.html` and `event-share-loader.js`.
4. Keep `FRONTEND_URL` set to the real HTTPS website origin, and keep the frontend's existing `BACKEND_UPSTREAM` connected to the backend. No new credentials are required.
5. Open an approved event, share it, and test the link in a private browser. Complete signup or login and confirm it returns to that event. Test both ticketed and external events.
6. Paste the link into WhatsApp or another messaging app and check its preview. Uploaded posters must be accessible through the public share-image route. If an old preview is cached, request a refresh using the platform's sharing debugger or test a newly created event link.
