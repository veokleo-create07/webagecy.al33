export const investmentOptions = ["€1,500–€3,000", "€3,000–€5,000", "€5,000–€10,000", "€10,000+"] as const;
export const referralOptions = ["Instagram", "TikTok", "LinkedIn", "Google referral", "Other"] as const;
export type BookingDetails = {
  fullName: string;
  email: string;
  businessName: string;
  hasWebsite: "yes" | "no" | "";
  website: string;
  investment: string;
  notes: string;
  referralSource: string;
};
export const emptyDetails: BookingDetails = {
  fullName: "", email: "", businessName: "", hasWebsite: "", website: "", investment: "", notes: "", referralSource: "",
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
  if (step === 4 && !(investmentOptions as readonly string[]).includes(details.investment)) return "Choose an investment range.";
  if (step === 5 && details.notes.length > 2000) return "Please keep your notes under 2,000 characters.";
  if (step === 6 && !(referralOptions as readonly string[]).includes(details.referralSource)) return "Choose how you heard about us.";
  return null;
}
