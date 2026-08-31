import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const source = readFileSync("lib/localization.ts", "utf8");
const { translate, albanian, localizedDate, calendarWeekdays } = new Function(`${stripTypeScriptTypes(source).replace(/^export /gm, "")}\nreturn {translate, albanian, localizedDate, calendarWeekdays};`)();

test("every translation has an English fallback and nonempty Albanian copy", () => {
  for (const [english, shqip] of Object.entries(albanian)) {
    assert.ok(shqip.trim(), english);
    assert.equal(translate("en", english), english);
    assert.equal(translate("sq", english), shqip);
  }
  assert.equal(translate("sq", "Park & Stone"), "Park & Stone");
  assert.equal(translate("sq", "Still"), "Still");
  assert.equal(translate("sq", "hello@kreuweb.com"), "hello@kreuweb.com");
});

test("all explicit UI translation keys and validation messages are covered", () => {
  function inspect(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = `${directory}/${entry.name}`;
      if (entry.isDirectory()) inspect(path);
      else if (path.endsWith(".tsx")) {
        for (const match of readFileSync(path, "utf8").matchAll(/\bt\("([^"]+)"\)/g)) {
          assert.ok(Object.hasOwn(albanian, match[1]), `${path}: ${match[1]}`);
        }
      }
    }
  }
  inspect("components"); inspect("app");
  const validation = readFileSync("lib/booking.ts", "utf8");
  for (const match of validation.matchAll(/return "([^"]+)"/g)) assert.ok(Object.hasOwn(albanian, match[1]), match[1]);
});

test("conversion copy is consistent without changing booking revenue values", () => {
  assert.equal(translate("sq", "Book a discovery call"), "Rezervo një konsultë");
  assert.equal(translate("sq", "Book discovery call"), "Rezervo një konsultë");
  assert.equal(translate("sq", "Book a consultation"), "Rezervo një konsultë");
  for (const range of ["Under €10k", "€10k–€50k", "€50k–€100k", "€100k+"]) assert.ok(Object.hasOwn(albanian, range));
  assert.deepEqual(
    ["Under €10k", "€10k–€50k", "€50k–€100k", "€100k+"].map(range => translate("sq", range)),
    ["Nën €10.000", "€10.000–€50.000", "€50.000–€100.000", "€100.000+"],
  );
});

test("Albanian calendar formatting localizes dates without changing timezone", () => {
  const date = new Date("2026-09-01T07:00:00Z");
  assert.equal(localizedDate("sq", date, "Europe/Tirane", "month"), "Shtator 2026");
  assert.equal(localizedDate("sq", date, "Europe/Tirane", "full"), "E martë, 1 shtator 2026");
  assert.equal(localizedDate("sq", "2026-08-31T22:30:00Z", "Europe/Tirane", "day"), "E martë, 1 shtator");
  assert.deepEqual(calendarWeekdays("sq"), ["H", "M", "M", "E", "P", "S", "D"]);
  assert.equal(new Intl.DateTimeFormat("sq-AL", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Tirane" }).format(date), "09:00");
});
