export const investmentOptions = ["€2,000–€5,000", "€5,000–€10,000", "€10,000–€25,000", "€25,000+"] as const;
export const whatsappCountries = [
  { code: "+355", label: "🇦🇱 Albania +355" },
  { code: "+383", label: "🇽🇰 Kosovo +383" },
  { code: "+389", label: "🇲🇰 North Macedonia +389" },
  { code: "+382", label: "🇲🇪 Montenegro +382" },
  { code: "+49", label: "🇩🇪 Germany +49" },
  { code: "+41", label: "🇨🇭 Switzerland +41" },
  { code: "+43", label: "🇦🇹 Austria +43" },
  { code: "+39", label: "🇮🇹 Italy +39" },
  { code: "+44", label: "🇬🇧 United Kingdom +44" },
  { code: "+1", label: "🇺🇸 United States +1" },
] as const;
export type BookingDetails = {
  fullName: string;
  businessName: string;
  hasWebsite: "yes" | "no" | "";
  website: string;
  countryCode: string;
  whatsapp: string;
  investment: string;
  notes: string;
};
export const emptyDetails: BookingDetails = {
  fullName: "", businessName: "", hasWebsite: "", website: "", countryCode: "+355", whatsapp: "", investment: "", notes: "",
};

export function normalizedWebsite(value: string) {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
    if (!["https:", "http:"].includes(url.protocol) || !url.hostname.includes(".") || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}

export function validateStep(step: number, details: BookingDetails): string | null {
  if (step === 0 && (details.fullName.trim().length < 2 || details.fullName.length > 120)) return "Please enter your name.";
  if (step === 1 && (details.businessName.trim().length < 2 || details.businessName.length > 160)) return "Please enter your business name.";
  if (step === 2) {
    if (!["yes", "no"].includes(details.hasWebsite)) return "Choose Yes or No to continue.";
    if (details.hasWebsite === "yes" && (!normalizedWebsite(details.website) || details.website.length > 2048)) return "Enter your website address, for example yourbusiness.com.";
  }
  if (step === 3) {
    const digits = details.whatsapp.replace(/\D/g, "");
    if (!(whatsappCountries as readonly { code: string }[]).some(country => country.code === details.countryCode) || digits.length < 6 || digits.length > 15) return "Please enter a valid WhatsApp number.";
  }
  if (step === 4 && !(investmentOptions as readonly string[]).includes(details.investment)) return "Choose an investment range.";
  if (step === 5 && details.notes.length > 2000) return "Please keep your notes under 2,000 characters.";
  return null;
}
