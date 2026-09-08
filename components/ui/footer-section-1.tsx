"use client";

import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { useLanguage } from "@/components/language-provider";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { type CSSProperties, type PointerEvent, useRef } from "react";
import styles from "./footer-section-1.module.css";

const navigation = [
  { label: "Services", href: "#expertise" },
  { label: "Contact", href: "#contact" },
] as const;
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
] as const;
const marquee = ["KREU WEB", "DESIGN", "WEB DEVELOPMENT", "MARKETING & SEO", "SOFTWARE & APPS"];

export default function Footer1() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const reveal: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 38 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : .9, ease: [.22, 1, .36, 1] } },
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || !footerRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    footerRef.current.style.setProperty("--footer-x", `${x * 16}px`);
    footerRef.current.style.setProperty("--footer-y", `${y * 14}px`);
    footerRef.current.style.setProperty("--footer-bend", `${Math.max(0, y) * 3}deg`);
  };
  return <footer id="contact" ref={footerRef} className={styles.footer} onPointerMove={onPointerMove} onPointerLeave={() => { footerRef.current?.style.setProperty("--footer-x", "0px"); footerRef.current?.style.setProperty("--footer-y", "0px"); footerRef.current?.style.setProperty("--footer-bend", "0deg"); }}>
    <div className={styles.grid} aria-hidden="true" />
    <div className={styles.aurora} aria-hidden="true" />
    <div className={styles.giant} aria-hidden="true">KREU WEB</div>
    <div className={styles.marquee} aria-hidden="true"><div>{[...marquee, ...marquee, ...marquee].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}</div></div>
    <motion.div className={styles.stage} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .12 }}>
      <motion.div variants={reveal} className={styles.center}>
        <p className={styles.kicker}>{t("For the next stage.")}</p>
        <h2>{t("Make your business stand out where it matters.")}</h2>
        <p className={styles.subline}>{t("A considered digital presence designed to strengthen trust, increase relevance and create new opportunities for the business.")}</p>
        <AntiMetalButton className={styles.bookingButton} label={t("Book a discovery call")} />
      </motion.div>
      <motion.div variants={reveal} className={styles.pills}>
        <nav aria-label={t("Navigation")}>{navigation.map((item, index) => <a key={item.label} href={item.href} style={{ "--item-index": index } as CSSProperties}>{t(item.label)}</a>)}</nav>
        <nav aria-label={t("Socials")}>{socials.map((item, index) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" style={{ "--item-index": index } as CSSProperties}>{item.label}</a>)}</nav>
      </motion.div>
      <motion.div variants={reveal} className={styles.bottom}>
        <p>© KREU WEB 2026 {t("All rights reserved.")}</p>
      </motion.div>
    </motion.div>
  </footer>;
}
