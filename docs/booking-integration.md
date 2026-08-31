# Discovery booking

The six qualification screens, live-availability calendar, submission states and confirmation UI are implemented. All six homepage booking CTAs open the same lazy-loaded modal. Closing and reopening keeps the draft in memory; nothing is stored in localStorage, and personal details are only transmitted on the final booking action.

## Required before accepting appointments

**A scheduling service has not been supplied or connected.** Until it is connected, the calendar clearly reports that online scheduling is unavailable, and the Book button remains disabled. No demo slots or fake confirmations are exposed to visitors.

Connect the studio's calendar with a server-side adapter implementing the contract below. This generic gateway is not a direct Calendly or Cal.com API client. Once the owner selects a provider, either implement the two adapter operations or replace `lib/booking-gateway.server.ts` with that provider's documented integration. No attendee email is collected: the chosen service must support phone-based discovery bookings.

Set these **server-only** environment variables in the local environment and Vercel:

```dotenv
KREU_BOOKING_API_URL=https://your-scheduling-adapter.example/api/kreu
KREU_BOOKING_API_TOKEN=your-server-only-token
```

Never prefix these with NEXT_PUBLIC or commit live credentials. HTTPS is required. Requests use bearer authentication, no redirects or cache, and a 12-second timeout. The adapter must not log phone numbers, revenue or notes unnecessarily.

### GET /availability

Query: `from` and `to` (UTC ISO timestamps, a rolling 60-day window), `timezone` (visitor's IANA timezone).

```json
{ "slots": [{ "id": "opaque-slot-id", "startsAt": "2030-01-10T10:00:00Z", "endsAt": "2030-01-10T10:30:00Z" }] }
```

Dates above illustrate the schema only; they are never used in the site. Supply actual free times based on the connected calendar, business hours, buffers and host availability. Dates require explicit timezone offsets. The public endpoint drops past, duplicate and malformed slots.

### POST /bookings

Receives `Idempotency-Key` (UUID) plus:

```json
{
  "fullName": "Attendee name",
  "phone": "+355691234567",
  "businessName": "Business name",
  "hasWebsite": true,
  "website": "https://business.example/",
  "revenue": "Prefer not to say",
  "notes": "Optional context",
  "slotId": "opaque-slot-id",
  "timezone": "Europe/Tirane"
}
```

The adapter must validate the slot, reserve it atomically, create the calendar appointment and persist the idempotency key with its result. Repeated identical keys must return the same booking, even if the slot is now occupied. Reject reused keys with different payloads. Return HTTP 409 for a genuinely unavailable slot, which refreshes the calendar in the UI. Rate-limit availability and creation at the adapter or hosting edge before public launch; do not use an in-memory counter on serverless instances.

Only after durable booking creation, return:

```json
{ "status": "confirmed", "booking": { "id": "booking-id", "startsAt": "2030-01-10T10:00:00Z", "endsAt": "2030-01-10T10:30:00Z" } }
```

A generic webhook acknowledgement, email notification or `pending` response is **not** confirmation. Only this confirmed response activates “You’re booked.” WhatsApp outreach remains the studio's responsibility; no WhatsApp messages are sent by this integration.

## Verification

Run `npm run build`, `npx tsc --noEmit` and `node --test tests/booking.test.mjs`.

Before enabling real bookings, verify live availability, timezone/DST conversion, phone-based attendee creation, a confirmed appointment in the host calendar, an occupied slot (409), retries with the same idempotency key, and provider failure. Preview tests alone cannot establish a real calendar connection.
