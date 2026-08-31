import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire, stripTypeScriptTypes } from "node:module";

const require = createRequire(import.meta.url);
// Exercise the real TypeScript modules without another test/runtime dependency.
function load(file, dependencies = {}, globals = {}) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const exported = [];
  const compiled = stripTypeScriptTypes(source, { mode: "transform" })
    .replace(/^import "server-only";\s*/m, "")
    .replace(/^import \{([\s\S]*?)\} from ["']([^"']+)["'];/gm, (_, bindings, name) => `const {${bindings.replace(/\bas\b/g, ":")}} = require(${JSON.stringify(name)});`)
    .replace(/^export (async )?(function|class|const) (\w+)/gm, (_, async, kind, name) => { exported.push(name); return `${async ?? ""}${kind} ${name}`; });
  const exports = {};
  // Keep library option objects in the same realm; isolate only imports and environment.
  const run = new Function("exports", "require", "process", "fetch", `${compiled}\n${exported.map(name => `exports.${name} = ${name};`).join("\n")}`);
  run(exports, name => dependencies[name] ?? require(name), { env: globals.env ?? {} }, globals.fetch ?? fetch);
  return exports;
}
const booking = load("lib/booking.ts");
const details = { ...booking.emptyDetails, fullName: "Test Visitor", email: " Visitor+call@EXAMPLE.com ", businessName: "Test Studio", hasWebsite: "yes", website: "example.com", revenue: "€10k–€50k", notes: "" };
const payload = { ...details, start: new Date(Date.now() + 86400000).toISOString(), timezone: "Europe/Tirane" };
const key = "12345678-1234-4123-8123-123456789012";
const future = payload.start;
const finish = new Date(Date.parse(future) + 900000).toISOString();
function request(data = payload, headers = {}) {
  return new Request("https://kreu.example/api/booking", { method: "POST", headers: { Origin: "https://kreu.example", "Content-Type": "application/json", "Idempotency-Key": key, ...headers }, body: JSON.stringify(data) });
}

test("all six qualification steps accept valid data; notes are optional", () => {
  for (let step = 0; step < 6; step++) assert.equal(booking.validateStep(step, details), null);
  assert.equal(booking.normalizedEmail(details.email), "Visitor+call@example.com");
});
test("required fields, email addresses and revenue choices are validated", () => {
  for (const [step, patch] of [[0, { fullName: "" }], [1, { email: "" }], [2, { businessName: "" }], [3, { hasWebsite: "" }], [4, { revenue: "project budget" }], [5, { notes: "a".repeat(2001) }]]) assert.equal(typeof booking.validateStep(step, { ...details, ...patch }), "string");
});
test("email accepts aliases and subdomains but rejects malformed mailboxes", () => {
  for (const email of ["hello@example.com", "first.last+call@studio.example.co.uk", "o'neil@example.com"]) assert.equal(booking.validateStep(1, { ...details, email }), null);
  for (const email of ["", "   ", "name", "name@", "@example.com", "name@example", "name@@example.com", "first last@example.com", ".name@example.com", "name..last@example.com", "name.@example.com", "name@-example.com", "name@example-.com", "name@example..com", "name@example.com\r\nBcc:other@example.com", `${"a".repeat(65)}@example.com`, `name@${"a".repeat(64)}.com`]) assert.ok(booking.validateStep(1, { ...details, email }), email);
});
test("revenue offers exactly four ranges and rejects the removed option", () => {
  assert.deepEqual(booking.revenueOptions, ["Under €10k", "€10k–€50k", "€50k–€100k", "€100k+"]);
  for (const revenue of booking.revenueOptions) assert.equal(booking.validateStep(4, { ...details, revenue }), null);
  assert.equal(booking.validateStep(4, { ...details, revenue: "Prefer not to say" }), "Choose a revenue range.");
});
test("website is required only for Yes; unsafe schemes and credentials fail", () => {
  assert.equal(booking.validateStep(3, { ...details, hasWebsite: "no", website: "" }), null);
  assert.ok(booking.validateStep(3, { ...details, website: "" }));
  assert.equal(booking.normalizedWebsite("example.com"), "https://example.com/");
  for (const url of ["javascript:alert(1)", "ftp://example.com", "https://user:secret@example.com", "no-domain"]) assert.equal(booking.normalizedWebsite(url), null);
});
test("calendar dates respect timezone midnight and daylight savings", () => {
  assert.equal(booking.dayKey("2030-01-10T23:30:00Z", "Europe/Tirane"), "2030-01-11");
  assert.equal(booking.dayKey("2030-07-10T22:30:00Z", "Europe/Tirane"), "2030-07-11");
  assert.equal(booking.dayKey("2030-01-10T01:30:00Z", "America/New_York"), "2030-01-09");
  assert.equal(booking.validTimezone("not/a-zone"), false);
});

const env = { CAL_API_KEY: "unit-test-secret", CAL_EVENT_TYPE_ID: "123" };
function setup(handler, configured = true) {
  const cal = load("lib/cal.server.ts", { "@/lib/booking": booking }, { env: configured ? env : {}, fetch: handler });
  const deps = { "@/lib/booking": booking, "@/lib/cal.server": cal };
  return { cal, post: load("app/api/booking/create/route.ts", deps).POST, get: load("app/api/booking/slots/route.ts", deps).GET };
}
const api = data => Response.json({ status: "success", data });
function provider() {
  const p = { writes: [], saved: [], occupied: false, loseResponse: false, conflict: false, pending: false };
  p.fetch = async (url, init) => {
    if (url.includes("slots?")) return api(p.occupied ? {} : { day: [{ start: future, end: finish }] });
    if (init.method !== "POST") return api(p.saved);
    if (p.conflict) return Response.json({ status: "error", error: { message: "User is not available at this time" } }, { status: 400 });
    const body = JSON.parse(init.body); p.writes.push(body);
    const record = { uid: "provider-confirmation", status: p.pending ? "pending" : "accepted", start: future, end: finish, meetingUrl: "https://app.cal.com/video/test-room", metadata: body.metadata };
    p.saved.push(record); p.occupied = true;
    if (p.loseResponse) throw new Error("Disconnected after provider commit");
    return api(record);
  };
  return p;
}
test("slots are normalized, future-only, deduplicated and credential-free", async () => {
  const { get } = setup(async (url, init) => {
    const query = new URL(url).searchParams;
    assert.equal(query.get("timeZone"), "Europe/Tirane");
    assert.equal(query.get("eventTypeId"), env.CAL_EVENT_TYPE_ID);
    assert.equal(query.get("format"), "range");
    assert.equal(init.headers["cal-api-version"], "2024-09-04");
    return api({ day: [{ start: future, end: finish }, { start: future, end: finish }, { start: "2000-01-01T09:00:00Z", end: "2000-01-01T10:00:00Z" }, { start: future.slice(0, -1), end: finish }, { broken: true }] });
  });
  const response = await get();
  assert.deepEqual(await response.json(), { success: true, slots: [{ start: future, end: finish }], timezone: "Europe/Tirane" });
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("missing configuration and provider errors never leak secrets", async () => {
  assert.equal((await setup(() => { throw new Error("Unexpected fetch"); }, false).get()).status, 503);
  const bad = setup(async () => Response.json({ status: "error", error: { message: env.CAL_API_KEY } }, { status: 401 }));
  for (const response of [await bad.get(), await bad.post(request())]) {
    assert.equal((await response.text()).includes(env.CAL_API_KEY), false);
    assert.equal(response.status, 502);
  }
});
test("invalid email, website, timezone, start, origin and oversized payload are rejected before Cal", async () => {
  let calls = 0;
  const { post } = setup(async () => { calls++; throw new Error("Unexpected fetch"); });
  for (const patch of [{ email: "bad" }, { email: undefined }, { website: "" }, { revenue: "Prefer not to say" }, { start: "2000-01-01T09:00:00Z" }, { start: "2030-01-01T09:00:00" }, { timezone: "invalid" }, { notes: 123 }]) assert.equal((await post(request({ ...payload, ...patch }))).status, 400);
  assert.equal((await post(request(payload, { Origin: "https://other.example" }))).status, 403);
  assert.equal((await post(request(payload, { "Idempotency-Key": "bad" }))).status, 400);
  assert.equal((await post(request({ ...payload, notes: "x".repeat(20000) }))).status, 413);
  assert.equal(calls, 0);
});
test("server owns event ID and duration; full answers fit Cal metadata limits", async () => {
  const p = provider(), { post } = setup(p.fetch);
  const result = await (await post(request({ ...payload, eventTypeId: 999, hasWebsite: "no", website: undefined, notes: "a".repeat(1900) }))).json();
  assert.equal(result.booking.id, "provider-confirmation");
  assert.equal(result.booking.joinUrl, "https://app.cal.com/video/test-room");
  const body = p.writes[0];
  assert.equal(body.eventTypeId, Number(env.CAL_EVENT_TYPE_ID));
  assert.equal(body.attendee.email, "Visitor+call@example.com");
  assert.equal(body.attendee.timeZone, "Europe/Tirane");
  assert.equal("lengthInMinutes" in body, false);
  assert.equal(body.allowConflicts, false);
  assert.equal(body.allowBookingOutOfBounds, false);
  assert.equal(body.metadata.website, "");
  assert.equal([body.metadata.notes, body.metadata.notes_2, body.metadata.notes_3, body.metadata.notes_4].join(""), "a".repeat(1900));
  assert.ok(Object.values(body.metadata).every(value => value.length <= 500));
  assert.equal(JSON.stringify(result).includes(env.CAL_API_KEY), false);
});
test("double submits and retries across fresh server instances create one booking", async () => {
  const p = provider(), { post } = setup(p.fetch);
  const responses = await Promise.all([post(request()), post(request())]);
  assert.ok(responses.every(response => response.status === 200));
  assert.equal(p.writes.length, 1);
  assert.equal((await post(request())).status, 200);
  assert.equal((await setup(p.fetch).post(request())).status, 200);
  assert.equal(p.writes.length, 1);
});
test("uncertain response is recovered without another create request", async () => {
  const p = provider(); p.loseResponse = true;
  assert.equal((await setup(p.fetch).post(request())).status, 200);
  assert.equal(p.writes.length, 1);
});
test("occupied slot and Cal conflict races return SLOT_UNAVAILABLE", async () => {
  for (const field of ["occupied", "conflict"]) {
    const p = provider(); p[field] = true;
    const response = await setup(p.fetch).post(request());
    assert.equal(response.status, 409);
    assert.deepEqual(await response.json(), { success: false, code: "SLOT_UNAVAILABLE" });
    assert.equal(p.writes.length, 0);
  }
});
test("pending bookings and unsafe URLs cannot produce false confirmations", async () => {
  const p = provider(); p.pending = true;
  const { post, cal } = setup(p.fetch);
  assert.deepEqual(await (await post(request())).json(), { success: false, code: "BOOKING_PENDING" });
  for (const value of [undefined, "javascript:alert(1)", "http://example.com", "https://user:password@example.com", "https://example.com/" + env.CAL_API_KEY]) assert.equal(cal.safeMeetingUrl(value), undefined);
  assert.equal("joinUrl" in cal.normalizeConfirmation({ uid: "test", status: "accepted", start: future, end: finish }, payload), false);
});
