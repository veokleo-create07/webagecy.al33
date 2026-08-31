export const revenueOptions = ["Under €10k", "€10k–€50k", "€50k–€100k", "€100k+"] as const;
export type BookingDetails = {
  fullName: string;
  email: string;
  businessName: string;
  hasWebsite: "yes" | "no" | "";
  website: string;
  revenue: string;
  notes: string;
};
export type Slot = { id: string; startsAt: string; endsAt: string };
export type Confirmation = { id: string; startsAt: string; endsAt: string; timezone: string; joinUrl?: string };

export const emptyDetails: BookingDetails = {
  fullName: "", email: "", businessName: "", hasWebsite: "", website: "", revenue: "", notes: "",
};

/** Validate an ordinary mailbox address; preserve local-part case and aliases. */
export function normalizedEmail(value: string): string | null {
  const email = value.trim();
  if (email.length > 254) return null;
  const parts = email.split("@");
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || local.length > 64 || !/^[a-z\d.!#$%&'*+/=?^_`{|}~-]+$/i.test(local) || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
  const labels = domain.split(".");
  if (labels.length < 2 || labels.some(label => !/^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/i.test(label)) || !/^[a-z]{2,63}$/i.test(labels.at(-1)!)) return null;
  return `${local}@${domain.toLowerCase()}`;
}

export function normalizedWebsite(value: string) {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

export function validateStep(step: number, details: BookingDetails): string | null {
  if (step === 0 && (details.fullName.trim().length < 2 || details.fullName.length > 120)) return "Please enter your full name.";
  if (step === 1 && !normalizedEmail(details.email)) return "Please enter a valid email address.";
  if (step === 2 && (details.businessName.trim().length < 2 || details.businessName.length > 160)) return "Please enter your business name.";
  if (step === 3) {
    if (!["yes", "no"].includes(details.hasWebsite)) return "Choose Yes or No to continue.";
    if (details.hasWebsite === "yes" && (!normalizedWebsite(details.website) || details.website.length > 2048)) return "Enter your website address, for example yourbusiness.com.";
  }
  if (step === 4 && !(revenueOptions as readonly string[]).includes(details.revenue)) return "Choose a revenue range.";
  if (step === 5 && details.notes.length > 2000) return "Please keep your notes under 2,000 characters.";
  return null;
}

export function validTimezone(value: string) {
  try { new Intl.DateTimeFormat("en", { timeZone: value }).format(); return true; } catch { return false; }
}

/** Calendar keys must follow the visitor's timezone, not the server's day. */
export function dayKey(date: Date | string, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(date));
  const part = (name: string) => parts.find(item => item.type === name)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
