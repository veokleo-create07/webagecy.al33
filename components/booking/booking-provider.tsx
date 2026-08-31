"use client";

import { createContext, useContext, useState, type ComponentPropsWithRef, type ReactNode } from "react";
import dynamic from "next/dynamic";
import styles from "./booking.module.css";
import { useLanguage } from "@/components/language-provider";

function BookingLoading() {
  const { t } = useLanguage();
  return <div className={styles.loading} role="status">{t("Opening booking…")}</div>;
}

const BookingFlow = dynamic(() => import("./booking-flow"), {
  ssr: false,
  loading: BookingLoading,
});
const BookingContext = createContext<((opener?: HTMLElement) => void) | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [opener, setOpener] = useState<HTMLElement>();
  return (
    <BookingContext.Provider value={element => { setOpener(element); setLoaded(true); setOpened(true); }}>
      {children}
      {loaded && <BookingFlow open={opened} opener={opener} onClose={() => setOpened(false)} />}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const open = useContext(BookingContext);
  if (!open) throw new Error("Booking controls must be inside BookingProvider.");
  return open;
}

/** An anchor preserves every existing CTA's appearance and focus behavior. */
export function BookingLink({ onClick, ...props }: ComponentPropsWithRef<"a">) {
  const open = useBooking();
  return <a {...props} href="#book-a-call" aria-haspopup="dialog" onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    open(event.currentTarget);
  }} />;
}
