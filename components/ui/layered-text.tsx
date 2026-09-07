"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import styles from "./layered-text.module.css";

type LayeredTextProps = {
  id: string;
  text: string;
  lines: string[];
  className?: string;
};

export function LayeredText({ id, text, lines, className = "" }: LayeredTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tracks = container.querySelectorAll<HTMLElement>("[data-layer-track]");
    const timeline = gsap.timeline({ paused: true }).to(tracks, {
      yPercent: -50,
      duration: .8,
      ease: "power2.out",
      stagger: .08,
    });

    const enter = () => timeline.play();
    const leave = () => timeline.reverse();
    container.addEventListener("mouseenter", enter);
    container.addEventListener("mouseleave", leave);

    return () => {
      container.removeEventListener("mouseenter", enter);
      container.removeEventListener("mouseleave", leave);
      timeline.kill();
    };
  }, [lines]);

  const center = (lines.length - 1) / 2;

  return (
    <div ref={containerRef} className={`${styles.root} ${className}`}>
      <h2 id={id} className={styles.screenReaderTitle}>{text}</h2>
      <ul className={styles.layers} aria-hidden="true">
        {lines.map((line, index) => (
          <li
            className={index % 2 === 0 ? styles.layerEven : styles.layerOdd}
            key={line}
            style={{
              "--layer-offset": `${(index - center) * 18}px`,
              "--layer-offset-mobile": `${(index - center) * 8}px`,
            } as CSSProperties}
          >
            <span className={styles.track} data-layer-track>
              <span>{line}</span>
              <span>{line}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
