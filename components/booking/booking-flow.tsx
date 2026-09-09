"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { SmokeyBackground } from "@/components/ui/smokey-background";
import { LanguageSwitcher, useLanguage } from "@/components/language-provider";
import { emptyDetails, investmentOptions, whatsappCountries, validateStep, type BookingDetails } from "@/lib/booking";
import styles from "./booking.module.css";

const questions = [
  "What’s your name?", "What’s your business called?", "Do you currently have a website?",
  "What’s your WhatsApp number?", "What investment range are you considering?", "Tell us briefly about your project.",
];
export default function BookingFlow({ open, opener, onClose }: { open: boolean; opener?: HTMLElement; onClose: () => void }) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const submitting = useRef(false);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [details, setDetails] = useState<BookingDetails>({ ...emptyDetails });
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [pending, setPending] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    dialog.showModal();
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, opener]);

  function update<K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) {
    setDetails(previous => ({ ...previous, [key]: value }));
    setError("");
  }

  function close() {
    if (pending) return;
    onClose();
    if (confirmation) {
      setConfirmation(false); setDetails({ ...emptyDetails }); setStep(0);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const invalid = validateStep(step, details);
    if (invalid) { setError(invalid); return; }
    if (step < 5) { setError(""); setDirection(1); setStep(step + 1); return; }
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
        signal: AbortSignal.timeout(20_000),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error("Lead delivery failed");
      setConfirmation(true);
    } catch {
      setError("We couldn’t send your project request. Please try again.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  const fieldProps = { "aria-invalid": Boolean(error), "aria-describedby": error ? "booking-error" : undefined };
  const focusHeading = () => {
    headingRef.current?.focus({ preventScroll: true });
    dialogRef.current?.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="booking-question" onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
      <div className={styles.shell}>
        <SmokeyBackground />
        <header className={styles.header}>
          <div className={styles.brandGroup}><BrandLogo /><LanguageSwitcher /></div>
          <button className={styles.close} type="button" onClick={close} disabled={pending} aria-label={t("Close booking")}>
            <span>{t("Close")}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <div className={styles.workspace}>
          <main className={styles.main}>
            <div className={styles.invitation}>
              <span>{t(confirmation ? "Consultation received" : "Private consultation")}</span>
              {!confirmation && <h2>{t("Start something worth building.")}</h2>}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div className={styles.stepContent} key={confirmation ? "confirmed" : step} initial={reduced ? false : { opacity: 0, x: direction * 16 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 1 } : { opacity: 0, x: direction * -12 }} transition={{ duration: reduced ? 0 : .28, ease: [.22, 1, .36, 1] }} onAnimationComplete={focusHeading}>
              <h1 id="booking-question" ref={headingRef} tabIndex={-1} className={`${styles.question} ${confirmation ? styles.confirmationTitle : ""}`}>{t(confirmation ? "Thank you." : questions[step])}</h1>
              {confirmation ? <div className={styles.confirmation}>
                <div className={styles.confirmationMark} aria-hidden="true"><svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" /><path d="m16.5 24.5 5 5 10.5-12" /></svg></div>
                <p>{t("Thank you. We’ve received your project request.")}</p>
                <p>{t("Our team will review the information you submitted and we’ll contact you directly on WhatsApp to discuss the next steps.")}</p>
                <div className={styles.summary}>
                  <div><span>{t("Name")}</span><strong>{details.fullName.trim()}</strong></div>
                  <div><span>{t("Business name")}</span><strong>{details.businessName.trim()}</strong></div>
                  <div><span>{t("WhatsApp number")}</span><strong>{details.countryCode} {details.whatsapp.trim()}</strong></div>
                </div>
                <button type="button" className={styles.primary} onClick={close}>{t("Back to Kreu")} <ArrowIcon /></button>
              </div> : <form onSubmit={submit} noValidate aria-busy={pending}>
                <div className={styles.fields}>
                  {step === 0 && <label className={styles.field}><span>{t("Name")}</span><input {...fieldProps} name="fullName" autoComplete="name" value={details.fullName} onChange={e => update("fullName", e.target.value)} maxLength={120} placeholder={t("Your name")} required /></label>}
                  {step === 1 && <label className={styles.field}><span>{t("Business name")}</span><input {...fieldProps} name="businessName" autoComplete="organization" value={details.businessName} onChange={e => update("businessName", e.target.value)} maxLength={160} placeholder={t("Your business name")} required /></label>}
                  {step === 2 && <>
                    <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>{t("Do you currently have a website?")}</legend>
                      {(["yes", "no"] as const).map(value => <label key={value} className={styles.choice}><input type="radio" name="hasWebsite" value={value} checked={details.hasWebsite === value} onChange={() => update("hasWebsite", value)} /><span>{t(value === "yes" ? "Yes" : "No")}</span><i aria-hidden="true" /></label>)}
                    </fieldset>
                    {details.hasWebsite === "yes" && <label className={styles.field}><span>{t("Website URL")}</span><input {...fieldProps} name="website" type="url" autoComplete="url" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={details.website} onChange={e => update("website", e.target.value)} maxLength={2048} placeholder={t("yourbusiness.com")} required /></label>}
                  </>}
                  {step === 3 && <div className={styles.phone}>
                    <label className={styles.field}><span>{t("Country code")}</span><select {...fieldProps} name="countryCode" autoComplete="tel-country-code" value={details.countryCode} onChange={e => update("countryCode", e.target.value)}>{whatsappCountries.map(country => <option key={country.code} value={country.code}>{t(country.label)}</option>)}</select></label>
                    <label className={styles.field}><span>{t("WhatsApp number")}</span><input {...fieldProps} name="whatsapp" type="tel" inputMode="tel" autoComplete="tel-national" value={details.whatsapp} onChange={e => update("whatsapp", e.target.value.replace(/[^\d\s()\-]/g, ""))} maxLength={24} placeholder={t("Your WhatsApp number")} required /></label>
                  </div>}
                  {step === 4 && <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>{t("Investment range")}</legend>
                    {investmentOptions.map(value => <label key={value} className={styles.choice}><input type="radio" name="investment" value={value} checked={details.investment === value} onChange={() => update("investment", value)} /><span>{t(value)}</span><i aria-hidden="true" /></label>)}
                  </fieldset>}
                  {step === 5 && <label className={styles.field}><span>{t("Project details")} <small>{t("Optional")}</small></span><textarea {...fieldProps} name="notes" rows={4} value={details.notes} onChange={e => update("notes", e.target.value)} maxLength={2000} placeholder={t("What are you looking to build or improve?")} /></label>}
                </div>
                {error && <p id="booking-error" className={styles.error} role="alert">{t(error)}</p>}
                <div className={styles.actions}>
                  {step > 0 && <button type="button" className={styles.back} disabled={pending} onClick={() => { setError(""); setDirection(-1); setStep(step - 1); }}>{t("Back")}</button>}
                  <button className={styles.primary} type="submit" disabled={pending}>
                    {t(pending ? "Sending your request…" : step === 5 ? "Apply to Work With Us" : "Continue")}<ArrowIcon direction={step === 5 ? "up-right" : "right"} />
                  </button>
                </div>
              </form>}
            </motion.div>
          </AnimatePresence>
          </main>
        </div>
      </div>
    </dialog>
  );
}
