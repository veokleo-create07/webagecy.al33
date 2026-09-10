"use client";

import { forwardRef, type ComponentPropsWithRef } from "react";
import { BookingLink } from "@/components/booking/booking-provider";
import { cn } from "@/lib/utils";
import styles from "./anti-metal-button.module.css";

type AntiMetalButtonProps = ComponentPropsWithRef<typeof BookingLink> & {
  label: string;
  accentFrom?: string;
  accentTo?: string;
  dotColor?: string;
};

function DoubleChevron({ index, dotColor }: { index: number; dotColor: string }) {
  const base = index * .12;
  const dots = [
    { cx: 2, cy: 2, d: 0 }, { cx: 5, cy: 5, d: .05 }, { cx: 8, cy: 8, d: .1 }, { cx: 5, cy: 11, d: .15 }, { cx: 2, cy: 14, d: .2 },
    { cx: 6, cy: 2, d: .05 }, { cx: 9, cy: 5, d: .1 }, { cx: 12, cy: 8, d: .15 }, { cx: 9, cy: 11, d: .2 }, { cx: 6, cy: 14, d: .25 },
  ];
  return <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true" focusable="false" className={styles.chevron}><g fill={dotColor}>{dots.map((dot, dotIndex) => <circle key={dotIndex} cx={dot.cx} cy={dot.cy} r="1" className={styles.dot} style={{ animationDelay: `${base + dot.d}s` }} />)}</g></svg>;
}

export const AntiMetalButton = forwardRef<HTMLAnchorElement, AntiMetalButtonProps>(function AntiMetalButton({ className, label, accentFrom = "#e6e5df", accentTo = "#bdbdb6", dotColor = "#10100f", ...props }, ref) {
  return <BookingLink ref={ref} className={cn(styles.button, className)} data-magnetic {...props}>
    <span className={styles.label}>{label}</span>
    <span className={styles.rail} aria-hidden="true" style={{ background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)` }}>
      {[0, 1, 2, 3, 4].map(index => <DoubleChevron key={index} index={index} dotColor={dotColor} />)}
    </span>
  </BookingLink>;
});

AntiMetalButton.displayName = "AntiMetalButton";
