# Cal.com discovery booking

The existing seven-screen Kreu flow calls server-only Cal.com API v2 endpoints. No Cal embed or redirect is used.

## Environment

Set these server-only variables locally in ignored `.env.local`, and separately in the Vercel project's production/preview environment:

- `CAL_API_KEY`
- `CAL_EVENT_TYPE_ID`

Never prefix them with `NEXT_PUBLIC_`. No credentials are committed, logged, or included in public responses. The Cal host event owns the duration (currently 15 minutes), calendar availability, conferencing and email delivery. Keep automatic confirmation enabled and attendee confirmation emails enabled. This integration does not bypass availability or booking limits.

## Endpoints

- `GET /api/booking/slots`: fetches a 60-day window in Europe/Tirane. Returns `{ success: true, slots: [{ start, end }], timezone }` with future, sorted, deduplicated ISO datetimes.
- `POST /api/booking/create`: validates name, email, business, website choice/URL, revenue, optional notes, a future `start`, and optional `timezone` (defaults to Europe/Tirane). Requires same-origin JSON and an `Idempotency-Key` UUID.
- Former `/api/booking` and `/api/booking/availability` URLs forward to these handlers; their response contract is now the Cal-backed contract.

Only the server selects the event type. Only an accepted Cal booking with valid start/end timestamps becomes a confirmation. The response contains a normalized booking UID, start/end, timezone, and an optional validated HTTPS meeting URL. No invented meeting links or raw Cal errors reach the UI.

Qualification answers are attached as metadata. Long website/notes values are split into 500-character continuation keys (`notes_2`, etc.) to preserve the entire answer within Cal's limits. Notes are not sent to another service.

## Duplicate and conflict handling

The client disables submission synchronously using a ref and a disabled button. It reuses the same request key after an uncertain response. Concurrent identical requests within an instance share one promise.

Cal metadata records an HMAC of the request key and payload. Before posting, the server searches Cal for a matching completed booking, including on a fresh server instance. On uncertain POST responses it checks again instead of blindly re-posting. Different payloads under the same matching request token are rejected. Cal's own availability checks remain enabled, and occupied slots return `SLOT_UNAVAILABLE`; the UI reloads availability.

Cal's documented create endpoint does not provide a native idempotency-key contract. Metadata recovery plus provider conflict checks is not a general cross-region transactional lock. Keep this event non-seated/non-recurring; do not enable overlapping bookings. If requirements expand to guaranteed distributed exactly-once writes independent of Cal, a durable idempotency store would be required; none has been added here. Configure abuse/rate protection at the deployment edge before broad public traffic.

## Verification

Run `node --test tests/booking.test.mjs`, `npx tsc --noEmit`, and `npm run build`.

Tests cover validation, future slots, duplicate submissions, recovery on a new instance, lost responses, provider conflicts, metadata limits, unsafe meeting URLs and credential-free errors. Never store real keys in tests or fixtures.

A live availability check and a browser-created test booking were performed against the configured event. The real confirmation included a Cal Video link. The test appointment was cancelled after verification. Confirm email receipt in the account inbox if delivery assurance is required: an accepted booking verifies Cal's response, not inbox delivery.

## API references

- [Availability](https://cal.com/docs/api-reference/v2/slots/get-available-time-slots-for-an-event-type): version `2024-09-04`, range format.
- [Create booking](https://cal.com/docs/api-reference/v2/bookings/create-a-booking): version `2026-02-25`, attendee and metadata payload.
- [List bookings](https://cal.com/docs/api-reference/v2/bookings/get-all-bookings): version `2026-05-01`, request recovery.
