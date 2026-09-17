# MMEMME ABIA

Abia events, hotels, food orders, transport and tourism bookings.

- `backend/`: Django API, migrations, payments/payouts, durable jobs and tests.
- `my-project/`: React web application.
- `compose.production.yaml`: production service layout.

Start with [SETUP_GUIDE.md](SETUP_GUIDE.md) for environment configuration and local startup. See [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md) for completed work, validation and remaining launch requirements.

For Railway Hobby with Resend, follow [RAILWAY_SETUP_GUIDE.md](RAILWAY_SETUP_GUIDE.md). For general production deployment and launch gates, see [backend/docs/DEPLOYMENT.md](backend/docs/DEPLOYMENT.md). Run both the API and worker; use PostgreSQL and Redis. Keep credentials out of source control and all `VITE_` variables. Provider transfers default to disabled until merchant setup and finance testing are complete.
