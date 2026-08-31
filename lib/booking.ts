import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js/min";

export const revenueOptions = ["Under €10k", "€10k–€50k", "€50k–€100k", "€100k+", "Prefer not to say"] as const;
export type BookingDetails = {
  fullName: string;
  country: CountryCode;
  phone: string;
  businessName: string;
  hasWebsite: "yes" | "no" | "";
  website: string;
  revenue: string;
  notes: string;
};
export type Slot = { id: string; startsAt: string; endsAt: string };
export type Confirmation = { id: string; startsAt: string; endsAt: string; timezone: string };

export const emptyDetails: BookingDetails = {
  fullName: "", country: "AL", phone: "", businessName: "", hasWebsite: "", website: "", revenue: "", notes: "",
};

export function normalizedPhone(details: BookingDetails) {
  try {
    const phone = parsePhoneNumberFromString(details.phone, { defaultCountry: details.country, extract: false });
    return phone?.isValid() && !phone.ext ? phone.number : null;
  } catch { return null; }
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
  if (step === 1 && !normalizedPhone(details)) return "Enter a valid phone number, including the correct country code.";
  if (step === 2 && (details.businessName.trim().length < 2 || details.businessName.length > 160)) return "Please enter your business name.";
  if (step === 3) {
    if (!["yes", "no"].includes(details.hasWebsite)) return "Choose Yes or No to continue.";
    if (details.hasWebsite === "yes" && (!normalizedWebsite(details.website) || details.website.length > 2048)) return "Enter your website address, for example yourbusiness.com.";
  }
  if (step === 4 && !(revenueOptions as readonly string[]).includes(details.revenue)) return "Choose a revenue range, or Prefer not to say.";
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
