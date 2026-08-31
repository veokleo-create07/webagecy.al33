"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BrandLogo } from "@/components/ui/brand-logo";
import { LanguageSwitcher, useLanguage } from "@/components/language-provider";
import { localizedDate } from "@/lib/localization";
import { emptyDetails, validateStep, type BookingDetails, type Confirmation, type Slot } from "@/lib/booking";
import { revenueOptions } from "@/lib/booking";
import { BookingCalendar } from "./booking-calendar";
import styles from "./booking.module.css";

const questions = [
  "What’s your full name?", "What’s your email address?", "What’s your business called?",
  "Do you currently have a website?", "What’s your current monthly business revenue?",
  "What should we know before the call?", "Choose a time that works.",
];

export default function BookingFlow({ open, opener, onClose }: { open: boolean; opener?: HTMLElement; onClose: () => void }) {
  const { t, locale, language } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const posting = useRef(false);
  const requestKey = useRef({ payload: "", key: "" });
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [details, setDetails] = useState<BookingDetails>({ ...emptyDetails });
  const [error, setError] = useState("");
  const timezone = "Europe/Tirane";
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [availability, setAvailability] = useState<"loading" | "ready" | "error" | "unconfigured">("loading");
  const [retry, setRetry] = useState(0);
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
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

  useEffect(() => {
    if (!open || step !== 6 || confirmation) return;
    let controller: AbortController | undefined;
    let loading = false;
    let lastAttempt = 0;
    const load = () => {
      if (loading || posting.current) return;
      const request = new AbortController();
      controller = request;
      loading = true;
      lastAttempt = Date.now();
      setAvailability("loading");
      fetch("/api/booking/slots", { signal: request.signal, cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (request.signal.aborted) return;
        if (data.code === "NOT_CONFIGURED") { setSlots([]); setSelected(null); setAvailability("unconfigured"); return; }
        if (!response.ok || !data.success || !Array.isArray(data.slots)) throw new Error("Availability unavailable");
        const available: Slot[] = data.slots
          .filter((slot: { start: string; end: string }) => Date.parse(slot.start) > Date.now() && Date.parse(slot.end) > Date.parse(slot.start))
          .map((slot: { start: string; end: string }) => ({ id: slot.start, startsAt: slot.start, endsAt: slot.end }))
          .sort((a: Slot, b: Slot) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
        setSlots(available);
        setSelected(previous => previous && available.some(slot => slot.id === previous.id) ? previous : null);
        setAvailability("ready");
      })
      .catch(() => {
        if (!request.signal.aborted) { setSlots([]); setSelected(null); setAvailability("error"); }
      })
      .finally(() => { loading = false; });
    };
    const refresh = () => {
      if (document.visibilityState === "visible" && Date.now() - lastAttempt > 2000) load();
    };
    load();
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller?.abort();
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [open, step, retry, timezone, confirmation]);

  function update<K extends keyof BookingDetails>(key: K, value: BookingDetails[K]) {
    setDetails(previous => ({ ...previous, [key]: value }));
    setError("");
  }

  function close() {
    if (posting.current) return;
    onClose();
    if (confirmation) {
      setConfirmation(null); setDetails({ ...emptyDetails }); setStep(0); setSelected(null);
      requestKey.current = { payload: "", key: "" };
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (posting.current) return;
    const invalid = validateStep(step, details);
    if (invalid) { setError(invalid); return; }
    if (step < 6) { setError(""); setDirection(1); setStep(step + 1); return; }
    if (availability !== "ready" || !selected) { setError("Choose an available date and time to book your call."); return; }
    const payload = JSON.stringify({ ...details, website: details.hasWebsite === "yes" ? details.website : "", start: selected.startsAt, timezone });
    if (requestKey.current.payload !== payload) requestKey.current = { payload, key: crypto.randomUUID() };
    posting.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/booking/create", {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current.key },
        body: payload, signal: AbortSignal.timeout(60000),
      });
      const data = await response.json();
      if (data.code === "SLOT_UNAVAILABLE") {
        setError("That time was just booked. Please choose another available time.");
        setRetry(value => value + 1);
        return;
      }
      if (data.code === "BOOKING_PENDING") {
        setError("Your request is awaiting confirmation. Please check your email before trying again.");
        return;
      }
      if (!response.ok || !data.success || data.status !== "confirmed" || !data.booking?.id) throw new Error("Not confirmed");
      setConfirmation(data.booking);
      setSelected(null);
    } catch {
      setError("We couldn’t confirm your booking. Please retry to check this request. If this continues, email hello@kreuweb.com.");
    } finally {
      posting.current = false;
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
        <header className={styles.header}>
          <div className={styles.brandGroup}><BrandLogo /><LanguageSwitcher /></div>
          <button className={styles.close} type="button" onClick={close} disabled={pending} aria-label={t("Close booking")}>
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
              <h1 id="booking-question" ref={headingRef} tabIndex={-1} className={styles.question}>{t(confirmation ? "You’re booked." : questions[step])}</h1>
              {confirmation ? <div className={styles.confirmation}>
                <p>{t("Your discovery call is confirmed. Check your email for the invitation.")}</p>
                <div className={styles.appointment}>
                  <span>{details.fullName.trim()} · {details.businessName.trim()}</span>
                  <span>{details.email.trim()}</span>
                  <span>{localizedDate(language, confirmation.startsAt, confirmation.timezone, "full")}</span>
                  <span>{new Intl.DateTimeFormat(locale, { timeStyle: "short", hourCycle: "h23", timeZone: confirmation.timezone }).format(new Date(confirmation.startsAt))}–{new Intl.DateTimeFormat(locale, { timeStyle: "short", hourCycle: "h23", timeZone: confirmation.timezone }).format(new Date(confirmation.endsAt))} · {confirmation.timezone.replaceAll("_", " ")}</span>
                </div>
                {!confirmation.joinUrl && <p>{t("The call link isn’t available yet. Check your invitation email or contact hello@kreuweb.com before the call.")}</p>}
                {confirmation.joinUrl ? <div className={styles.actions}>
                  <a className={styles.primary} href={confirmation.joinUrl} target="_blank" rel="noopener noreferrer">{t("Join call")} <ArrowIcon /></a>
                  <button type="button" className={styles.primary} onClick={close}>{t("Back to Kreu")} <ArrowIcon /></button>
                </div> : <button type="button" className={styles.primary} onClick={close}>{t("Back to Kreu")} <ArrowIcon /></button>}
              </div> : <form onSubmit={submit} noValidate aria-busy={pending}>
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
                  {step === 4 && <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>{t("Current monthly business revenue")}</legend>
                    {revenueOptions.map(value => <label key={value} className={styles.choice}><input type="radio" name="revenue" value={value} checked={details.revenue === value} onChange={() => update("revenue", value)} /><span>{t(value)}</span><i aria-hidden="true" /></label>)}
                  </fieldset>}
                  {step === 5 && <label className={styles.field}><span>{t("A little context")} <small>{t("Optional")}</small></span><textarea {...fieldProps} name="notes" rows={4} value={details.notes} onChange={e => update("notes", e.target.value)} maxLength={2000} placeholder={t("A few lines about the business, what’s changing, and what you want Kreu to help you achieve.")} /></label>}
                  {step === 6 && <>
                    <p className={styles.hint}>{t("Times shown in")} {timezone.replaceAll("_", " ")}.</p>
                    <BookingCalendar slots={slots} timezone={timezone} selected={selected} onSelect={setSelected} disabled={pending || availability !== "ready"} status={<>
                    {availability === "loading" && <p className={styles.hint} role="status">{t("Finding available times…")}</p>}
                    {(availability === "error" || availability === "unconfigured" || (availability === "ready" && slots.length === 0)) && <div className={styles.hint} role="status">
                      <p>{t(availability === "unconfigured" ? "Scheduling is temporarily unavailable." : availability === "error" ? "We couldn’t load available times." : "There are no open times in the next 60 days.")}</p>
                      <p>{t("Email")} <a href="mailto:hello@kreuweb.com">hello@kreuweb.com</a> {t("to arrange a call.")}{availability === "unconfigured" && ` ${t("Your details haven’t been sent.")}`}</p>
                      <button className={styles.back} type="button" onClick={() => setRetry(value => value + 1)}>{t("Check again")}</button>
                    </div>}
                    </>} />
                  </>}
                </div>
                {error && <p id="booking-error" className={styles.error} role="alert">{t(error)}</p>}
                <div className={styles.actions}>
                  {step > 0 && <button type="button" className={styles.back} disabled={pending} onClick={() => { setError(""); setDirection(-1); setStep(step - 1); }}>{t("Back")}</button>}
                  <button className={styles.primary} type="submit" disabled={pending || (step === 6 && (availability !== "ready" || !selected))}>
                    {t(pending ? "Confirming your call…" : step === 6 ? "Book discovery call" : "Continue")}<ArrowIcon direction={step === 6 ? "up-right" : "right"} />
                  </button>
                </div>
                <p className={styles.privacy}>{t(step === 6 ? "Your details are sent securely when you book. No mailing lists." : "A few details. A focused conversation.")}</p>
              </form>}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className={styles.footer}>{t("A considered start to something better.")}</footer>
      </div>
    </dialog>
  );
}
