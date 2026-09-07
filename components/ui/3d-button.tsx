"use client";

import type { CSSProperties } from "react";
import { BookingLink } from "@/components/booking/booking-provider";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import styles from "./3d-button.module.css";

type ThreeDButtonProps = {
  label: string;
};

function AnimatedLabel({ label, copy = false }: { label: string; copy?: boolean }) {
  return <span className={`${styles.label} ${copy ? styles.labelCopy : ""}`} aria-hidden={copy || undefined}>
    {Array.from(label).map((character, index) => (
      <span
        className={styles.character}
        key={`${character}-${index}`}
        style={{ "--character-index": index } as CSSProperties}
      >
        {character === " " ? "\u00a0" : character}
      </span>
    ))}
  </span>;
}

export function ThreeDButton({ label }: ThreeDButtonProps) {
  return (
    <BookingLink className={styles.button} aria-label={label}>
      <span className={styles.depth} aria-hidden="true" />
      <svg className={styles.splash} viewBox="0 0 342 208" aria-hidden="true">
        <path d="M54.1 99.8S40.1 90.8 26.7 97.6 1.5 97.6 1.5 97.6" />
        <path d="M285.3 99.8s14-9 27.4-2.2 27.4-2.1 27.4-2.1" />
        <path className={styles.quiet} d="M281.1 65s6.8-15.2 21.8-16.8 16.8-11.7 16.8-11.7" />
        <path className={styles.quiet} d="M281.1 139s6.8 15.2 21.8 16.7 16.8 11.7 16.8 11.7" />
        <path d="M230.6 57.4s-4.8-15.9 5.5-26.9 8.6-17.5 8.6-17.5" />
        <path d="M230.6 150.5s-4.8 16 5.5 27 8.6 17.5 8.6 17.5" />
        <path className={styles.quiet} d="M170.4 57s3.5-14.9-.8-27.5S168.8 2 168.8 2" />
        <path className={styles.quiet} d="M170.4 151s3.5 14.9-.8 27.5 0 27.4 0 27.4" />
        <path d="M112.6 57.4s4.8-15.9-5.5-26.9S98.5 13 98.5 13" />
        <path d="M112.6 150.5s4.8 16-5.5 27-8.6 17.5-8.6 17.5" />
        <path className={styles.quiet} d="M62.3 65s-6.8-15.2-21.8-16.8-16.8-11.7-16.8-11.7" />
        <path className={styles.quiet} d="M62.3 146s-6.8 15.2-21.8 16.7-16.8 11.7-16.8 11.7" />
      </svg>

      <span className={styles.wrap}>
        <svg className={styles.path} viewBox="0 0 221 42" preserveAspectRatio="none" aria-hidden="true">
          <path d="M182.7 2H203c8.8 0 16 7.2 16 16v6c0 8.8-7.2 16-16 16H18C9.2 40 2 32.8 2 24v-6C2 9.2 9.2 2 18 2h29.9" />
        </svg>
        <span className={styles.outline} aria-hidden="true" />
        <span className={styles.content}>
          <span className={styles.labels}>
            <AnimatedLabel label={label} />
            <AnimatedLabel label={label} copy />
          </span>
          <span className={styles.icon} aria-hidden="true"><ArrowIcon /></span>
        </span>
      </span>
    </BookingLink>
  );
}
