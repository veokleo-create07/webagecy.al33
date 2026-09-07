import { normalizedWebsite, validateStep, type BookingDetails } from "@/lib/booking";

const LEADS_WEBHOOK_URL = "https://n8n.rizlyy.app/webhook-test/kreu.web.leads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 20;

function response(success: boolean, status: number, code?: string) {
  return Response.json({ success, ...(code ? { code } : {}) }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return response(false, 403, "INVALID_ORIGIN");
  if (!request.headers.get("content-type")?.includes("application/json")) return response(false, 415, "INVALID_CONTENT_TYPE");

  let data: Record<string, unknown>;
  try {
    const body = await request.text();
    if (body.length > 16_384) return response(false, 413, "PAYLOAD_TOO_LARGE");
    data = JSON.parse(body);
    if (!data || typeof data !== "object" || Array.isArray(data)) return response(false, 400, "INVALID_DETAILS");
  } catch {
    return response(false, 400, "INVALID_DETAILS");
  }

  if (["fullName", "businessName", "hasWebsite", "countryCode", "whatsapp", "investment"].some(key => typeof data[key] !== "string") || (data.notes !== undefined && typeof data.notes !== "string") || (data.website !== undefined && typeof data.website !== "string")) return response(false, 400, "INVALID_DETAILS");

  const details: BookingDetails = {
    fullName: data.fullName as string,
    businessName: data.businessName as string,
    hasWebsite: data.hasWebsite as BookingDetails["hasWebsite"],
    website: data.website as string ?? "",
    countryCode: data.countryCode as string,
    whatsapp: data.whatsapp as string,
    investment: data.investment as string,
    notes: data.notes as string ?? "",
  };

  for (let step = 0; step < 6; step++) if (validateStep(step, details)) return response(false, 400, "INVALID_DETAILS");

  const website = details.hasWebsite === "yes" ? normalizedWebsite(details.website) : null;
  const whatsapp = `${details.countryCode}${details.whatsapp.replace(/\D/g, "")}`;
  try {
    const webhook = await fetch(LEADS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        fullName: details.fullName.trim(),
        businessName: details.businessName.trim(),
        hasWebsite: details.hasWebsite === "yes",
        ...(website ? { website } : {}),
        whatsapp,
        countryCode: details.countryCode,
        investment: details.investment,
        ...(details.notes.trim() ? { projectDetails: details.notes.trim() } : {}),
        submittedAt: new Date().toISOString(),
        source: "kreuweb.com",
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!webhook.ok) return response(false, 502, "LEAD_DELIVERY_FAILED");
  } catch {
    return response(false, 502, "LEAD_DELIVERY_FAILED");
  }

  return response(true, 200);
}
