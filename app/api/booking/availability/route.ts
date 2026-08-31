import { bookingGateway, bookingError } from "@/lib/booking-gateway.server";
import { validTimezone, type Slot } from "@/lib/booking";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const timezone = new URL(request.url).searchParams.get("timezone") || "Europe/Tirane";
  if (timezone.length > 100 || !validTimezone(timezone)) return Response.json({ code: "INVALID_TIMEZONE" }, { status: 400 });
  const now = Date.now();
  const end = now + 60 * 24 * 60 * 60 * 1000;
  const query = new URLSearchParams({ from: new Date(now).toISOString(), to: new Date(end).toISOString(), timezone });
  try {
    const result = await bookingGateway(`availability?${query}`);
    if (!Array.isArray(result.slots)) throw new Error("Invalid availability response");
    const ids = new Set<string>();
    const slots: Slot[] = result.slots.slice(0, 2000).filter((slot: Slot) => {
      if (!slot || typeof slot.id !== "string" || !slot.id || slot.id.length > 200 || ids.has(slot.id)) return false;
      if (typeof slot.startsAt !== "string" || typeof slot.endsAt !== "string") return false;
      // Require explicit offsets: never interpret provider dates in the server timezone.
      if (!/(Z|[+-]\d\d:\d\d)$/.test(slot.startsAt) || !/(Z|[+-]\d\d:\d\d)$/.test(slot.endsAt)) return false;
      const start = Date.parse(slot.startsAt), finish = Date.parse(slot.endsAt);
      if (!Number.isFinite(start) || !Number.isFinite(finish) || start <= now || start > end || finish <= start || finish - start > 4 * 60 * 60 * 1000) return false;
      ids.add(slot.id);
      return true;
    }).map(({ id, startsAt, endsAt }: Slot) => ({ id, startsAt, endsAt })).sort((a: Slot, b: Slot) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
    return Response.json({ slots, timezone }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return bookingError(error); }
}
