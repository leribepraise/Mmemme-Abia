# Event image delivery and removal rollout

The `events.0007` migration adds card/detail image variants and the staff-reviewed event removal state. Deploy and run migrations before deploying the frontend. Keep the existing Railway worker running: each `process_jobs` tick converts up to four unprocessed uploaded event images to 640 px and 1280 px WebP copies in the configured S3 bucket. New event uploads enter the same queue. The original remains available as a fallback until both variants are ready.

The website uses the card copy for event lists, bookings and tickets, and the detail copy for large event views. Older event records that only contain an external `image_url` are left unchanged; converting those requires an organizer to upload the source image to Mmemme Abia. Do not fetch arbitrary external URLs in the worker.

Check a live phone page in browser Network tools after deployment: compare image transfer sizes and response time on the first and repeat loads. If storage response time remains high after variants are ready, move *public listing artwork* to a dedicated image CDN; Railway buckets are private and currently return signed URLs. Keep private chat and account media protected. The image copies alone do not create a CDN.

Organizers request event removal from My Events. Staff review it at Admin → Events → Removal requests. Approval archives the event and hides it from public and organizer lists while retaining the row and audit history. Events with any booking history cannot be removed; staff must resolve cancellation and refunds through the existing workflow.
