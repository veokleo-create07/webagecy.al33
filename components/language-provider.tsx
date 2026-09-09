"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { languageCookie, translate, type Language } from "@/lib/localization";
import styles from "./language-switcher.module.css";

const LanguageContext = createContext({ language: "sq" as Language, setLanguage: (_language: Language) => {} });

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage: Language }) {
  const [language, setLanguage] = useState(initialLanguage);
  useEffect(() => {
    const title = translate(language, "Kreu Web — Strategy, Design & Digital Development");
    const description = translate(language, "Kreu Web helps ambitious businesses build credible brands, high-performing websites, effective marketing and scalable digital products.");
    document.documentElement.lang = language;
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", description);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", description);
    // Text reflow changes section bounds; retain the existing scroll animations.
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage: next => {
    document.cookie = `${languageCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    setLanguage(next);
  } }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return { ...context, locale: context.language === "sq" ? "sq-AL" : "en-GB", t: (message: string) => translate(context.language, message) };
}

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  return <div className={styles.switcher} role="group" aria-label={t("Language")}>
    <button type="button" lang="sq" aria-label="Shqip" aria-pressed={language === "sq"} onClick={() => setLanguage("sq")}>AL</button>
    <span aria-hidden="true">/</span>
    <button type="button" lang="en" aria-label="English" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
  </div>;
}
