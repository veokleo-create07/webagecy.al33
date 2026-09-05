"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import type { ReactNode, RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookingLink } from "@/components/booking/booking-provider";
import { useLanguage } from "@/components/language-provider";
import { ArrowIcon } from "@/components/ui/arrow-icon";
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

function VerticalMarquee({ services, trackRef }: { services: Service[]; trackRef: RefObject<HTMLDivElement | null> }) {
  return <div className={styles.marquee}>
    <div ref={trackRef} className={styles.track}>
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
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const loop = gsap.fromTo(track, { yPercent: 0 }, {
        yPercent: -50,
        duration: 22,
        repeat: -1,
        force3D: true,
        ease: "none",
      });

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: self => {
          const velocity = Math.min(3.4, 1 + Math.abs(self.getVelocity()) / 650);
          gsap.killTweensOf(loop);
          loop.timeScale(self.direction * velocity);
          gsap.to(loop, {
            timeScale: 1,
            duration: .8,
            delay: .08,
            ease: "power2.out",
            overwrite: true,
          });
        },
      });
    }, section);

    return () => context.revert();
  }, [reducedMotion]);

  return <section ref={sectionRef} className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
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
        <VerticalMarquee services={content.services} trackRef={trackRef} />
      </div>
    </motion.div>
  </section>;
}
