"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { emptyDetails, validateStep, type BookingDetails, type Confirmation, type Slot } from "@/lib/booking";
import { revenueOptions } from "@/lib/booking";
import { BookingCalendar } from "./booking-calendar";
import styles from "./booking.module.css";

const questions = [
  "What’s your full name?", "What’s the best number to reach you on?", "What’s your business called?",
  "Do you currently have a website?", "What’s your current monthly business revenue?",
  "What should we know before the call?", "Choose a time that works.",
];
const names = new Intl.DisplayNames(["en"], { type: "region" });
const countries = getCountries().sort((a, b) => (names.of(a) ?? a).localeCompare(names.of(b) ?? b));

export default function BookingFlow({ open, opener, onClose }: { open: boolean; opener?: HTMLElement; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const posting = useRef(false);
  const requestKey = useRef({ payload: "", key: "" });
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [details, setDetails] = useState<BookingDetails>({ ...emptyDetails });
  const [error, setError] = useState("");
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Tirane");
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
    const controller = new AbortController();
    setAvailability("loading");
    setSelected(null);
    fetch(`/api/booking/availability?timezone=${encodeURIComponent(timezone)}`, { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (data.code === "NOT_CONFIGURED") { setAvailability("unconfigured"); return; }
        if (!response.ok || !Array.isArray(data.slots)) throw new Error("Availability unavailable");
        setSlots(data.slots);
        setAvailability("ready");
      })
      .catch(() => { if (!controller.signal.aborted) setAvailability("error"); });
    return () => controller.abort();
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
    if (!selected) { setError("Choose an available date and time to book your call."); return; }
    const payload = JSON.stringify({ ...details, website: details.hasWebsite === "yes" ? details.website : "", slotId: selected.id, timezone });
    if (requestKey.current.payload !== payload) requestKey.current = { payload, key: crypto.randomUUID() };
    posting.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/booking", {
        method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": requestKey.current.key },
        body: payload, signal: AbortSignal.timeout(30000),
      });
      const data = await response.json();
      if (response.status === 409) {
        setError("That time was just booked. Please choose another available time.");
        setRetry(value => value + 1);
        return;
      }
      if (!response.ok || data.status !== "confirmed" || !data.booking?.id) throw new Error("Not confirmed");
      setConfirmation(data.booking);
      setDetails({ ...emptyDetails });
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
          <span className={styles.brand}>KREU WEB</span>
          <button className={styles.close} type="button" onClick={close} disabled={pending} aria-label="Close booking">
            <span>Close</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>

        <main className={styles.main}>
          <div className={styles.progressMeta}>
            <span>Discovery call</span>
            <span aria-live="polite">{confirmation ? "Confirmed" : `${step + 1} / 7`}</span>
          </div>
          <div className={styles.progress} role="progressbar" aria-label="Booking progress" aria-valuemin={0} aria-valuemax={7} aria-valuenow={confirmation ? 7 : step + 1}><span style={{ transform: `scaleX(${confirmation ? 1 : (step + 1) / 7})` }} /></div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={confirmation ? "confirmed" : step} initial={reduced ? false : { opacity: 0, x: direction * 14 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 1 } : { opacity: 0, x: direction * -10 }} transition={{ duration: reduced ? 0 : .22, ease: [.22, 1, .36, 1] }} onAnimationComplete={focusHeading}>
              <h1 id="booking-question" ref={headingRef} tabIndex={-1} className={styles.question}>{confirmation ? "You’re booked." : questions[step]}</h1>
              {confirmation ? <div className={styles.confirmation}>
                <p>We’ll reach out on WhatsApp if we need anything before the call.</p>
                <div className={styles.appointment}>
                  <span>{new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeZone: confirmation.timezone }).format(new Date(confirmation.startsAt))}</span>
                  <span>{new Intl.DateTimeFormat("en-GB", { timeStyle: "short", timeZone: confirmation.timezone }).format(new Date(confirmation.startsAt))} · {confirmation.timezone.replaceAll("_", " ")}</span>
                </div>
                <button type="button" className={styles.primary} onClick={close}>Back to Kreu <ArrowIcon /></button>
              </div> : <form onSubmit={submit} noValidate aria-busy={pending}>
                <div className={styles.fields}>
                  {step === 0 && <label className={styles.field}><span>Full name</span><input {...fieldProps} name="fullName" autoComplete="name" value={details.fullName} onChange={e => update("fullName", e.target.value)} maxLength={120} placeholder="Your full name" required /></label>}
                  {step === 1 && <div>
                    <div className={styles.phone}>
                      <label className={styles.field}><span>Country code</span><select aria-label="Country code" autoComplete="country" value={details.country} onChange={e => update("country", e.target.value as CountryCode)}>
                        {["AL", "XK"].map(code => <option key={code} value={code}>{names.of(code)} +{getCountryCallingCode(code as CountryCode)}</option>)}
                        {countries.filter(code => code !== "AL" && code !== "XK").map(code => <option key={code} value={code}>{names.of(code)} +{getCountryCallingCode(code)}</option>)}
                      </select></label>
                      <label className={styles.field}><span>Phone / WhatsApp</span><input {...fieldProps} name="phone" type="tel" inputMode="tel" autoComplete="tel-national" value={details.phone} onChange={e => update("phone", e.target.value)} placeholder="Your phone number" maxLength={40} required /></label>
                    </div>
                    <p className={styles.hint}>Use your local number, or paste the full international number.</p>
                  </div>}
                  {step === 2 && <label className={styles.field}><span>Business name</span><input {...fieldProps} name="businessName" autoComplete="organization" value={details.businessName} onChange={e => update("businessName", e.target.value)} maxLength={160} placeholder="Your business name" required /></label>}
                  {step === 3 && <>
                    <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>Do you currently have a website?</legend>
                      {(["yes", "no"] as const).map(value => <label key={value} className={styles.choice}><input type="radio" name="hasWebsite" value={value} checked={details.hasWebsite === value} onChange={() => update("hasWebsite", value)} /><span>{value === "yes" ? "Yes" : "No"}</span><i aria-hidden="true" /></label>)}
                    </fieldset>
                    {details.hasWebsite === "yes" && <label className={styles.field}><span>Website URL</span><input {...fieldProps} name="website" type="url" autoComplete="url" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} value={details.website} onChange={e => update("website", e.target.value)} maxLength={2048} placeholder="yourbusiness.com" required /></label>}
                  </>}
                  {step === 4 && <fieldset className={styles.choices} aria-describedby={fieldProps["aria-describedby"]}><legend className={styles.srOnly}>Current monthly business revenue</legend>
                    {revenueOptions.map(value => <label key={value} className={styles.choice}><input type="radio" name="revenue" value={value} checked={details.revenue === value} onChange={() => update("revenue", value)} /><span>{value}</span><i aria-hidden="true" /></label>)}
                  </fieldset>}
                  {step === 5 && <label className={styles.field}><span>A little context <small>Optional</small></span><textarea {...fieldProps} name="notes" rows={4} value={details.notes} onChange={e => update("notes", e.target.value)} maxLength={2000} placeholder="A few lines about the business, what’s changing, and what you want the website to help you achieve." /></label>}
                  {step === 6 && <>
                    <p className={styles.hint}>Times shown in {timezone.replaceAll("_", " ")}.</p>
                    {availability === "loading" && <p className={styles.calendarStatus} role="status">Finding available times…</p>}
                    {availability === "ready" && slots.length > 0 && <BookingCalendar slots={slots} timezone={timezone} selected={selected} onSelect={setSelected} disabled={pending} />}
                    {(availability === "error" || availability === "unconfigured" || (availability === "ready" && slots.length === 0)) && <div className={styles.calendarStatus} role="status">
                      <p>{availability === "unconfigured" ? "Online scheduling isn’t connected yet." : availability === "error" ? "We couldn’t load the calendar." : "There are no open times in the next 60 days."}</p>
                      <p>Email <a href="mailto:hello@kreuweb.com">hello@kreuweb.com</a> to arrange a call.{availability === "unconfigured" && " Your details haven’t been sent."}</p>
                      <button className={styles.back} type="button" onClick={() => setRetry(value => value + 1)}>Check again</button>
                    </div>}
                  </>}
                </div>
                {error && <p id="booking-error" className={styles.error} role="alert">{error}</p>}
                <div className={styles.actions}>
                  {step > 0 && <button type="button" className={styles.back} disabled={pending} onClick={() => { setError(""); setDirection(-1); setStep(step - 1); }}>Back</button>}
                  <button className={styles.primary} type="submit" disabled={pending || (step === 6 && (availability !== "ready" || !selected))}>
                    {pending ? "Confirming your call…" : step === 6 ? "Book discovery call" : "Continue"}<ArrowIcon direction={step === 6 ? "up-right" : "right"} />
                  </button>
                </div>
                <p className={styles.privacy}>{step === 6 ? "Your details are sent securely when you book. No mailing lists." : "A few details. A focused conversation."}</p>
              </form>}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className={styles.footer}>A considered start to something better.</footer>
      </div>
    </dialog>
  );
}
