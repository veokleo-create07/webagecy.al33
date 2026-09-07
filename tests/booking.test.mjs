import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

// Exercise the real TypeScript module without another test/runtime dependency.
function load(file) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const exported = [];
  const compiled = stripTypeScriptTypes(source, { mode: "transform" })
    .replace(/^export (async )?(function|class|const) (\w+)/gm, (_, async, kind, name) => { exported.push(name); return `${async ?? ""}${kind} ${name}`; });
  const exports = {};
  const run = new Function("exports", `${compiled}\n${exported.map(name => `exports.${name} = ${name};`).join("\n")}`);
  run(exports);
  return exports;
}
const booking = load("lib/booking.ts");
const details = { ...booking.emptyDetails, fullName: "Test Visitor", email: " Visitor+call@EXAMPLE.com ", businessName: "Test Studio", hasWebsite: "yes", website: "example.com", investment: "€3,000–€5,000", notes: "", referralSource: "Instagram" };

test("all seven qualification steps accept valid data; project details are optional", () => {
  for (let step = 0; step < 7; step++) assert.equal(booking.validateStep(step, details), null);
  assert.equal(booking.normalizedEmail(details.email), "Visitor+call@example.com");
});
test("required fields, email addresses, investment and referral choices are validated", () => {
  for (const [step, patch] of [[0, { fullName: "" }], [1, { email: "" }], [2, { businessName: "" }], [3, { hasWebsite: "" }], [4, { investment: "project budget" }], [5, { notes: "a".repeat(2001) }], [6, { referralSource: "" }]]) assert.equal(typeof booking.validateStep(step, { ...details, ...patch }), "string");
});
test("email accepts aliases and subdomains but rejects malformed mailboxes", () => {
  for (const email of ["hello@example.com", "first.last+call@studio.example.co.uk", "o'neil@example.com"]) assert.equal(booking.validateStep(1, { ...details, email }), null);
  for (const email of ["", "   ", "name", "name@", "@example.com", "name@example", "name@@example.com", "first last@example.com", ".name@example.com", "name..last@example.com", "name.@example.com", "name@-example.com", "name@example-.com", "name@example..com", "name@example.com\r\nBcc:other@example.com", `${"a".repeat(65)}@example.com`, `name@${"a".repeat(64)}.com`]) assert.ok(booking.validateStep(1, { ...details, email }), email);
});
test("investment offers exactly four ranges and referral offers five sources", () => {
  assert.deepEqual(booking.investmentOptions, ["€1,500–€3,000", "€3,000–€5,000", "€5,000–€10,000", "€10,000+"]);
  for (const investment of booking.investmentOptions) assert.equal(booking.validateStep(4, { ...details, investment }), null);
  assert.equal(booking.validateStep(4, { ...details, investment: "Prefer not to say" }), "Choose an investment range.");
  assert.deepEqual(booking.referralOptions, ["Instagram", "TikTok", "LinkedIn", "Google referral", "Other"]);
  for (const referralSource of booking.referralOptions) assert.equal(booking.validateStep(6, { ...details, referralSource }), null);
});
test("website is required only for Yes; unsafe schemes and credentials fail", () => {
  assert.equal(booking.validateStep(3, { ...details, hasWebsite: "no", website: "" }), null);
  assert.ok(booking.validateStep(3, { ...details, website: "" }));
  assert.equal(booking.normalizedWebsite("example.com"), "https://example.com/");
  for (const url of ["javascript:alert(1)", "ftp://example.com", "https://user:secret@example.com", "no-domain"]) assert.equal(booking.normalizedWebsite(url), null);
});
