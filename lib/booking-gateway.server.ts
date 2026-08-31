/** Server-only boundary for the studio's scheduling service. Never import from client components. */
export class BookingGatewayError extends Error {
  constructor(public code: "NOT_CONFIGURED" | "UNAVAILABLE" | "CONFLICT", public status: number) { super(code); }
}

export async function bookingGateway(path: string, init: RequestInit = {}) {
  const base = process.env.KREU_BOOKING_API_URL;
  const token = process.env.KREU_BOOKING_API_TOKEN;
  if (!base || !token) throw new BookingGatewayError("NOT_CONFIGURED", 503);
  let url: URL;
  try {
    const root = new URL(base);
    if (root.protocol !== "https:" || root.username || root.password || root.search || root.hash) throw new Error("Invalid gateway URL");
    url = new URL(`${root.href.replace(/\/$/, "")}/${path}`);
  } catch { throw new BookingGatewayError("UNAVAILABLE", 503); }
  try {
    const response = await fetch(url, {
      ...init, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12000),
      headers: { ...init.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    });
    if (response.status === 409) throw new BookingGatewayError("CONFLICT", 409);
    if (!response.ok) throw new BookingGatewayError("UNAVAILABLE", 502);
    return await response.json();
  } catch (error) {
    if (error instanceof BookingGatewayError) throw error;
    throw new BookingGatewayError("UNAVAILABLE", 502);
  }
}

export function bookingError(error: unknown) {
  const known = error instanceof BookingGatewayError ? error : new BookingGatewayError("UNAVAILABLE", 502);
  return Response.json({ code: known.code }, { status: known.status, headers: { "Cache-Control": "no-store" } });
}
