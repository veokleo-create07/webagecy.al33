import { validateStep, validTimezone, type BookingDetails } from "@/lib/booking";
import { BOOKING_TIMEZONE, BOOKING_WINDOW_DAYS, calErrorResponse, createBooking, timestamp } from "@/lib/cal.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function invalid(code: string, status = 400) {
  return Response.json({ success: false, code }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return invalid("INVALID_ORIGIN", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return invalid("INVALID_CONTENT_TYPE", 415);
  const key = request.headers.get("idempotency-key") || "";
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(key)) return invalid("INVALID_REQUEST_KEY");
  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return invalid("INVALID_DETAILS");
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16384) { await reader.cancel(); return invalid("PAYLOAD_TOO_LARGE", 413); }
      chunks.push(value);
    }
    data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) return invalid("INVALID_DETAILS");
  } catch { return invalid("INVALID_DETAILS"); }
  if (["fullName", "email", "businessName", "hasWebsite", "revenue"].some(field => typeof data[field] !== "string")) return invalid("INVALID_DETAILS");
  if (data.notes !== undefined && typeof data.notes !== "string") return invalid("INVALID_DETAILS");
  if (data.hasWebsite === "yes" && typeof data.website !== "string") return invalid("INVALID_DETAILS");
  const details: BookingDetails = { fullName: data.fullName as string, email: data.email as string, businessName: data.businessName as string, hasWebsite: data.hasWebsite as BookingDetails["hasWebsite"], website: data.hasWebsite === "yes" ? data.website as string : "", revenue: data.revenue as string, notes: data.notes as string || "" };
  for (let step = 0; step < 6; step++) {
    const error = validateStep(step, details);
    if (error) return Response.json({ success: false, code: "INVALID_DETAILS", step, message: error }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }
  const timezone = data.timezone ?? BOOKING_TIMEZONE;
  if (typeof timezone !== "string" || timezone.length > 100 || !validTimezone(timezone)) return invalid("INVALID_TIMEZONE");
  const start = timestamp(data.start);
  if (start === null || start <= Date.now() || start > Date.now() + BOOKING_WINDOW_DAYS * 86400000) return invalid("INVALID_START");
  try {
    const booking = await createBooking({ ...details, start: new Date(start).toISOString(), timezone }, key);
    return Response.json({ success: true, status: "confirmed", booking }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return calErrorResponse(error); }
}
