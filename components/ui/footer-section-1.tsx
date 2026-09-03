"use client";

import { LanguageSwitcher, useLanguage } from "@/components/language-provider";
import { motion, useReducedMotion, type Variants } from "motion/react";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#expertise" },
  { label: "Contact", href: "#contact" },
] as const;

export default function Footer1() {
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion ? { duration: 0 } : { staggerChildren: 0.08, delayChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const linkClass = "group relative w-fit py-1 text-[clamp(1.05rem,1.45vw,1.4rem)] leading-tight tracking-[-0.025em] text-white/72 transition-colors duration-300 hover:text-[#f2f0e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-right after:scale-x-0 after:bg-white/45 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100";

  return (
    <footer className="w-full overflow-hidden bg-[#070807] text-[#f2f0e9]">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        variants={containerVariants}
        className="mx-auto w-full max-w-[1600px] px-5 pb-7 pt-16 sm:px-8 sm:pb-8 sm:pt-20 lg:px-12 lg:pb-10 lg:pt-24"
      >
        <div className="h-px w-full bg-white/12" aria-hidden="true" />

        <div className="grid gap-12 py-14 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 sm:py-16 lg:grid-cols-3 lg:gap-16 lg:py-20">
          <motion.section variants={itemVariants} aria-labelledby="footer-contact" className="flex flex-col items-start">
            <p id="footer-contact" className="mb-6 text-[0.68rem] uppercase tracking-[0.15em] text-white/34">
              {t("Contact")}
            </p>
            <a href="mailto:hello@kreuweb.com" className={linkClass}>
              hello@kreuweb.com
            </a>
            <p className="mt-7 max-w-[22rem] text-sm leading-relaxed text-white/38">
              {t("For businesses defined by ambition.")}
            </p>
          </motion.section>

          <motion.nav variants={itemVariants} aria-labelledby="footer-navigation" className="flex flex-col items-start">
            <p id="footer-navigation" className="mb-5 text-[0.68rem] uppercase tracking-[0.15em] text-white/34">
              {t("Navigation")}
            </p>
            <div className="flex flex-col items-start gap-2">
              {navigation.map(item => (
                <a key={item.label} href={item.href} className={linkClass}>
                  {t(item.label)}
                </a>
              ))}
            </div>
          </motion.nav>

          <motion.section variants={itemVariants} aria-labelledby="footer-socials" className="flex flex-col items-start sm:col-span-2 lg:col-span-1">
            <p id="footer-socials" className="mb-5 text-[0.68rem] uppercase tracking-[0.15em] text-white/34">
              {t("Socials")}
            </p>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label={t("Kreu Web on Instagram")}
              className={linkClass}
            >
              Instagram
            </a>
            <div className="mt-8">
              <LanguageSwitcher />
            </div>
          </motion.section>
        </div>

        <motion.div variants={itemVariants} className="border-t border-white/10 pt-8 sm:pt-10">
          <p className="text-[0.66rem] uppercase tracking-[0.15em] text-white/30">
            {t("Design · Development · Growth · Software")}
          </p>
          <p
            aria-label="Kreu Web"
            className="mt-8 whitespace-nowrap text-[clamp(5.15rem,18.2vw,18rem)] font-normal leading-[0.72] tracking-[-0.085em] text-white/48 sm:mt-10"
          >
            Kreu Web
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.72rem] tracking-[0.02em] text-white/32 sm:mt-16 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {new Date().getFullYear()} Kreu Web. {t("All rights reserved.")}</p>
          <a href="#top" className="w-fit self-end transition-colors duration-300 hover:text-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 sm:self-auto">
            {t("Back to top")}
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
