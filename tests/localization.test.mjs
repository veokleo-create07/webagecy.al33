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

test("conversion copy and investment values remain consistently localized", () => {
  assert.equal(translate("sq", "Book a discovery call"), "Rezervo një konsultë");
  assert.equal(translate("sq", "Book discovery call"), "Rezervo konsultën");
  assert.equal(translate("sq", "Book a consultation"), "Rezervo një konsultë");
  for (const range of ["€1,500–€3,000", "€3,000–€5,000", "€5,000–€10,000", "€10,000+"]) assert.ok(Object.hasOwn(albanian, range));
  assert.deepEqual(
    ["€1,500–€3,000", "€3,000–€5,000", "€5,000–€10,000", "€10,000+"].map(range => translate("sq", range)),
    ["€1.500–€3.000", "€3.000–€5.000", "€5.000–€10.000", "€10.000+"],
  );
});

test("approved Albanian brand copy remains exact", () => {
  const approved = {
    "Build a business": "Ndërto një biznes",
    "people take seriously.": "që merret seriozisht.",
    "We articulate your business with greater clarity, authority and credibility. It is perceived at the level it deserves.": "E artikulojmë biznesin tuaj me më shumë qartësi, autoritet dhe besueshmëri. Kështu perceptohet në nivelin që meriton.",
    "View our work": "Shiko projektet",
    "Web Development": "Web Development",
    "Every decision should serve the business.": "Çdo vendim duhet t’i shërbejë biznesit.",
    "Authority. Differentiation. Growth.": "Autoritet. Diferencim. Rritje.",
    "For the next stage.": "Për etapën e radhës.",
    "Make your business harder to ignore.": "Bëje biznesin tënd të pamundur për t’u anashkaluar.",
    "Do you currently have a website?": "A keni aktualisht një website?",
    "What is your estimated investment?": "Sa planifikoni të investoni?",
    "Tell us about your project. What do you want to achieve?": "Na tregoni për projektin. Çfarë dëshironi të arrini?",
    "How did you hear about us?": "Si dëgjuat për ne?",
    "Project details": "Rreth projektit",
    "Book discovery call": "Rezervo konsultën",
    "Back": "Kthehu",
    "You’re booked.": "Konsulta u rezervua.",
    "Join call": "Bashkohu në takim",
  };
  for (const [english, shqip] of Object.entries(approved)) assert.equal(translate("sq", english), shqip);
});

test("outcome-focused English and Albanian copy remains paired", () => {
  const approved = {
    "Integrated strategy, design and technology for clearer positioning, sharper differentiation and greater competitive relevance.": "Strategji, dizajn dhe teknologji të integruara për një pozicionim më të qartë, diferencim më të dallueshëm dhe relevancë më të lartë në treg.",
    "A considered digital presence designed to consolidate trust, increase relevance and open new opportunities for the business.": "Një prezencë digjitale e menduar për të konsoliduar besimin, për të rritur relevancën dhe për të hapur mundësi të reja për biznesin.",
    "Design · Development · Growth · Software": "Dizajn · Zhvillim · Rritje · Software",
    "For businesses defined by ambition.": "Për biznese me ambicie.",
    "A few details. Then we talk about where your business can go next.": "Disa detaje. Pastaj flasim për hapin e radhës të biznesit tuaj.",
  };
  for (const [english, shqip] of Object.entries(approved)) {
    assert.equal(translate("en", english), english);
    assert.equal(translate("sq", english), shqip);
  }
});

test("Albanian calendar formatting localizes dates without changing timezone", () => {
  const date = new Date("2026-09-01T07:00:00Z");
  assert.equal(localizedDate("sq", date, "Europe/Tirane", "month"), "Shtator 2026");
  assert.equal(localizedDate("sq", date, "Europe/Tirane", "full"), "E martë, 1 shtator 2026");
  assert.equal(localizedDate("sq", "2026-08-31T22:30:00Z", "Europe/Tirane", "day"), "E martë, 1 shtator");
  assert.deepEqual(calendarWeekdays("sq"), ["H", "M", "M", "E", "P", "S", "D"]);
  assert.equal(new Intl.DateTimeFormat("sq-AL", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Tirane" }).format(date), "09:00");
});
