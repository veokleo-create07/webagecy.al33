"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/components/language-provider";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { Language } from "@/lib/localization";
import styles from "./services.module.css";

type Service = {
  id: string;
  title: string;
  description: string;
  eyebrow: string;
};

const copy: Record<Language, { label: string; headline: string; paragraph: string; services: Service[]; previous: string; next: string }> = {
  sq: {
    label: "SHËRBIMET",
    headline: "Çdo vendim duhet t’i shërbejë biznesit.",
    paragraph: "Strategji, dizajn dhe teknologji të integruara për një pozicionim më të qartë, diferencim më të dallueshëm dhe relevancë më të lartë në treg.",
    previous: "Shërbimi i mëparshëm",
    next: "Shërbimi tjetër",
    services: [
      { id: "01", eyebrow: "IDENTITET & POZICIONIM", title: "Dizajn & Strategji", description: "Pozicionim, identitet dhe përvoja që e bëjnë biznesin të qartë, të dallueshëm dhe të besueshëm." },
      { id: "02", eyebrow: "WEBSITE & PLATFORMA", title: "Web Development", description: "Website dhe platforma me prezencë të fortë, performancë të lartë dhe një rrugë më të qartë drejt konvertimit." },
      { id: "03", eyebrow: "VIZIBILITET & KËRKESË", title: "Marketing & SEO", description: "Strategji kërkimi dhe komunikimi që rrisin relevancën, tërheqin vëmendjen e duhur dhe krijojnë kërkesë." },
      { id: "04", eyebrow: "PRODUKTE & SISTEME", title: "Software & Apps", description: "Produkte digjitale dhe sisteme të ndërtuara për të thjeshtuar operacionet dhe për t’u zgjeruar me biznesin." },
    ],
  },
  en: {
    label: "SERVICES",
    headline: "Every decision should serve the business.",
    paragraph: "Integrated strategy, design and technology for clearer positioning, sharper differentiation and greater competitive relevance.",
    previous: "Previous service",
    next: "Next service",
    services: [
      { id: "01", eyebrow: "IDENTITY & POSITIONING", title: "Design & Strategy", description: "Positioning, identity and experiences that make the business clearer, more distinctive and more credible." },
      { id: "02", eyebrow: "WEBSITES & PLATFORMS", title: "Web Development", description: "Websites and platforms with a commanding presence, high performance and a clearer path to conversion." },
      { id: "03", eyebrow: "VISIBILITY & DEMAND", title: "Marketing & SEO", description: "Search and communication strategies that build relevance, attract the right attention and create demand." },
      { id: "04", eyebrow: "PRODUCTS & SYSTEMS", title: "Software & Apps", description: "Digital products and systems designed to simplify operations and scale with the business." },
    ],
  },
};

function DesignScene() {
  return <div className={`${styles.scene} ${styles.designScene}`} aria-hidden="true">
    <div className={styles.sceneLabel}>IDENTITY SYSTEM / 2026</div>
    <div className={styles.designGrid}><i /><i /><i /><i /></div>
    <div className={styles.logoStudy}><small>MARK / 04</small><strong>K</strong><span>Form follows meaning.</span></div>
    <div className={styles.typeStudy}><small>TYPE SYSTEM</small><strong>Aa</strong><span>Aspekta Regular</span></div>
    <div className={styles.identityStrip}><b>01</b><span>KREU<br />IDENTITY</span><i /><i /><i /></div>
  </div>;
}

function WebScene() {
  return <div className={`${styles.scene} ${styles.webScene}`} aria-hidden="true">
    <div className={styles.sceneLabel}>DIGITAL EXPERIENCE / LIVE</div>
    <div className={styles.codePane}><span>01</span><i /><i /><i /><i /><i /></div>
    <div className={styles.browserFrame}>
      <header><i /><i /><i /><span>atelier.one / residences</span></header>
      <nav><b>ATELIER ONE</b><span>Residences&nbsp;&nbsp; Journal&nbsp;&nbsp; Contact</span></nav>
      <main><small>PRIVATE RESIDENCES</small><strong>Space,<br />considered.</strong><div className={styles.architecture}><i /><i /><i /></div></main>
      <footer><span>Prishtina / 42.66° N</span><span>Explore project</span></footer>
    </div>
    <div className={styles.viewportBadge}><span>PERFORMANCE</span><b>98</b></div>
  </div>;
}

function MarketingScene() {
  return <div className={`${styles.scene} ${styles.marketingScene}`} aria-hidden="true">
    <div className={styles.sceneLabel}>MARKET INTELLIGENCE / Q3</div>
    <div className={styles.metricHero}><small>Qualified demand</small><strong>8.7×</strong><span>rolling 12 months</span></div>
    <div className={styles.analytics}>
      <header><span>Organic visibility</span><b>+64.8%</b></header>
      <svg viewBox="0 0 640 240" preserveAspectRatio="none">
        <g><path d="M0 48H640M0 120H640M0 192H640" /></g>
        <path className={styles.area} d="M0 216 C72 208 98 176 154 184 C218 194 252 126 318 144 C388 163 415 87 478 105 C548 124 578 53 640 28 L640 240 L0 240 Z" />
        <path className={styles.line} d="M0 216 C72 208 98 176 154 184 C218 194 252 126 318 144 C388 163 415 87 478 105 C548 124 578 53 640 28" />
      </svg>
      <footer><span>JAN</span><span>JUN</span><span>DEC</span></footer>
    </div>
    <div className={styles.ranking}><span>Search position</span><strong>03</strong><i /><i /><i /></div>
  </div>;
}

function SoftwareScene() {
  return <div className={`${styles.scene} ${styles.softwareScene}`} aria-hidden="true">
    <div className={styles.sceneLabel}>PRODUCT SYSTEM / NEXA</div>
    <div className={styles.systemCard}><span>CONNECTED SYSTEMS</span><b>98.6%</b><i /><i /><i /></div>
    <div className={styles.deviceBack}><header>NEXA <i /></header><small>SHIPMENT DETAIL</small><strong>NX 4827</strong><div className={styles.route}><i /><i /><i /></div><span>Tirana&nbsp;&nbsp; → &nbsp;&nbsp;Milan</span></div>
    <div className={styles.deviceFront}><header>NEXA <i /></header><small>OPERATIONS</small><strong>24</strong><em>active routes</em><div className={styles.appStats}><span>48<small>today</small></span><span>03<small>delayed</small></span><span>18<small>fleet</small></span></div><div className={styles.appRows}><i /><i /><i /></div></div>
  </div>;
}

function ServiceScene({ index }: { index: number }) {
  if (index === 0) return <DesignScene />;
  if (index === 1) return <WebScene />;
  if (index === 2) return <MarketingScene />;
  return <SoftwareScene />;
}

export function Services() {
  const { language } = useLanguage();
  const content = copy[language];
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const activeRef = useRef(0);

  const select = useCallback((index: number) => {
    setDirection(index >= activeRef.current ? 1 : -1);
    activeRef.current = index;
    setActiveIndex(index);
  }, []);

  const next = useCallback(() => {
    select((activeRef.current + 1) % content.services.length);
  }, [content.services.length]);

  const previous = useCallback(() => {
    select((activeRef.current - 1 + content.services.length) % content.services.length);
  }, [content.services.length]);

  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      const updateFromProgress = (progress: number) => {
        const index = Math.min(content.services.length - 1, Math.floor(progress * content.services.length));
        if (index !== activeRef.current) select(index);
      };

      media.add("(min-width: 769px)", () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=165%",
          pin: "[data-services-stage]",
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: self => updateFromProgress(self.progress),
        });
      });

      media.add("(max-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: section,
          start: "top 72%",
          end: "bottom 30%",
          invalidateOnRefresh: true,
          onUpdate: self => updateFromProgress(self.progress),
        });
      });

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, [content.services.length, reducedMotion, select]);

  return <section ref={sectionRef} className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
    <div className={styles.atmosphere} aria-hidden="true"><i /><i /><i /></div>
    <div className={styles.inner} data-services-stage>
      <div className={styles.layout}>
        <div className={styles.content}>
          <header className={styles.intro}>
            <span>{content.label}</span>
            <h2 id="services-title">{content.headline}</h2>
            <p>{content.paragraph}</p>
          </header>

          <div className={styles.selector} role="tablist" aria-label={content.label}>
            {content.services.map((service, index) => {
              const active = index === activeIndex;
              return <button key={service.id} type="button" role="tab" aria-selected={active} aria-controls="service-visual" className={styles.serviceTab} data-active={active || undefined} onClick={() => select(index)}>
                <span className={styles.progressTrack}>{active && <i />}</span>
                <small>/{service.id}</small>
                <span className={styles.tabCopy}><strong>{service.title}</strong>
                  <AnimatePresence initial={false}>{active && <motion.span initial={reducedMotion ? false : { opacity: 0, height: 0, y: 5 }} animate={{ opacity: 1, height: "auto", y: 0 }} exit={{ opacity: 0, height: 0, y: -3 }} transition={{ duration: .34, ease: [.22, 1, .36, 1] }}>{service.description}</motion.span>}</AnimatePresence>
                </span>
              </button>;
            })}
          </div>
        </div>

        <div className={styles.gallery}>
          <div className={styles.galleryFrame} id="service-visual" role="tabpanel" aria-label={content.services[activeIndex].title}>
            <div className={styles.galleryGlow} aria-hidden="true" />
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div key={activeIndex} custom={direction} className={styles.visual} initial={reducedMotion ? false : { y: direction > 0 ? -28 : 28, opacity: 0, scale: .985 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { y: direction > 0 ? 24 : -24, opacity: 0, scale: .99 }} transition={{ duration: reducedMotion ? 0 : .72, ease: [.22, 1, .36, 1] }}>
                <ServiceScene index={activeIndex} />
              </motion.div>
            </AnimatePresence>
            <div className={styles.visualMeta}><span>{content.services[activeIndex].eyebrow}</span><strong>{content.services[activeIndex].title}</strong></div>
            <div className={styles.controls}>
              <button type="button" onClick={previous} aria-label={content.previous}><ArrowIcon direction="right" /></button>
              <button type="button" onClick={next} aria-label={content.next}><ArrowIcon direction="right" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
}
