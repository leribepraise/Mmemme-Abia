# Google and Apple sign-in on Railway

Social sign-in is available to users and organizers. Facebook has been removed from sign-in and sign-up. The backend exchanges one-time authorization codes and verifies signed identity tokens; the browser never receives provider secrets. A new Google or Apple account is created only after the user enters the emailed six-digit OTP and sets a password meeting the same rules as normal signup. An existing, verified non-staff account with the same verified email can be linked. Organizer approval is unchanged: signing in with Google or Apple does not approve an organizer.

The buttons remain disabled until that provider's backend credentials are configured. Do not put credentials in `VITE_` variables or commit them.

## 1. Choose the one public URL

Use the same HTTPS origin as Railway's `FRONTEND_URL`, for example `https://mmemme.com.ng` **or** `https://www.mmemme.com.ng`. The frontend must proxy `/api/` to the backend on that origin. The provider callback URLs are exactly:

- Google: `<FRONTEND_URL>/api/v1/auth/social/google/callback/`
- Apple: `<FRONTEND_URL>/api/v1/auth/social/apple/callback/`

The trailing slash matters. Set `SOCIAL_AUTH_ORIGIN` only if you need to spell out that same origin; production settings reject a different origin.

## 2. Google

In Google Cloud, configure the OAuth consent screen and create an **OAuth client ID → Web application**. Add your public origin as an authorized JavaScript origin and the exact Google callback URL above as an authorized redirect URI. For local development you can also register `http://localhost:5173/api/v1/auth/social/google/callback/` and use a separate development client. If the consent screen is in testing, add the accounts that will test it; publish it when ready for general users.

Set these private variables on the Railway **backend** service:

| Variable | Value |
| --- | --- |
| `GOOGLE_OAUTH_CLIENT_ID` | Web application client ID |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Matching client secret |

## 3. Apple

An Apple Developer account must have a Sign in with Apple-enabled primary App ID. Create a web **Services ID**, associate the website, register the domain and the exact Apple callback URL above, then create a Sign in with Apple private key (`.p8`).

Set these private variables on the Railway **backend** service:

| Variable | Value |
| --- | --- |
| `APPLE_SERVICES_ID` | Web Services ID (client identifier) |
| `APPLE_TEAM_ID` | Apple Developer Team ID |
| `APPLE_KEY_ID` | Private key ID |
| `APPLE_PRIVATE_KEY` | Entire `.p8` private key, including BEGIN/END lines |

Apple requires an HTTPS callback; localhost cannot be used as Apple's web return URL. For users choosing Hide My Email, register and authenticate the sender domain used by `DEFAULT_FROM_EMAIL` (currently `notifications.mmemme.com.ng`) in Apple's Private Email Relay configuration so booking and security emails can be forwarded.

## 4. Deploy and verify

1. Apply migration `accounts.0007_socialidentity` using the backend pre-deploy migration command.
2. Redeploy the backend and frontend. The worker needs no social provider credentials.
3. Open `/api/v1/auth/social/config/` on the public site. It should show `true` for each configured provider, without secrets.
4. Test a new user with Google: enter the OTP received at the provider email address, set a password, then sign out and sign in again. Verify one account is reused and onboarding appears only when needed.
5. Test an existing verified organizer account. Its role and approval status must remain unchanged. A new organizer must still submit an application.
6. Test Apple on the deployed HTTPS site, including Hide My Email, OTP delivery to that relay address, and password setup. Apple sign-up remains unavailable until its credentials are configured.
7. Test cancellation, a second-tab login, an invalid/expired callback, and password login for existing accounts.

Server-side automated tests mock provider responses; they do not prove that the real Google/Apple console configuration is correct. Complete the real-browser checks before calling social sign-in live.
