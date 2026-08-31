import { availableSlots, BOOKING_TIMEZONE, calErrorResponse } from "@/lib/cal.server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    return Response.json({ success: true, slots: await availableSlots(), timezone: BOOKING_TIMEZONE }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return calErrorResponse(error); }
}
