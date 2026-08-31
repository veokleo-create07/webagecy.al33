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
    .replace(/^import \{([\s\S]*?)\} from ["']([^"']+)["'];/gm, (_, bindings, name) => `const {${bindings.replace(/\bas\b/g, ":")}} = require(${JSON.stringify(name)});`)
    .replace(/^export (async )?(function|class|const) (\w+)/gm, (_, async, kind, name) => { exported.push(name); return `${async ?? ""}${kind} ${name}`; });
  const exports = {};
  // Keep library option objects in the same realm; isolate only imports and environment.
  const run = new Function("exports", "require", "process", "fetch", `${compiled}\n${exported.map(name => `exports.${name} = ${name};`).join("\n")}`);
  run(exports, name => dependencies[name] ?? require(name), { env: {} }, globals.fetch ?? fetch);
  return exports;
}
const booking = load("lib/booking.ts");
const gateway = load("lib/booking-gateway.server.ts");
const details = { ...booking.emptyDetails, fullName: "Test Visitor", country: "AL", phone: "0691234567", businessName: "Test Studio", hasWebsite: "yes", website: "example.com", revenue: "Prefer not to say", notes: "" };
const payload = { ...details, slotId: "slot-a", timezone: "Europe/Tirane" };
const key = "12345678-1234-4123-8123-123456789012";
const future = new Date(Date.now() + 86400000).toISOString();
const finish = new Date(Date.now() + 86400000 + 1800000).toISOString();
function request(data = payload, headers = {}) {
  return new Request("https://kreu.example/api/booking", { method: "POST", headers: { Origin: "https://kreu.example", "Content-Type": "application/json", "Idempotency-Key": key, ...headers }, body: JSON.stringify(data) });
}
function postWith(fn = gateway.bookingGateway) {
  return load("app/api/booking/route.ts", { "@/lib/booking": booking, "@/lib/booking-gateway.server": { ...gateway, bookingGateway: fn } }).POST;
}

test("all six qualification steps accept valid data; notes are optional", () => {
  for (let step = 0; step < 6; step++) assert.equal(booking.validateStep(step, details), null);
  assert.equal(booking.normalizedPhone(details), "+355691234567");
  assert.equal(booking.normalizedPhone({ ...details, country: "XK", phone: "+38344123456" }), "+38344123456");
});
test("required fields, international phones and revenue choices are validated", () => {
  for (const [step, patch] of [[0, { fullName: "" }], [1, { phone: "123" }], [2, { businessName: "" }], [3, { hasWebsite: "" }], [4, { revenue: "project budget" }], [5, { notes: "a".repeat(2001) }]]) assert.equal(typeof booking.validateStep(step, { ...details, ...patch }), "string");
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
test("missing integration never manufactures slots or confirms a booking", async () => {
  const get = load("app/api/booking/availability/route.ts", { "@/lib/booking": booking, "@/lib/booking-gateway.server": gateway }).GET;
  for (const response of [await get(new Request("https://kreu.example/api/booking/availability")), await postWith()(request())]) {
    assert.equal(response.status, 503);
    assert.equal((await response.json()).code, "NOT_CONFIGURED");
  }
});
test("availability drops expired, duplicate and malformed slots", async () => {
  const get = load("app/api/booking/availability/route.ts", { "@/lib/booking": booking, "@/lib/booking-gateway.server": { ...gateway, bookingGateway: async () => ({ slots: [
    { id: "good", startsAt: future, endsAt: finish }, { id: "good", startsAt: future, endsAt: finish },
    { id: "past", startsAt: "2000-01-01T09:00:00Z", endsAt: "2000-01-01T10:00:00Z" },
    { id: "naive", startsAt: future.slice(0, -1), endsAt: finish.slice(0, -1) }, { id: "broken" },
  ] }) } }).GET;
  const response = await get(new Request("https://kreu.example/api/booking/availability?timezone=Europe/Tirane"));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).slots.length, 1);
  assert.equal(response.headers.get("cache-control"), "no-store");
});
test("server rejects foreign origins, invalid payloads and oversized bodies", async () => {
  let calls = 0;
  const post = postWith(async () => { calls++; });
  assert.equal((await post(request(payload, { Origin: "https://elsewhere.example" }))).status, 403);
  assert.equal((await post(request(payload, { "Idempotency-Key": "bad" }))).status, 400);
  assert.equal((await post(request({ ...payload, phone: "bad" }))).status, 400);
  assert.equal((await post(request({ ...payload, notes: "x".repeat(20000) }))).status, 413);
  assert.equal(calls, 0);
});
test("confirmed bookings forward normalized data and the unchanged retry key", async () => {
  const calls = [];
  const post = postWith(async (path, init) => {
    calls.push({ path, key: init.headers["Idempotency-Key"], body: JSON.parse(init.body) });
    return { status: "confirmed", booking: { id: "confirmed-test", startsAt: future, endsAt: finish } };
  });
  for (let attempt = 0; attempt < 2; attempt++) {
    const response = await post(request());
    assert.equal(response.status, 200);
    assert.equal((await response.json()).booking.id, "confirmed-test");
  }
  assert.equal(calls[0].key, key);
  assert.equal(calls[1].key, key);
  assert.equal(calls[0].body.phone, "+355691234567");
  assert.equal(calls[0].body.website, "https://example.com/");
  assert.equal("email" in calls[0].body, false);
});
test("a slot conflict or pending acknowledgement cannot show confirmation", async () => {
  const conflict = postWith(async () => { throw new gateway.BookingGatewayError("CONFLICT", 409); });
  assert.equal((await conflict(request())).status, 409);
  const pending = postWith(async () => ({ status: "pending", booking: { id: "pending" } }));
  assert.equal((await pending(request())).status, 502);
});
