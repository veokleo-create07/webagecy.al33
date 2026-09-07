import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";

const source = readFileSync("lib/localization.ts", "utf8");
const { translate, albanian } = new Function(`${stripTypeScriptTypes(source).replace(/^export /gm, "")}\nreturn {translate, albanian};`)();

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
  for (const range of ["€2,000–€5,000", "€5,000–€10,000", "€10,000–€25,000", "€25,000+"]) assert.ok(Object.hasOwn(albanian, range));
  assert.deepEqual(
    ["€2,000–€5,000", "€5,000–€10,000", "€10,000–€25,000", "€25,000+"].map(range => translate("sq", range)),
    ["€2.000–€5.000", "€5.000–€10.000", "€10.000–€25.000", "€25.000+"],
  );
});

test("approved Albanian brand copy remains exact", () => {
  const approved = {
    "Build a business": "Ndërto një biznes",
    "people take seriously.": "që merret seriozisht.",
    "We position your business with clarity, credibility and authority so it is perceived at the level it aspires to.": "E pozicionojmë biznesin tuaj me qartësi, besueshmëri dhe autoritet që të perceptohet në nivelin që synon.",
    "View our work": "Shiko projektet",
    "Web Development": "Web Development",
    "Every decision should serve the business.": "Çdo vendim duhet t’i shërbejë biznesit.",
    "Authority. Differentiation. Growth.": "Autoritet. Diferencim. Rritje.",
    "For the next stage.": "Për etapën e radhës.",
    "Make your business stand out where it matters.": "Bëje biznesin tënd të dallohet aty ku ka rëndësi.",
    "Do you currently have a website?": "A keni aktualisht një website?",
    "What’s your WhatsApp number?": "Cili është numri juaj në WhatsApp?",
    "What investment range are you considering?": "Çfarë niveli investimi po konsideroni?",
    "Tell us briefly about your project.": "Na tregoni shkurt për projektin.",
    "Project details": "Rreth projektit",
    "Back": "Kthehu",
  };
  for (const [english, shqip] of Object.entries(approved)) assert.equal(translate("sq", english), shqip);
});

test("outcome-focused English and Albanian copy remains paired", () => {
  const approved = {
    "Integrated strategy, design and technology for clearer positioning, sharper differentiation and greater competitive relevance.": "Strategji, dizajn dhe teknologji të integruara për një pozicionim më të qartë, diferencim më të dallueshëm dhe relevancë më të lartë në treg.",
    "A considered digital presence designed to strengthen trust, increase relevance and create new opportunities for the business.": "Një prezencë digjitale e menduar për të forcuar besimin, për të rritur relevancën dhe për të krijuar mundësi të reja për biznesin.",
    "Design · Development · Growth · Software": "Dizajn · Zhvillim · Rritje · Software",
    "For businesses defined by ambition.": "Për biznese me ambicie.",
    "A few details. Then we talk about where your business can go next.": "Disa detaje. Pastaj flasim për hapin e radhës të biznesit tuaj.",
  };
  for (const [english, shqip] of Object.entries(approved)) {
    assert.equal(translate("en", english), english);
    assert.equal(translate("sq", english), shqip);
  }
});
