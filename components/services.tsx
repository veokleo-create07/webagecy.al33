"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/localization";
import styles from "./services.module.css";

type Room = {
  number: string;
  title: string;
  items: string[];
};

const copy: Record<Language, {
  context: string;
  headline: string;
  paragraph: string;
  closing: string;
  rooms: Room[];
}> = {
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

function ServiceRoom({ room, index }: { room: Room; index: number }) {
  return <article className={styles.room} data-room data-room-index={index} tabIndex={0}>
    <div className={styles.roomDepth} aria-hidden="true" />
    <div className={styles.roomHaze} aria-hidden="true" />
    <div className={styles.roomCeiling} aria-hidden="true" />
    <div className={styles.roomWallLeft} aria-hidden="true" />
    <div className={styles.roomWallRight} aria-hidden="true" />
    <div className={styles.roomFloor} aria-hidden="true" />
    <div className={styles.roomLight} data-room-light aria-hidden="true" />
    <RoomArtifact index={index} />
    <div className={styles.roomContent}>
      <span className={styles.roomNumber}>{room.number}</span>
      <h3>{room.title}</h3>
      <ul>{room.items.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
    <span className={styles.edgeLeft} aria-hidden="true" />
    <span className={styles.edgeRight} aria-hidden="true" />
  </article>;
}

function RoomArtifact({ index }: { index: number }) {
  if (index === 0) {
    return <div className={`${styles.artifact} ${styles.designArtifact}`} data-room-artifact aria-hidden="true">
      <span>Aa</span><i /><i /><b>Kg</b>
    </div>;
  }

  if (index === 1) {
    return <div className={`${styles.artifact} ${styles.webArtifact}`} data-room-artifact aria-hidden="true">
      <header><span>kreu.web</span><i /><i /></header>
      <div><b /><b /><b /><em /></div>
    </div>;
  }

  if (index === 2) {
    return <div className={`${styles.artifact} ${styles.marketingArtifact}`} data-room-artifact aria-hidden="true">
      <span>68.4%</span>
      <svg viewBox="0 0 180 82"><path d="M3 72 C30 70 39 57 63 60 C91 63 98 41 124 45 C149 49 155 23 177 11" /></svg>
      <i /><i /><i />
    </div>;
  }

  return <div className={`${styles.artifact} ${styles.softwareArtifact}`} data-room-artifact aria-hidden="true">
    <i /><i />
    <div><span>OS</span><b>24</b><em /><em /><em /></div>
  </div>;
}

function HumanSilhouette() {
  return <div className={styles.figure} data-figure aria-hidden="true">
    <span className={styles.figureHead} />
    <span className={styles.figureBody} />
    <span className={styles.figureArmLeft} />
    <span className={styles.figureArmRight} />
    <span className={styles.figureLegLeft} />
    <span className={styles.figureLegRight} />
    <span className={styles.figureShadow} />
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
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out", immediateRender: false },
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        });

        timeline
          .from("[data-services-header] > *", { y: 24, opacity: 0, duration: .75, stagger: .09 }, 0)
          .from("[data-room]", { y: 48, opacity: 0, rotateX: -7, scale: .965, duration: 1, stagger: .1 }, .35)
          .from("[data-room-light]", { opacity: 0, scaleY: .45, transformOrigin: "50% 100%", duration: .82, stagger: .08 }, .6)
          .from("[data-room-artifact]", { opacity: 0, z: -35, y: 12, duration: .7, stagger: .08 }, .76)
          .from("[data-room] > *:not([data-room-light]):not([data-room-artifact])", { opacity: 0, y: 10, duration: .5, stagger: .015 }, .72)
          .from("[data-figure]", { opacity: 0, y: 12, scale: .92, duration: .72 }, .92)
          .from("[data-services-closing]", { opacity: 0, y: 16, duration: .68 }, 1.08);
      });

      media.add("(min-width: 769px) and (prefers-reduced-motion: no-preference)", () => {
        const rooms = gsap.utils.toArray<HTMLElement>("[data-room]");
        rooms.forEach((room, index) => {
          gsap.to(room, {
            yPercent: index % 2 ? -1.15 : -.65,
            duration: 4.8 + index * .45,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });
      });

      return () => media.revert();
    }, section);

    return () => context.revert();
  }, []);

  return <section ref={sectionRef} className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
    <div className={styles.ambient} aria-hidden="true"><i /><i /><span /></div>
    <div className={styles.inner}>
      <header className={styles.header} data-services-header>
        <div className={styles.metaRow}>
          <span>03</span>
          <span>THE FOUR ROOMS</span>
          <span>{content.context}</span>
        </div>
        <h2 id="services-title">{content.headline}</h2>
        <p>{content.paragraph}</p>
      </header>

      <div className={styles.installation}>
        <div className={styles.rooms}>
          {content.rooms.map((room, index) => <ServiceRoom key={room.number} room={room} index={index} />)}
        </div>
        <div className={styles.horizon} aria-hidden="true" />
        <div className={styles.reflection} aria-hidden="true">
          {content.rooms.map((room) => <i key={room.number} />)}
        </div>
        <HumanSilhouette />
      </div>

      <div className={styles.closing} data-services-closing>
        <span>KREU</span>
        <p>{content.closing}</p>
      </div>
    </div>
  </section>;
}
