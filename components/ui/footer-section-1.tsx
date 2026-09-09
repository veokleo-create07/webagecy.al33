"use client";

import { AntiMetalButton } from "@/components/ui/anti-metal-button";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { LayeredText } from "@/components/ui/layered-text";
import { useLanguage } from "@/components/language-provider";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { type CSSProperties, type PointerEvent, useRef } from "react";
import styles from "./footer-section-1.module.css";

const navigation = [
  { label: "Services", href: "#expertise" },
  { label: "Contact", href: "#contact" },
] as const;
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/kreuweb/" },
] as const;
const marquee = ["DESIGN", "WEB DEVELOPMENT", "MARKETING & SEO", "SOFTWARE & APPS"];

export default function Footer1() {
  const { language, t } = useLanguage();
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
    <div className={styles.marquee} aria-hidden="true"><div>{[...marquee, ...marquee, ...marquee].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}</div></div>
    <motion.div className={styles.stage} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .12 }}>
      <motion.div variants={reveal} className={styles.center}>
        <LayeredText
          id="footer-heading"
          text={t("Make your business stand out where it matters.")}
          className={styles.layeredHeadline}
          lines={language === "sq"
            ? ["Bëje biznesin tënd", "të dallohet", "aty ku", "ka rëndësi."]
            : ["Make your", "business stand out", "where it", "matters."]}
        />
        <AntiMetalButton className={styles.bookingButton} label={t("Book a discovery call")} />
      </motion.div>
      <motion.div variants={reveal} className={styles.pills}>
        <nav aria-label={t("Navigation")}>{navigation.map((item, index) => <a key={item.label} href={item.href} style={{ "--item-index": index } as CSSProperties}><span>{t(item.label)}</span><ArrowIcon /></a>)}</nav>
        <nav aria-label={t("Socials")}>{socials.map((item, index) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" style={{ "--item-index": index } as CSSProperties}><span>{item.label}</span><ArrowIcon /></a>)}</nav>
      </motion.div>
      <motion.div variants={reveal} className={styles.bottom}>
        <p>© 2026 Kreu Web. All rights reserved.</p>
      </motion.div>
    </motion.div>
  </footer>;
}
