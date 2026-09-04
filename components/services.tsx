"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { BookingLink } from "@/components/booking/booking-provider";
import { useLanguage } from "@/components/language-provider";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { Language } from "@/lib/localization";
import styles from "./services.module.css";

type Service = { name: string; headline: string; subline: string; benefits: string[] };

const serviceCopy: Record<Language, { headline: string; intro: string; services: Service[] }> = {
  en: {
    headline: "Five disciplines. One considered system.",
    intro: "From positioning to product, every discipline serves the same result: a business with greater authority and momentum.",
    services: [
      { name: "Strategy & Design", headline: "Own a position the market can recognize.", subline: "We turn ambition into a clear identity and a design system that makes every touchpoint feel deliberate.", benefits: ["Sharper market positioning", "A coherent visual language", "Decisions grounded in business value"] },
      { name: "Web Development", headline: "Make credibility tangible.", subline: "Fast, refined digital experiences that give people confidence in the business from the first interaction.", benefits: ["High performance by default", "Purposeful interaction design", "Scalable, maintainable foundations"] },
      { name: "Marketing", headline: "Turn attention into qualified demand.", subline: "Focused campaigns and content systems designed to reach the right audience with a reason to respond.", benefits: ["A precise campaign narrative", "Creative built for each channel", "Clear paths from interest to action"] },
      { name: "SEO", headline: "Be present when intent is highest.", subline: "Search strategy that compounds visibility, relevance and trust where your audience is already looking.", benefits: ["Demand-led search strategy", "Technical clarity and structure", "Sustained organic relevance"] },
      { name: "Software & Apps", headline: "Build the system the business can grow on.", subline: "Considered software that removes friction, strengthens operations and creates room for the next stage.", benefits: ["Workflows shaped around the business", "Intuitive product experiences", "Architecture built to evolve"] },
    ],
  },
  sq: {
    headline: "Pesë disiplina. Një sistem i menduar.",
    intro: "Nga pozicionimi te produkti, çdo disiplinë i shërben të njëjtit rezultat: një biznesi me më shumë autoritet dhe ritëm.",
    services: [
      { name: "Strategji & Dizajn", headline: "Krijo një pozicion që tregu e dallon.", subline: "Ambicien e kthejmë në identitet të qartë dhe në një sistem dizajni ku çdo pikë kontakti ndihet e menduar.", benefits: ["Pozicionim më i dallueshëm", "Gjuhë vizuale koherente", "Vendime me vlerë për biznesin"] },
      { name: "Web Development", headline: "Ktheje besueshmërinë në përvojë.", subline: "Përvoja digjitale të shpejta dhe të kuruara që krijojnë siguri për biznesin që në kontaktin e parë.", benefits: ["Performancë e lartë", "Ndërveprime me qëllim", "Bazë teknike e shkallëzueshme"] },
      { name: "Marketing", headline: "Ktheje vëmendjen në kërkesë reale.", subline: "Fushata dhe sisteme përmbajtjeje që arrijnë audiencën e duhur dhe i japin arsye për të vepruar.", benefits: ["Narrativë e qartë e fushatës", "Creative për çdo kanal", "Rrugë e qartë drejt veprimit"] },
      { name: "SEO", headline: "Ji i pranishëm kur kërkesa ka peshë.", subline: "Strategji kërkimi që ndërton dukshmëri, relevancë dhe besim aty ku audienca juaj tashmë po kërkon.", benefits: ["Strategji e bazuar në kërkesë", "Strukturë teknike e qartë", "Relevancë organike afatgjatë"] },
      { name: "Software & Aplikacione", headline: "Ndërto sistemin mbi të cilin rritet biznesi.", subline: "Software i menduar për të hequr pengesat, për të forcuar operacionet dhe për t’i hapur rrugë etapës së radhës.", benefits: ["Procese sipas mënyrës si punon biznesi", "Përvoja produkti intuitive", "Arkitekturë e ndërtuar për të evoluar"] },
    ],
  },
};

function StrategyVisual({ language }: { language: Language }) {
  return <div className={`${styles.visualCanvas} ${styles.strategyVisual}`}>
    <div className={styles.canvasMeta}><span>{language === "sq" ? "Pozicionim" : "Positioning"}</span><span>KR / SYSTEM</span></div>
    <div className={styles.strategyWord}>{language === "sq" ? "Qartësi" : "Clarity"}</div>
    <div className={styles.strategyGrid} aria-hidden="true" />
    <div className={styles.strategyNote}><span>{language === "sq" ? "Ideja qendrore" : "Central idea"}</span><strong>{language === "sq" ? "Një identitet që mban peshë." : "An identity with consequence."}</strong></div>
    <div className={styles.strategyMark} aria-hidden="true"><i /><i /><i /></div>
  </div>;
}

function WebVisual({ language }: { language: Language }) {
  return <div className={`${styles.visualCanvas} ${styles.webVisual}`}>
    <div className={styles.browserBar}><span>KREU / BUILD</span><span>{language === "sq" ? "Në zhvillim" : "In development"}</span></div>
    <div className={styles.webHero}><span>{language === "sq" ? "Përvojë digjitale" : "Digital experience"}</span><strong>{language === "sq" ? "E qartë në çdo pikë." : "Clear at every point."}</strong></div>
    <div className={styles.webMedia} aria-hidden="true"><span /><span /></div>
    <div className={styles.webFooter}><span>Performance</span><span>Interaction</span><span>Scale</span></div>
  </div>;
}

function MarketingVisual({ language }: { language: Language }) {
  return <div className={`${styles.visualCanvas} ${styles.marketingVisual}`}>
    <div className={styles.canvasMeta}><span>{language === "sq" ? "Fushata" : "Campaign"}</span><span>LIVE</span></div>
    <div className={styles.campaignStatement}><span>{language === "sq" ? "Vëmendje" : "Attention"}</span><strong>{language === "sq" ? "me drejtim." : "with direction."}</strong></div>
    <div className={styles.campaignRail} aria-hidden="true"><i /><i /><i /><i /></div>
    <div className={styles.campaignDetails}>
      <span>{language === "sq" ? "Mesazhi" : "Message"}<b>{language === "sq" ? "I fokusuar" : "Focused"}</b></span>
      <span>{language === "sq" ? "Audienca" : "Audience"}<b>{language === "sq" ? "E përcaktuar" : "Defined"}</b></span>
      <span>{language === "sq" ? "Veprimi" : "Action"}<b>{language === "sq" ? "I matshëm" : "Measurable"}</b></span>
    </div>
  </div>;
}

function SeoVisual({ language }: { language: Language }) {
  const terms = language === "sq" ? ["Kërkesë me qëllim", "Relevancë në treg", "Autoritet organik"] : ["High intent demand", "Market relevance", "Organic authority"];
  return <div className={`${styles.visualCanvas} ${styles.seoVisual}`}>
    <div className={styles.searchHeader}><span>{language === "sq" ? "Dukshmëria në kërkim" : "Search visibility"}</span><i aria-hidden="true" /></div>
    <div className={styles.searchResults}>{terms.map((term, index) => <div key={term}><span>{term}</span><b>{String(index + 1).padStart(2, "0")}</b></div>)}</div>
    <svg className={styles.searchGraph} viewBox="0 0 520 180" role="img" aria-label={language === "sq" ? "Grafik i relevancës organike" : "Organic relevance chart"}>
      <path d="M8 157 C78 151 103 128 159 133 C220 139 235 85 301 96 C358 105 391 48 510 25" />
      <path className={styles.graphShadow} d="M8 167 C78 161 103 138 159 143 C220 149 235 95 301 106 C358 115 391 58 510 35" />
    </svg>
    <div className={styles.graphCaption}><span>{language === "sq" ? "Relevancë organike" : "Organic relevance"}</span><span>{language === "sq" ? "Në rritje" : "Compounding"}</span></div>
  </div>;
}

function SoftwareVisual({ language }: { language: Language }) {
  return <div className={`${styles.visualCanvas} ${styles.softwareVisual}`}>
    <div className={styles.productShell}>
      <aside><strong>OS</strong><i /><i /><i /><i /></aside>
      <div className={styles.productMain}><div className={styles.productHeader}><span>{language === "sq" ? "Operacionet" : "Operations"}</span><b>{language === "sq" ? "Sistemi aktiv" : "System active"}</b></div><div className={styles.productMetric}><span>{language === "sq" ? "Rrjedha e punës" : "Workflow health"}</span><strong>96.4%</strong></div><div className={styles.productRows} aria-hidden="true"><i /><i /><i /></div></div>
    </div>
    <div className={styles.mobileProduct}><span>OS</span><strong>{language === "sq" ? "Në kontroll" : "In control"}</strong><i /><i /><i /></div>
  </div>;
}

const visuals = [StrategyVisual, WebVisual, MarketingVisual, SeoVisual, SoftwareVisual];

function ServiceDetails({ service, reducedMotion }: { service: Service; reducedMotion: boolean }) {
  return <motion.div className={styles.details} initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -12 }} transition={{ duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}>
    <p className={styles.activeName}>{service.name}</p><h3>{service.headline}</h3><p className={styles.serviceSubline}>{service.subline}</p><ul>{service.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul>
  </motion.div>;
}

function ServiceVisual({ index, language, reducedMotion }: { index: number; language: Language; reducedMotion: boolean }) {
  const Visual = visuals[index];
  return <motion.div className={styles.visualFrame} initial={reducedMotion ? false : { opacity: 0, scale: 0.975, x: 22, rotateY: -2.5 }} animate={{ opacity: 1, scale: 1, x: 0, rotateY: 0 }} exit={reducedMotion ? undefined : { opacity: 0, scale: 0.988, x: -12, rotateY: 1.5 }} transition={{ duration: reducedMotion ? 0 : 0.58, ease: [0.22, 1, 0.36, 1] }}><Visual language={language} /></motion.div>;
}

export function Services() {
  const { language, t } = useLanguage();
  const copy = serviceCopy[language];
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (window.innerWidth <= 768 || reducedMotion) return;
    const next = Math.min(copy.services.length - 1, Math.floor(Math.min(value, 0.9999) * copy.services.length));
    setActive(current => current === next ? current : next);
  });

  const selectService = (index: number) => {
    setActive(index);
    if (window.innerWidth <= 768 || reducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const travel = Math.max(0, sectionRef.current.offsetHeight - window.innerHeight);
    window.scrollTo({ top: sectionTop + travel * ((index + 0.18) / copy.services.length), behavior: "smooth" });
  };

  return <section ref={sectionRef} className={`services ${styles.root}`} id="expertise" aria-labelledby="services-title">
    <div className={styles.desktopStage}><div className={styles.stickyStage}><div className={styles.layout}>
      <div className={styles.content}>
        <p className={styles.eyebrow}>{t("Services")}</p><h2 id="services-title">{copy.headline}</h2><p className={styles.intro}>{copy.intro}</p>
        <nav className={styles.selector} aria-label={t("Services")}>{copy.services.map((service, index) => <button key={service.name} type="button" className={index === active ? styles.selectorActive : undefined} aria-pressed={index === active} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => selectService(index)}><span>{service.name}</span><i aria-hidden="true" /></button>)}</nav>
        <div className={styles.detailsSlot} aria-live="polite"><AnimatePresence initial={false}><ServiceDetails key={`${language}-${active}`} service={copy.services[active]} reducedMotion={reducedMotion} /></AnimatePresence></div>
        <BookingLink className={styles.cta}><span>{t("Book a discovery call")}</span><ArrowIcon /></BookingLink>
      </div>
      <div className={styles.visualColumn} aria-hidden="true"><div className={styles.visualAmbient}><i /><i /><i /></div><AnimatePresence initial={false}><ServiceVisual key={`${language}-${active}`} index={active} language={language} reducedMotion={reducedMotion} /></AnimatePresence><div className={styles.visualIndex}><span>{copy.services[active].name}</span><span>KREU WEB</span></div></div>
    </div></div></div>

    <div className={styles.mobileStage}>
      <header className={styles.mobileHeader}><p className={styles.eyebrow}>{t("Services")}</p><h2>{copy.headline}</h2><p>{copy.intro}</p></header>
      <div className={styles.mobileList}>{copy.services.map((service, index) => { const Visual = visuals[index]; return <motion.article key={service.name} className={styles.mobileService} initial={reducedMotion ? false : { opacity: 0.65, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}><div className={styles.mobileVisual} aria-hidden="true"><Visual language={language} /></div><p className={styles.activeName}>{service.name}</p><h3>{service.headline}</h3><p className={styles.serviceSubline}>{service.subline}</p><ul>{service.benefits.map(benefit => <li key={benefit}>{benefit}</li>)}</ul></motion.article>; })}</div>
      <BookingLink className={`${styles.cta} ${styles.mobileCta}`}><span>{t("Book a discovery call")}</span><ArrowIcon /></BookingLink>
    </div>
  </section>;
}
