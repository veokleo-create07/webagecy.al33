// Compatibility entry point; all booking writes use the Cal.com implementation.
export { POST } from "./create/route";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;
