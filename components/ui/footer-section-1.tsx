"use client";

import { SocialCloud } from "@/components/ui/footer-section-1-utils/social-cloud";
import { motion, useReducedMotion, type Variants } from "motion/react";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#expertise" },
  { label: "Contact", href: "#contact" },
];

export default function Footer1() {
  const reduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion ? { duration: 0 } : { staggerChildren: 0.09, delayChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 24 },
    },
  };

  return (
    <footer className="w-full overflow-hidden bg-[#090a09] py-12 text-[#f2f0e9] sm:py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -80px 0px" }}
        variants={containerVariants}
        className="mx-auto mb-14 flex w-full max-w-[1440px] flex-col items-center gap-9 px-5 text-center sm:mb-16 sm:gap-10 sm:px-8"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <p className="whitespace-nowrap text-[clamp(3.2rem,10.5vw,10rem)] font-normal leading-[0.78] tracking-[-0.075em] text-[#f2f0e9]">
            KREU WEB
          </p>
          <p className="mt-7 text-[0.72rem] font-normal uppercase tracking-[0.12em] text-white/35 sm:mt-9">
            Web design · Development · Digital presence
          </p>
        </motion.div>

        <motion.nav
          variants={itemVariants}
          aria-label="Footer navigation"
          className="relative z-10 flex flex-wrap justify-center gap-x-2 gap-y-2 text-sm font-normal sm:gap-x-3 sm:text-[0.95rem]"
        >
          {navigation.map(item => (
            <motion.a
              key={item.label}
              href={item.href}
              className="group relative overflow-hidden rounded-full px-4 py-2.5 text-white/62 transition-colors duration-300 hover:text-[#f2f0e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: .97 }}
            >
              <span className="relative z-10">{item.label}</span>
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 -z-0 rounded-full border border-white/10 bg-white/[0.045]"
                initial={{ opacity: 0, scale: .86 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
              />
            </motion.a>
          ))}
        </motion.nav>

        <motion.div variants={itemVariants} className="flex flex-col items-center gap-5">
          <SocialCloud />
          <a
            href="mailto:hello@kreuweb.com"
            className="text-sm text-white/42 transition-colors duration-300 hover:text-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
          >
            hello@kreuweb.com
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="h-12 w-full border-y border-white/10 bg-[repeating-linear-gradient(315deg,rgba(242,240,233,0.16)_0,rgba(242,240,233,0.16)_1px,transparent_0,transparent_50%)] opacity-55"
        style={{ backgroundSize: "10px 10px" }}
        initial={{ backgroundPositionX: "0%" }}
        whileInView={{ backgroundPositionX: reduceMotion ? "0%" : "100%" }}
        viewport={{ once: true }}
        transition={{ ease: "linear", duration: reduceMotion ? 0 : 20 }}
      />

      <motion.div
        className="mx-auto mt-8 flex w-full max-w-[1440px] flex-col items-center justify-between gap-3 px-5 text-center text-[0.72rem] tracking-[0.025em] text-white/32 sm:flex-row sm:px-8 sm:text-left"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={itemVariants}
      >
        <p>© {new Date().getFullYear()} Kreu Web. All rights reserved.</p>
        <p>Websites built to move businesses forward.</p>
      </motion.div>
    </footer>
  );
}
