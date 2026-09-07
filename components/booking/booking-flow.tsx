"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageSwitcher, useLanguage } from "@/components/language-provider";
import { emptyDetails, investmentOptions, referralOptions, validateStep, type BookingDetails } from "@/lib/booking";
import styles from "./booking.module.css";

const questions = [
  "What’s your full name?", "What’s your email address?", "What’s your business called?",
  "Do you currently have a website?", "What is your estimated investment?",
  "Tell us about your project. What do you want to achieve?", "How did you hear about us?",
];

export default function BookingFlow({ open, opener, onClose }: { open: boolean; opener?: HTMLElement; onClose: () => void }) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [details, setDetails] = useState<BookingDetails>({ ...emptyDetails });
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState(false);
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
    onClose();
    if (confirmation) {
      setConfirmation(false); setDetails({ ...emptyDetails }); setStep(0);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invalid = validateStep(step, details);
    if (invalid) { setError(invalid); return; }
    if (step < 6) { setError(""); setDirection(1); setStep(step + 1); return; }
    setError("");
    setConfirmation(true);
  }

  const fieldProps = { "aria-invalid": Boolean(error), "aria-describedby": error ? "booking-error" : undefined };
  const focusHeading = () => {
    headingRef.current?.focus({ preventScroll: true });
    dialogRef.current?.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="booking-question" onCancel={event => { event.preventDefault(); close(); }} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); close(); } }}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brandGroup}><BrandLogo /><LanguageSwitcher /></div>
          <button className={styles.close} type="button" onClick={close} aria-label={t("Close booking")}>
            <span>{t("Close")}</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <main className={styles.main}>
          <div className={styles.progressMeta}>
            <span>{t("Discovery call")}</span>
            <span aria-live="polite">{confirmation ? t("Confirmed") : `${step + 1} / 7`}</span>
          </div>
          <div className={styles.progress} role="progressbar" aria-label={t("Booking progress")} aria-valuemin={0} aria-valuemax={7} aria-valuenow={confirmation ? 7 : step + 1}><span style={{ transform: `scaleX(${confirmation ? 1 : (step + 1) / 7})` }} /></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={confirmation ? "confirmed" : step} initial={reduced ? false : { opacity: 0, x: direction * 14 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 1 } : { opacity: 0, x: direction * -10 }} transition={{ duration: reduced ? 0 : .22, ease: [.22, 1, .36, 1] }} onAnimationComplete={focusHeading}>
              <h1 id="booking-question" ref={headingRef} tabIndex={-1} className={styles.question}>{t(confirmation ? "Thank you." : questions[step])}</h1>
              {confirmation ? <div className={styles.confirmation}>
                <p>{t("We’ll review your details and be in touch by email.")}</p>
                <div className={styles.appointment}>
                  <span>{details.fullName.trim()} · {details.businessName.trim()}</span>
                  <span>{details.email.trim()}</span>
                </div>
                <button type="button" className={styles.primary} onClick={close}>{t("Back to Kreu")} <ArrowIcon /></button>
              </div> : <form onSubmit={submit} noValidate>
                <div className={styles.fields}>
                  {step === 0 && <label className={styles.field}><span>{t("Full name")}</span><input {...fieldProps} name="fullName" autoComplete="name" value={details.fullName} onChange={e => update("fullName", e.target.value)} maxLength={120} placeholder={t("Your full name")} required /></label>}
                  {step === 1 && <label className={styles.field}><span>{t("Email address")}</span><input {...fieldProps} name="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={details.email} onChange={e => update("email", e.target.value)} placeholder={t("you@business.com")} maxLength={254} required /></label>}
                  {step === 2 && <label className={styles.field}><span>{t("Business name")}</span><input {...fieldProps} name="businessName" autoComplete="organization" value={details.businessName} onChange={e => update("businessName", e.target.value)} maxLength={160} placeholder={t("Your business name")} required /></label>}
                  {step === 3 && <>
                    <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>{t("Do you currently have a website?")}</legend>
                      {(["yes", "no"] as const).map(value => <label key={value} className={styles.choice}><input type="radio" name="hasWebsite" value={value} checked={details.hasWebsite === value} onChange={() => update("hasWebsite", value)} /><span>{t(value === "yes" ? "Yes" : "No")}</span><i aria-hidden="true" /></label>)}
                    </fieldset>
                    {details.hasWebsite === "yes" && <label className={styles.field}><span>{t("Website URL")}</span><input {...fieldProps} name="website" type="url" autoComplete="url" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={details.website} onChange={e => update("website", e.target.value)} maxLength={2048} placeholder={t("yourbusiness.com")} required /></label>}
                  </>}
                  {step === 4 && <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>{t("Estimated investment")}</legend>
                    {investmentOptions.map(value => <label key={value} className={styles.choice}><input type="radio" name="investment" value={value} checked={details.investment === value} onChange={() => update("investment", value)} /><span>{t(value)}</span><i aria-hidden="true" /></label>)}
                  </fieldset>}
                  {step === 5 && <label className={styles.field}><span>{t("Project details")} <small>{t("Optional")}</small></span><textarea {...fieldProps} name="notes" rows={4} value={details.notes} onChange={e => update("notes", e.target.value)} maxLength={2000} placeholder={t("A few lines about the project, your goals, and what you want Kreu to help you achieve.")} /></label>}
                  {step === 6 && <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>{t("How did you hear about us?")}</legend>
                    {referralOptions.map(value => <label key={value} className={styles.choice}><input type="radio" name="referralSource" value={value} checked={details.referralSource === value} onChange={() => update("referralSource", value)} /><span>{t(value)}</span><i aria-hidden="true" /></label>)}
                  </fieldset>}
                </div>
                {error && <p id="booking-error" className={styles.error} role="alert">{t(error)}</p>}
                <div className={styles.actions}>
                  {step > 0 && <button type="button" className={styles.back} onClick={() => { setError(""); setDirection(-1); setStep(step - 1); }}>{t("Back")}</button>}
                  <button className={styles.primary} type="submit">
                    {t(step === 6 ? "Send enquiry" : "Continue")}<ArrowIcon direction={step === 6 ? "up-right" : "right"} />
                  </button>
                </div>
                <p className={styles.privacy}>{t(step === 6 ? "We’ll review your details and reply by email." : "A few details. Then we talk about where your business can go next.")}</p>
              </form>}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className={styles.footer}>{t("A considered start to something better.")}</footer>
      </div>
    </dialog>
  );
}
