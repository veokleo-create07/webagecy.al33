"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/localization";
import styles from "./services.module.css";

type Room = { number: string; title: string; items: string[] };

const copy: Record<Language, { context: string; headline: string; paragraph: string; closing: string; rooms: Room[] }> = {
  sq: {
    context: "Different disciplines. One bigger picture.",
    headline: "Çdo vendim duhet t’i shërbejë biznesit.",
    paragraph: "Strategji, dizajn dhe teknologji të integruara për një pozicionim më të qartë, diferencim më të dallueshëm dhe relevancë më të lartë në treg.",
    closing: "Më shumë se shërbime. Një partner për rritje.",
    rooms: [
      { number: "01", title: "Dizajn & Strategji", items: ["Branding", "Identitet", "UX/UI", "Strategji"] },
      { number: "02", title: "Web Development", items: ["Web faqe", "Platforma", "E-commerce", "Performancë"] },
      { number: "03", title: "Marketing & SEO", items: ["SEO", "Content", "Advertising", "Rritje"] },
      { number: "04", title: "Software & Apps", items: ["Sisteme", "Aplikacione", "Integrime", "Shkallëzim"] },
    ],
  },
  en: {
    context: "Different disciplines. One bigger picture.",
    headline: "Every decision should serve the business.",
    paragraph: "Integrated strategy, design and technology for clearer positioning, sharper differentiation and greater competitive relevance.",
    closing: "More than services. A partner for growth.",
    rooms: [
      { number: "01", title: "Design & Strategy", items: ["Branding", "Identity", "UX/UI", "Strategy"] },
      { number: "02", title: "Web Development", items: ["Websites", "Platforms", "E-commerce", "Performance"] },
      { number: "03", title: "Marketing & SEO", items: ["SEO", "Content", "Advertising", "Growth"] },
      { number: "04", title: "Software & Apps", items: ["Systems", "Applications", "Integrations", "Scale"] },
    ],
  },
};

function DesignWorld() {
  return <div className={`${styles.world} ${styles.designWorld}`} data-world aria-hidden="true">
    <div className={styles.designGrid}><i /><i /><i /><i /></div>
    <div className={styles.typeSheetBack}><span>Form</span><b>Identity 06.26</b></div>
    <div className={styles.typeSheetMid}><span>Kg</span><i /><b>K</b></div>
    <div className={styles.typeSheetMain}><small>TYPOGRAPHY / SYSTEM</small><strong>Aa</strong><span>Aspekta Regular</span><i /></div>
    <div className={styles.identityCard}><b>K</b><span>KREU<br />VISUAL SYSTEM</span></div>
    <div className={styles.materialSwatches}><i /><i /><i /></div>
    <div className={styles.alignMarks}><i /><i /><i /></div>
  </div>;
}

function WebWorld() {
  return <div className={`${styles.world} ${styles.webWorld}`} data-world aria-hidden="true">
    <div className={styles.codePanel}><span>01</span><i /><i /><i /><i /></div>
    <div className={styles.browser}>
      <header><span /><span /><span /><b>atelier.one / residences</b></header>
      <div className={styles.browserHero}>
        <small>PRIVATE RESIDENCES / 2026</small><strong>Space,<br />considered.</strong>
        <div className={styles.editorialImage}><i /><i /><span>VIEW 04</span></div>
      </div>
      <div className={styles.browserRail}><span>Architecture</span><span>Residences</span><span>Explore</span></div>
    </div>
    <div className={styles.webCursor} />
  </div>;
}

function MarketingWorld() {
  return <div className={`${styles.world} ${styles.marketingWorld}`} data-world aria-hidden="true">
    <div className={styles.metricCard}><small>ORGANIC VISIBILITY</small><strong>+320%</strong><span>12 month change</span></div>
    <div className={styles.chartPanel}>
      <div className={styles.chartMeta}><span>Market relevance</span><b>68.4</b></div>
      <svg viewBox="0 0 240 120" preserveAspectRatio="none">
        <g><path d="M0 24H240M0 60H240M0 96H240" /></g>
        <path className={styles.chartArea} d="M2 108 C30 103 46 94 68 96 C96 99 111 68 137 75 C165 83 177 43 199 50 C218 56 224 22 238 12 L238 120 L2 120 Z" />
        <path className={styles.chartLine} d="M2 108 C30 103 46 94 68 96 C96 99 111 68 137 75 C165 83 177 43 199 50 C218 56 224 22 238 12" />
      </svg>
      <div className={styles.chartLabels}><span>JAN</span><span>JUN</span><span>DEC</span></div>
    </div>
    <div className={styles.rankPanel}><span>Search position</span><b>03</b><i /><i /><i /></div>
    <div className={styles.campaignPanel}><small>CAMPAIGN 04</small><span>Qualified demand</span><b>8.7×</b></div>
  </div>;
}

function SoftwareWorld() {
  return <div className={`${styles.world} ${styles.softwareWorld}`} data-world aria-hidden="true">
    <div className={styles.systemPanel}><span>LIVE SYSTEM</span><i /><i /><i /></div>
    <div className={styles.phone}><div className={styles.phoneScreen}>
      <header><span>NEXA</span><i /></header><small>OPERATIONS</small><strong>24</strong><em>active routes</em>
      <div className={styles.phoneChart}><i /><i /><i /><i /><i /></div>
      <div className={styles.phoneRows}><span><i />Tirana → Prishtina</span><span><i />Durrës → Milan</span><span><i />Skopje → Tirana</span></div>
    </div></div>
    <div className={styles.statusPanel}><i /><span>Systems connected</span><b>98.6%</b></div>
  </div>;
}

function RoomWorld({ index }: { index: number }) {
  if (index === 0) return <DesignWorld />;
  if (index === 1) return <WebWorld />;
  if (index === 2) return <MarketingWorld />;
  return <SoftwareWorld />;
}

function ServiceRoom({ room, index }: { room: Room; index: number }) {
  return <article className={styles.room} data-room data-room-index={index} tabIndex={0}>
    <div className={styles.outerGlow} aria-hidden="true" />
    <div className={styles.chamber}>
      <div className={styles.backWall} aria-hidden="true" /><div className={styles.ceiling} aria-hidden="true" />
      <div className={styles.leftWall} aria-hidden="true" /><div className={styles.rightWall} aria-hidden="true" />
      <div className={styles.innerFloor} aria-hidden="true" /><div className={styles.lightCone} data-room-light aria-hidden="true" />
      <div className={styles.roomHeading}><span>{room.number}</span><h3>{room.title}</h3></div>
      <RoomWorld index={index} />
      <ul>{room.items.map((item) => <li key={item}>{item}</li>)}</ul>
      <span className={styles.edgeLeft} aria-hidden="true" /><span className={styles.edgeRight} aria-hidden="true" /><span className={styles.edgeTop} aria-hidden="true" />
    </div>
  </article>;
}

function HumanSilhouette() {
  return <div className={styles.figure} data-figure aria-hidden="true">
    <span className={styles.figureHead} /><span className={styles.figureTorso} />
    <span className={styles.figureArmLeft} /><span className={styles.figureArmRight} />
    <span className={styles.figureLegLeft} /><span className={styles.figureLegRight} /><span className={styles.figureShadow} />
  </div>;
}

export function Services() {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const content = copy[language];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.timeline({ defaults: { ease: "power3.out", immediateRender: false }, scrollTrigger: { trigger: section, start: "top 76%", once: true } })
          .from("[data-services-header] > *", { y: 20, opacity: 0, duration: .72, stagger: .08 }, 0)
          .from("[data-room]", { y: 58, opacity: 0, rotateX: -5, scale: .975, duration: 1.08, stagger: .11 }, .28)
          .from("[data-room-light]", { opacity: 0, scaleY: .25, transformOrigin: "50% 0%", duration: 1.05, stagger: .09 }, .52)
          .from("[data-world]", { opacity: 0, y: 20, scale: .94, duration: .86, stagger: .1 }, .68)
          .from("[data-figure]", { opacity: 0, y: 14, scale: .92, duration: .7 }, 1.03)
          .from("[data-services-closing]", { opacity: 0, y: 14, duration: .66 }, 1.12);
      });

      media.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-room]").forEach((room, index) => {
          gsap.to(room, { y: index % 2 ? -7 : -4, duration: 5.6 + index * .55, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });
        gsap.to("[data-room-index='0'] [data-world], [data-room-index='2'] [data-world]", { y: -5, scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.4 } });
        gsap.to("[data-room-index='1'] [data-world], [data-room-index='3'] [data-world]", { y: 5, scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.4 } });
      });

      return () => media.revert();
    }, section);
    return () => context.revert();
  }, []);

  return <section ref={sectionRef} className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
    <div className={styles.atmosphere} aria-hidden="true"><i /><i /><span /></div>
    <div className={styles.inner}>
      <header className={styles.header} data-services-header>
        <div className={styles.metaRow}><span>03</span><span>THE FOUR ROOMS</span><span>{content.context}</span></div>
        <h2 id="services-title">{content.headline}</h2><p>{content.paragraph}</p>
      </header>
      <div className={styles.installation}>
        <div className={styles.stageLight} aria-hidden="true" />
        <div className={styles.rooms}>{content.rooms.map((room, index) => <ServiceRoom key={room.number} room={room} index={index} />)}</div>
        <div className={styles.horizon} aria-hidden="true" /><div className={styles.stageFloor} aria-hidden="true" />
        <div className={styles.reflections} aria-hidden="true">{content.rooms.map(room => <i key={room.number} />)}</div>
        <HumanSilhouette />
      </div>
      <div className={styles.closing} data-services-closing><span>KREU</span><p>{content.closing}</p></div>
    </div>
  </section>;
}
