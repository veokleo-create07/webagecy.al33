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
    <BookingLink className={styles.button} aria-label={label} data-button-variant="primary" data-magnetic>
      <span className={styles.wrap}>
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
