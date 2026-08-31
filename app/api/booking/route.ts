import { getCountries } from "libphonenumber-js/min";
import { normalizedPhone, normalizedWebsite, validateStep, validTimezone, type BookingDetails } from "@/lib/booking";
import { bookingGateway, bookingError } from "@/lib/booking-gateway.server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ code: "INVALID_ORIGIN" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json")) return Response.json({ code: "INVALID_CONTENT_TYPE" }, { status: 415 });
  const key = request.headers.get("idempotency-key") || "";
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(key)) return Response.json({ code: "INVALID_REQUEST_KEY" }, { status: 400 });
  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) throw new Error("Missing body");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16384) { await reader.cancel(); return Response.json({ code: "PAYLOAD_TOO_LARGE" }, { status: 413 }); }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || Array.isArray(data) || typeof data !== "object") throw new Error("Invalid body");
  } catch { return Response.json({ code: "INVALID_DETAILS" }, { status: 400 }); }
  const fields = ["fullName", "country", "phone", "businessName", "hasWebsite", "website", "revenue", "notes", "slotId", "timezone"];
  if (fields.some(field => typeof data[field] !== "string")) return Response.json({ code: "INVALID_DETAILS" }, { status: 400 });
  const details = data as unknown as BookingDetails;
  if (!(getCountries() as string[]).includes(details.country) || details.phone.length > 40 || typeof data.timezone !== "string" || data.timezone.length > 100 || !validTimezone(data.timezone) || typeof data.slotId !== "string" || !data.slotId || data.slotId.length > 200) return Response.json({ code: "INVALID_DETAILS" }, { status: 400 });
  for (let step = 0; step < 6; step++) {
    const error = validateStep(step, details);
    if (error) return Response.json({ code: "INVALID_DETAILS", step, message: error }, { status: 400 });
  }
  try {
    // The gateway must atomically reserve the slot and replay the same result for this key.
    // Do not pre-check availability here: a retry of a successful booking must still succeed.
    const result = await bookingGateway("bookings", {
      method: "POST", headers: { "Idempotency-Key": key },
      body: JSON.stringify({
        fullName: details.fullName.trim(), phone: normalizedPhone(details), businessName: details.businessName.trim(),
        hasWebsite: details.hasWebsite === "yes", website: details.hasWebsite === "yes" ? normalizedWebsite(details.website) : null,
        revenue: details.revenue, notes: details.notes.trim(), slotId: data.slotId, timezone: data.timezone,
      }),
    });
    const booking = result.booking;
    if (result.status !== "confirmed" || !booking || typeof booking.id !== "string" || !booking.id || typeof booking.startsAt !== "string" || typeof booking.endsAt !== "string" || !/(Z|[+-]\d\d:\d\d)$/.test(booking.startsAt) || !/(Z|[+-]\d\d:\d\d)$/.test(booking.endsAt) || !Number.isFinite(Date.parse(booking.startsAt)) || !Number.isFinite(Date.parse(booking.endsAt)) || Date.parse(booking.endsAt) <= Date.parse(booking.startsAt)) throw new Error("Booking not confirmed");
    return Response.json({ status: "confirmed", booking: { id: booking.id, startsAt: booking.startsAt, endsAt: booking.endsAt, timezone: data.timezone } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return bookingError(error); }
}
