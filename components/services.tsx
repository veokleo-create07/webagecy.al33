"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/localization";
import styles from "./services.module.css";

type Service = {
  key: "design" | "web" | "marketing" | "software";
  title: string;
  lines: [string, string];
};

const copy: Record<Language, {
  eyebrow: string;
  aside: string;
  headline: string;
  subline: string;
  result: string;
  resultLabel: string;
  services: Service[];
}> = {
  sq: {
    eyebrow: "01   THE DIGITAL ENGINE",
    aside: "Të gjitha shërbimet, të lidhura.",
    headline: "Çdo vendim duhet t’i shërbejë biznesit.",
    subline: "Strategji, dizajn dhe teknologji të integruara për një pozicionim më të qartë, diferencim më të dallueshëm dhe relevancë më të lartë në treg.",
    resultLabel: "REZULTATI",
    result: "Një sistem i vetëm. Një biznes më i pozicionuar.",
    services: [
      { key: "design", title: "Dizajn & Strategji", lines: ["Identitet i qartë.", "Përvojë që lë gjurmë."] },
      { key: "web", title: "Web Development", lines: ["Faqe që performojnë.", "Të ndërtuara për rritje."] },
      { key: "marketing", title: "Marketing & SEO", lines: ["Vizibilitet me qëllim.", "Rritje e matshme."] },
      { key: "software", title: "Software & Apps", lines: ["Sisteme që thjeshtojnë.", "Produkte që shkallëzohen."] },
    ],
  },
  en: {
    eyebrow: "01   THE DIGITAL ENGINE",
    aside: "All services working together.",
    headline: "Every decision should serve the business.",
    subline: "Integrated strategy, design and technology for clearer positioning, sharper differentiation and greater competitive relevance.",
    resultLabel: "THE RESULT",
    result: "One system. A better-positioned business.",
    services: [
      { key: "design", title: "Design & Strategy", lines: ["A distinct identity.", "An experience that leaves a mark."] },
      { key: "web", title: "Web Development", lines: ["Sites that perform.", "Built for growth."] },
      { key: "marketing", title: "Marketing & SEO", lines: ["Visibility with purpose.", "Measurable growth."] },
      { key: "software", title: "Software & Apps", lines: ["Systems that simplify.", "Products that scale."] },
    ],
  },
};

function DesignWorld() {
  return <div className={styles.designWorld} aria-hidden="true">
    <span className={styles.typeGrid} />
    <span className={styles.brandPlaneBack}>K</span>
    <span className={styles.brandPlaneMiddle}>Aa</span>
    <span className={styles.brandPlaneFront}>Aa<i>Aspekta 400</i></span>
    <span className={styles.designRule} />
  </div>;
}

function WebWorld({ language }: { language: Language }) {
  return <div className={styles.webWorld} aria-hidden="true">
    <div className={styles.codePlane}><i /><i /><i /><i /><i /></div>
    <div className={styles.browserWindow}>
      <div className={styles.browserChrome}><span>kreu.system</span><i /><i /></div>
      <div className={styles.browserContent}>
        <span>{language === "sq" ? "Përvojë digjitale" : "Digital experience"}</span>
        <strong>{language === "sq" ? "Qartësi që performon." : "Clarity that performs."}</strong>
        <i /><i /><i />
      </div>
    </div>
  </div>;
}

function MarketingWorld({ language }: { language: Language }) {
  return <div className={styles.marketingWorld} aria-hidden="true">
    <div className={styles.metricRow}>
      <span>{language === "sq" ? "Kërkim organik" : "Organic search"}<strong>68.4%</strong></span>
      <span>{language === "sq" ? "Relevancë" : "Relevance"}<strong>{language === "sq" ? "E lartë" : "High"}</strong></span>
    </div>
    <svg viewBox="0 0 380 150" className={styles.growthChart}>
      <path className={styles.chartShadow} d="M8 135 C64 131 78 112 123 116 C176 121 190 74 237 84 C282 93 302 45 372 18" />
      <path d="M8 135 C64 131 78 112 123 116 C176 121 190 74 237 84 C282 93 302 45 372 18" />
    </svg>
    <div className={styles.rankingRows}>
      <span><i>{language === "sq" ? "Synimi i kërkimit" : "Search intent"}</i><b>↑ 8</b></span>
      <span><i>{language === "sq" ? "Sinjali i tregut" : "Market signal"}</i><b>↑ 5</b></span>
      <span><i>{language === "sq" ? "Autoritet" : "Authority"}</i><b>↑ 3</b></span>
    </div>
  </div>;
}

function SoftwareWorld({ language }: { language: Language }) {
  return <div className={styles.softwareWorld} aria-hidden="true">
    <div className={styles.systemPlane}><span>{language === "sq" ? "Operacionet" : "Operations"}</span><i /><i /><i /></div>
    <div className={styles.appPhone}>
      <div className={styles.phoneTop}><span>OS</span><i /></div>
      <p>{language === "sq" ? "Sistemi aktiv" : "System active"}</p>
      <strong>24</strong>
      <small>{language === "sq" ? "procese në rrjedhë" : "live workflows"}</small>
      <div className={styles.phoneRows}><i /><i /><i /></div>
    </div>
    <div className={styles.productPlane}><span>API</span><strong>{language === "sq" ? "Lidhur" : "Connected"}</strong><i /></div>
  </div>;
}

function ServiceWorld({ serviceKey, language }: { serviceKey: Service["key"]; language: Language }) {
  if (serviceKey === "design") return <DesignWorld />;
  if (serviceKey === "web") return <WebWorld language={language} />;
  if (serviceKey === "marketing") return <MarketingWorld language={language} />;
  return <SoftwareWorld language={language} />;
}

function ServiceModule({ service, language, className, dimmed, active, onEnter, onLeave }: {
  service: Service;
  language: Language;
  className: string;
  dimmed: boolean;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return <article
    className={`${styles.serviceModule} ${className}${dimmed ? ` ${styles.moduleDimmed}` : ""}${active ? ` ${styles.moduleActive}` : ""}`}
    data-engine-module
    tabIndex={0}
    onMouseEnter={onEnter}
    onMouseLeave={onLeave}
    onFocus={onEnter}
    onBlur={onLeave}
  >
    <div className={styles.moduleSurface}>
      <header><h3>{service.title}</h3><span aria-hidden="true" /></header>
      <ServiceWorld serviceKey={service.key} language={language} />
      <footer><p>{service.lines[0]}<br />{service.lines[1]}</p><span>KREU / {service.key.toUpperCase()}</span></footer>
    </div>
  </article>;
}

function Core() {
  return <div className={styles.coreStage} data-engine-core aria-label="KREU">
    <div className={styles.coreReflection} aria-hidden="true" />
    <div className={styles.coreCube}>
      <div className={`${styles.cubeFace} ${styles.cubeFront}`}><span>KREU</span><i /></div>
      <div className={`${styles.cubeFace} ${styles.cubeBack}`} aria-hidden="true" />
      <div className={`${styles.cubeFace} ${styles.cubeRight}`} aria-hidden="true" />
      <div className={`${styles.cubeFace} ${styles.cubeLeft}`} aria-hidden="true" />
      <div className={`${styles.cubeFace} ${styles.cubeTop}`} aria-hidden="true" />
      <div className={`${styles.cubeFace} ${styles.cubeBottom}`} aria-hidden="true" />
    </div>
  </div>;
}

const desktopPaths = [
  "M350 218 C432 218 471 293 557 352",
  "M872 209 C794 218 746 290 643 352",
  "M348 573 C425 561 474 490 557 428",
  "M860 550 C786 543 731 474 643 428",
];

const mobilePaths = [
  "M50 9 C50 17 23 18 18 27",
  "M50 9 C50 27 78 30 82 43",
  "M50 9 C50 46 25 55 18 65",
  "M50 9 C50 63 77 75 82 84",
];

function Connections({ active }: { active: number | null }) {
  return <>
    <svg className={`${styles.connections} ${styles.desktopConnections}`} viewBox="0 0 1200 780" preserveAspectRatio="none" aria-hidden="true">
      {desktopPaths.map((path, index) => <g key={path} className={active === index ? styles.connectionActive : undefined}>
        <path d={path} pathLength="1" data-engine-path />
        <path d={path} pathLength="1" className={styles.signalPath} />
        <circle cx={index % 2 === 0 ? 557 : 643} cy={index < 2 ? 352 : 428} r="3" />
      </g>)}
    </svg>
    <svg className={`${styles.connections} ${styles.mobileConnections}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {mobilePaths.map((path, index) => <g key={path} className={active === index ? styles.connectionActive : undefined}><path d={path} pathLength="1" data-engine-path /><path d={path} pathLength="1" className={styles.signalPath} /></g>)}
    </svg>
  </>;
}

function BackgroundGeometry() {
  return <div className={styles.backgroundGeometry} aria-hidden="true"><i /><i /><i /><i /><span /><span /></div>;
}

export function Services() {
  const { language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const content = copy[language];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      if (reduced) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 84%", once: true },
        defaults: { ease: "power3.out", immediateRender: false },
      });
      timeline
        .from("[data-engine-header] > *", { y: 24, opacity: 0, duration: .72, stagger: .08 }, 0)
        .from("[data-engine-core]", { y: 18, scale: .82, opacity: 0, duration: .9 }, .28)
        .from("[data-engine-path]", { strokeDashoffset: 1, duration: 1.05, stagger: .08, ease: "power2.inOut" }, .52)
        .from("[data-engine-module]", { y: 26, scale: .965, opacity: 0, duration: .82, stagger: .12 }, .76)
        .from("[data-engine-result]", { y: 16, opacity: 0, duration: .62 }, 1.18);
    }, section);
    return () => context.revert();
  }, []);

  const renderModule = (index: number, positionClass: string) => <ServiceModule
    key={content.services[index].key}
    service={content.services[index]}
    language={language}
    className={positionClass}
    active={active === index}
    dimmed={active !== null && active !== index}
    onEnter={() => setActive(index)}
    onLeave={() => setActive(null)}
  />;

  return <section ref={sectionRef} className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
    <BackgroundGeometry />
    <div className={styles.inner}>
      <header className={styles.sectionHeader} data-engine-header>
        <div className={styles.headerMeta}><span>{content.eyebrow}</span><span>{content.aside}</span></div>
        <h2 id="services-title">{content.headline}</h2>
        <p>{content.subline}</p>
      </header>

      <div className={styles.engine} data-hovering={active !== null}>
        <Connections active={active} />
        <Core />
        {renderModule(0, styles.designModule)}
        {renderModule(1, styles.webModule)}
        {renderModule(2, styles.marketingModule)}
        {renderModule(3, styles.softwareModule)}
      </div>

      <div className={styles.result} data-engine-result>
        <div><i /><span>{content.resultLabel}</span><i /></div>
        <p>{content.result}</p>
      </div>
    </div>
  </section>;
}
