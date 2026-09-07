import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

function load(file) {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const exported = [];
  const compiled = stripTypeScriptTypes(source, { mode: "transform" })
    .replace(/^export (async )?(function|class|const) (\w+)/gm, (_, async, kind, name) => { exported.push(name); return `${async ?? ""}${kind} ${name}`; });
  const exports = {};
  new Function("exports", `${compiled}\n${exported.map(name => `exports.${name} = ${name};`).join("\n")}`)(exports);
  return exports;
}

const booking = load("lib/booking.ts");
const details = {
  ...booking.emptyDetails,
  fullName: "Test Visitor",
  businessName: "Test Studio",
  hasWebsite: "yes",
  website: "example.com",
  countryCode: "+383",
  whatsapp: "44 123 4567",
  investment: "€5,000–€10,000",
  notes: "",
};

test("all six lead-form steps accept valid data and project details are optional", () => {
  for (let step = 0; step < 6; step++) assert.equal(booking.validateStep(step, details), null);
});

test("name, business, website choice, WhatsApp and investment are validated", () => {
  const invalid = [
    [0, { fullName: "" }],
    [1, { businessName: "" }],
    [2, { hasWebsite: "" }],
    [3, { whatsapp: "123" }],
    [3, { countryCode: "+999" }],
    [4, { investment: "project budget" }],
    [5, { notes: "a".repeat(2001) }],
  ];
  for (const [step, patch] of invalid) assert.equal(typeof booking.validateStep(step, { ...details, ...patch }), "string");
});

test("the WhatsApp picker includes the requested prefixes", () => {
  assert.deepEqual(booking.whatsappCountries.map(country => country.code), ["+355", "+383", "+389", "+382", "+49", "+41", "+43", "+39", "+44", "+1"]);
});

test("investment offers exactly the requested four ranges", () => {
  assert.deepEqual(booking.investmentOptions, ["€2,000–€5,000", "€5,000–€10,000", "€10,000–€25,000", "€25,000+"]);
});

test("website is required only for Yes and unsafe addresses fail", () => {
  assert.equal(booking.validateStep(2, { ...details, hasWebsite: "no", website: "" }), null);
  assert.ok(booking.validateStep(2, { ...details, website: "" }));
  assert.equal(booking.normalizedWebsite("example.com"), "https://example.com/");
  for (const url of ["javascript:alert(1)", "ftp://example.com", "https://user:secret@example.com", "no-domain"]) assert.equal(booking.normalizedWebsite(url), null);
});
