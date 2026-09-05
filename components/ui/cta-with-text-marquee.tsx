"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";
import { BookingLink } from "@/components/booking/booking-provider";
import { useLanguage } from "@/components/language-provider";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/localization";
import styles from "./cta-with-text-marquee.module.css";

type Service = { title: string };

const copy: Record<Language, { label: string; headline: string; paragraph: string; cta: string; services: Service[] }> = {
  sq: {
    label: "SHËRBIMET",
    headline: "Çdo disiplinë. Një drejtim.",
    paragraph: "Dizajni, teknologjia dhe rritja punojnë si një sistem i vetëm për ta pozicionuar biznesin me më shumë qartësi, autoritet dhe relevancë.",
    cta: "Rezervo një konsultë",
    services: [
      { title: "Design" },
      { title: "Web Development" },
      { title: "Marketing & SEO" },
      { title: "Software & Apps" },
    ],
  },
  en: {
    label: "SERVICES",
    headline: "Every discipline. One direction.",
    paragraph: "Design, technology and growth operate as one system to position the business with greater clarity, authority and relevance.",
    cta: "Book a discovery call",
    services: [
      { title: "Design" },
      { title: "Web Development" },
      { title: "Marketing & SEO" },
      { title: "Software & Apps" },
    ],
  },
};

function MarqueeGroup({ children, hidden = false }: { children: ReactNode; hidden?: boolean }) {
  return <div className={styles.group} aria-hidden={hidden || undefined}>{children}</div>;
}

function VerticalMarquee({ services, paused = true, speed = 22 }: { services: Service[]; paused?: boolean; speed?: number }) {
  return <div className={cn(styles.marquee, paused && styles.pauseOnHover)} style={{ "--duration": `${speed}s` } as CSSProperties}>
    <div className={styles.track}>
      {[false, true].map(hidden => <MarqueeGroup key={String(hidden)} hidden={hidden}>
        {services.map(service => <div className={styles.item} key={`${hidden}-${service.title}`}>
          <strong>{service.title}</strong>
        </div>)}
      </MarqueeGroup>)}
    </div>
  </div>;
}

export default function CTAWithTextMarquee() {
  const { language } = useLanguage();
  const reducedMotion = useReducedMotion();
  const content = copy[language];

  return <section className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
    <motion.div className={styles.inner} initial={reducedMotion ? false : { opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "0px 0px -12%" }} transition={{ duration: reducedMotion ? 0 : .85, ease: [.22, 1, .36, 1] }}>
      <div className={styles.content}>
        <span className={styles.label}>{content.label}</span>
        <h2 id="services-title">{content.headline}</h2>
        <p>{content.paragraph}</p>
        <BookingLink className={styles.cta}>
          <span>{content.cta}</span><ArrowIcon />
        </BookingLink>
      </div>

      <div className={styles.marqueeStage}>
        <VerticalMarquee services={content.services} paused={!reducedMotion} />
      </div>
    </motion.div>
  </section>;
}
