"use client";

import { ArrowIcon } from "@/components/ui/arrow-icon";
import { LanguageSwitcher, useLanguage } from "@/components/language-provider";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { type CSSProperties, type PointerEvent, useRef } from "react";
import styles from "./footer-section-1.module.css";

const navigation = [
  { label: "Projects", href: "#top" },
  { label: "Services", href: "#expertise" },
  { label: "About", href: "#top" },
  { label: "Contact", href: "#contact" },
] as const;
const socials = [
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Behance", href: "https://www.behance.net/" },
] as const;

export default function Footer1() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const items: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : .8, ease: [.22, 1, .36, 1] } },
  };
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduceMotion || !footerRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = footerRef.current.getBoundingClientRect();
    footerRef.current.style.setProperty("--footer-x", `${((event.clientX - bounds.left) / bounds.width - .5) * 14}px`);
    footerRef.current.style.setProperty("--footer-y", `${((event.clientY - bounds.top) / bounds.height - .5) * 10}px`);
  };
  const moveCreateCta = (event: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || !ctaRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const bounds = ctaRef.current.getBoundingClientRect();
    ctaRef.current.style.setProperty("--cta-x", `${(event.clientX - bounds.left - bounds.width / 2) * .12}px`);
    ctaRef.current.style.setProperty("--cta-y", `${(event.clientY - bounds.top - bounds.height / 2) * .12}px`);
  };

  return <footer ref={footerRef} className={styles.footer} onPointerMove={onPointerMove} onPointerLeave={() => { footerRef.current?.style.setProperty("--footer-x", "0px"); footerRef.current?.style.setProperty("--footer-y", "0px"); }}>
    <div className={styles.atmosphere} aria-hidden="true"><i className={styles.signal} /><i className={`${styles.signal} ${styles.signalTwo}`} /><i className={`${styles.signal} ${styles.signalThree}`} /><i className={`${styles.particle} ${styles.particleOne}`} /><i className={`${styles.particle} ${styles.particleTwo}`} /><i className={`${styles.particle} ${styles.particleThree}`} /></div>
    <div className={styles.marquee} aria-hidden="true">
      <div>
        <span>KREU WEB</span><b>✦</b><span>DESIGN</span><b>✦</b><span>WEB DEVELOPMENT</span><b>✦</b><span>SOFTWARE</span><b>✦</b>
        <span>KREU WEB</span><b>✦</b><span>DESIGN</span><b>✦</b><span>WEB DEVELOPMENT</span><b>✦</b><span>SOFTWARE</span><b>✦</b>
      </div>
    </div>
    <motion.div className={styles.inner} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .16 }}>
      <motion.div variants={items} className={styles.topline}><p>{t("Kreu Web")}</p><p>{t("A creative digital practice.")}</p><LanguageSwitcher /></motion.div>
      <motion.div variants={items} className={styles.intro}>
        <p>{t("We create digital experiences people remember.")}</p>
        <a ref={ctaRef} href="#contact" className={styles.create} onPointerMove={moveCreateCta} onPointerLeave={() => { ctaRef.current?.style.setProperty("--cta-x", "0px"); ctaRef.current?.style.setProperty("--cta-y", "0px"); }}><span>{t("Let’s create")}</span><ArrowIcon /></a>
      </motion.div>
      <motion.div variants={items} className={styles.wordmark} aria-label="Kreu Web">{"KREU WEB".split("").map((letter, index) => <span key={`${letter}-${index}`} style={{ "--letter-index": index } as CSSProperties}>{letter === " " ? "\u00a0" : letter}</span>)}</motion.div>
      <motion.div variants={items} className={styles.details}>
        <section aria-labelledby="footer-navigation"><p id="footer-navigation">{t("Navigation")}</p><nav>{navigation.map((item, index) => <a key={item.label} href={item.href} style={{ "--link-index": index } as CSSProperties}>{t(item.label)}</a>)}</nav></section>
        <section aria-labelledby="footer-socials"><p id="footer-socials">{t("Socials")}</p><nav>{socials.map((item, index) => <a key={item.label} href={item.href} target="_blank" rel="noreferrer" style={{ "--link-index": index } as CSSProperties}>{item.label}</a>)}</nav></section>
        <section className={styles.contact} aria-labelledby="footer-contact"><p id="footer-contact">{t("Contact")}</p><a href="mailto:hello@kreuweb.com">hello@kreuweb.com</a></section>
      </motion.div>
      <motion.div variants={items} className={styles.bottom}><p>© KREU WEB 2026 {t("All rights reserved.")}</p><a href="#top">{t("Back to top")}</a></motion.div>
    </motion.div>
  </footer>;
}
