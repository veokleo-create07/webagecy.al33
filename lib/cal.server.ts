import "server-only";
import { createHmac } from "node:crypto";
import { normalizedEmail, normalizedWebsite, type BookingDetails, type Confirmation } from "@/lib/booking";

const API = "https://api.cal.com/v2/";
export const BOOKING_TIMEZONE = "Europe/Tirane";
export const BOOKING_WINDOW_DAYS = 60;
const DAY = 86400000;
type JsonObject = Record<string, unknown>;
export type AvailableSlot = { start: string; end: string };
export type BookingInput = BookingDetails & { start: string; timezone: string };

export class CalError extends Error {
  constructor(public code: "NOT_CONFIGURED" | "AVAILABILITY_UNAVAILABLE" | "BOOKING_UNAVAILABLE" | "SLOT_UNAVAILABLE" | "BOOKING_PENDING" | "INVALID_REQUEST_KEY", public status = 502) { super(code); }
}

function config() {
  const key = process.env.CAL_API_KEY?.trim();
  const id = process.env.CAL_EVENT_TYPE_ID?.trim();
  if (!key || !id || !/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) <= 0) throw new CalError("NOT_CONFIGURED", 503);
  return { key, eventTypeId: Number(id) };
}

function object(value: unknown): JsonObject {
  return value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
}

export function timestamp(value: unknown): number | null {
  if (typeof value !== "string" || value.length > 40 || !/^\d{4}-\d\d-\d\dT\d\d:\d\d(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(value)) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

async function calRequest(path: string, version: string, init: RequestInit = {}): Promise<JsonObject> {
  const { key } = config();
  const failure = path.startsWith("slots?") ? "AVAILABILITY_UNAVAILABLE" : "BOOKING_UNAVAILABLE";
  try {
    const response = await fetch(`${API}${path}`, {
      ...init, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12000),
      headers: { Authorization: `Bearer ${key}`, "cal-api-version": version, "Content-Type": "application/json", Accept: "application/json", "User-Agent": "KreuWeb/1.0" },
    });
    const body = object(await response.json());
    if (!response.ok || body.status !== "success") {
      // Cal returns some availability conflicts as HTTP 400. Inspect only to
      // classify them; never forward or log the raw response or request headers.
      const error = object(body.error);
      const message = JSON.stringify(error).toLowerCase();
      if (init.method === "POST" && (response.status === 409 || (response.status === 400 && /not available|no longer available|already booked|booking conflict|unavailable slot|user.*unavailable|slot.*unavailable/.test(message)))) throw new CalError("SLOT_UNAVAILABLE", 409);
      throw new CalError(failure, response.status === 429 ? 503 : 502);
    }
    return body;
  } catch (error) {
    if (error instanceof CalError) throw error;
    throw new CalError(failure);
  }
}

export function normalizeSlots(data: unknown, from: number, until: number): AvailableSlot[] {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new CalError("AVAILABILITY_UNAVAILABLE");
  const unique = new Map<string, AvailableSlot>();
  for (const group of Object.values(data)) {
    if (!Array.isArray(group)) throw new CalError("AVAILABILITY_UNAVAILABLE");
    for (const raw of group) {
      const slot = object(raw);
      const start = timestamp(slot.start), end = timestamp(slot.end);
      if (start === null || end === null || start <= from || start > until || end <= start || end - start > 4 * 60 * 60 * 1000) continue;
      const iso = new Date(start).toISOString();
      unique.set(iso, { start: iso, end: new Date(end).toISOString() });
    }
  }
  return [...unique.values()].sort((a, b) => Date.parse(a.start) - Date.parse(b.start)).slice(0, 2000);
}

export async function availableSlots(from = Date.now(), until = from + BOOKING_WINDOW_DAYS * DAY) {
  const { eventTypeId } = config();
  const query = new URLSearchParams({ eventTypeId: String(eventTypeId), start: new Date(from).toISOString(), end: new Date(until).toISOString(), timeZone: BOOKING_TIMEZONE, format: "range" });
  const result = await calRequest(`slots?${query}`, "2024-09-04");
  return normalizeSlots(result.data, Math.max(from, Date.now()), until);
}

export function safeMeetingUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 2048 || (process.env.CAL_API_KEY && value.includes(process.env.CAL_API_KEY))) return;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || !url.hostname.includes(".") || url.hostname === "localhost" || url.hostname.endsWith(".local")) return;
    return url.href;
  } catch { return; }
}

export function normalizeConfirmation(raw: unknown, input: BookingInput): Confirmation {
  const booking = object(raw);
  if (booking.status === "pending") throw new CalError("BOOKING_PENDING", 409);
  const start = timestamp(booking.start), end = timestamp(booking.end);
  if (booking.status !== "accepted" || typeof booking.uid !== "string" || !booking.uid || start === null || end === null || start !== Date.parse(input.start) || end <= start) throw new CalError("BOOKING_UNAVAILABLE");
  const joinUrl = safeMeetingUrl(booking.meetingUrl) ?? safeMeetingUrl(booking.location);
  return { id: booking.uid, startsAt: new Date(start).toISOString(), endsAt: new Date(end).toISOString(), timezone: input.timezone, ...(joinUrl ? { joinUrl } : {}) };
}

function metadataFor(input: BookingInput, requestToken: string, payloadToken: string) {
  const metadata: Record<string, string> = { source: "kreu-web", kreuRequest: requestToken, kreuPayload: payloadToken, businessName: input.businessName.trim(), hasWebsite: input.hasWebsite, investment: input.investment, referralSource: input.referralSource };
  // Cal metadata values have a 500-character limit. Keep long answers intact
  // across bounded continuation keys rather than silently truncating them.
  for (const [key, value] of Object.entries({ website: input.hasWebsite === "yes" ? normalizedWebsite(input.website) || "" : "", notes: input.notes.trim() })) {
    metadata[key] = value.slice(0, 500);
    for (let offset = 500; offset < value.length; offset += 500) metadata[`${key}_${offset / 500 + 1}`] = value.slice(offset, offset + 500);
  }
  return metadata;
}

async function recoverBooking(input: BookingInput, requestToken: string, payloadToken: string): Promise<Confirmation | null> {
  const { eventTypeId } = config();
  const time = Date.parse(input.start);
  const query = new URLSearchParams({ attendeeEmail: normalizedEmail(input.email)!, eventTypeId: String(eventTypeId), afterStart: new Date(time - 1000).toISOString(), beforeEnd: new Date(time + DAY).toISOString(), limit: "100" });
  const result = await calRequest(`bookings?${query}`, "2026-05-01");
  if (!Array.isArray(result.data)) throw new CalError("BOOKING_UNAVAILABLE");
  for (const raw of result.data) {
    const booking = object(raw), metadata = object(booking.metadata);
    if (metadata.kreuRequest !== requestToken) continue;
    if (metadata.kreuPayload !== payloadToken) throw new CalError("INVALID_REQUEST_KEY", 409);
    if (booking.status === "cancelled") throw new CalError("SLOT_UNAVAILABLE", 409);
    return normalizeConfirmation(booking, input);
  }
  // An incomplete page cannot safely prove this is a new booking request.
  if (object(result.pagination).hasMore) throw new CalError("BOOKING_UNAVAILABLE");
  return null;
}

const inFlight = new Map<string, { payloadToken: string; promise: Promise<Confirmation> }>();

export async function createBooking(input: BookingInput, requestKey: string): Promise<Confirmation> {
  const { key, eventTypeId } = config();
  const requestToken = createHmac("sha256", key).update(requestKey).digest("hex");
  const normalized = { ...input, email: normalizedEmail(input.email)!, fullName: input.fullName.trim(), businessName: input.businessName.trim(), website: input.hasWebsite === "yes" ? normalizedWebsite(input.website)! : "", notes: input.notes.trim(), start: new Date(input.start).toISOString() };
  const payloadToken = createHmac("sha256", key).update(JSON.stringify(normalized)).digest("hex");
  const running = inFlight.get(requestToken);
  if (running) {
    if (running.payloadToken !== payloadToken) throw new CalError("INVALID_REQUEST_KEY", 409);
    return running.promise;
  }
  if (inFlight.size >= 100) throw new CalError("BOOKING_UNAVAILABLE", 503);
  const promise = (async () => {
    const existing = await recoverBooking(normalized, requestToken, payloadToken);
    if (existing) return existing;
    const time = Date.parse(normalized.start);
    const slots = await availableSlots(time - 1000, time + DAY);
    if (!slots.some(slot => slot.start === normalized.start)) throw new CalError("SLOT_UNAVAILABLE", 409);
    try {
      const result = await calRequest("bookings", "2026-02-25", {
        method: "POST",
        body: JSON.stringify({ eventTypeId, start: normalized.start,
          attendee: { name: normalized.fullName, email: normalized.email, timeZone: normalized.timezone, language: "en" },
          bookingFieldsResponses: { title: `Discovery call: ${normalized.businessName}` },
          metadata: metadataFor(normalized, requestToken, payloadToken),
          // Never bypass Cal's conflict checks, availability windows or limits.
          allowConflicts: false, allowBookingOutOfBounds: false,
        }),
      });
      return normalizeConfirmation(result.data, normalized);
    } catch (error) {
      // A timeout may happen after Cal has booked the slot. Look up our private
      // request token before reporting failure. Never blindly repeat the POST.
      const recovered = await recoverBooking(normalized, requestToken, payloadToken);
      if (recovered) return recovered;
      throw error;
    }
  })();
  inFlight.set(requestToken, { payloadToken, promise });
  try { return await promise; } finally { inFlight.delete(requestToken); }
}

export function calErrorResponse(error: unknown) {
  const safe = error instanceof CalError ? error : new CalError("BOOKING_UNAVAILABLE");
  return Response.json({ success: false, code: safe.code }, { status: safe.status, headers: { "Cache-Control": "no-store" } });
}
