"use client";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BookingLink } from "@/components/booking/booking-provider";
import { useLanguage } from "@/components/language-provider";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./selected-work.module.css";
import conceptStyles from "./project-concepts.module.css";
import appStyles from "./mobile-app-concept.module.css";

const projects = [
  {
    slug: "nova",
    name: "Park & Stone",
    category: "Residential Real Estate",
    description: "A refined digital experience for modern residential developments.",
  },
  {
    slug: "maison",
    name: "Still",
    category: "Mobile App / Software",
    description: "A considered mobile app concept for focused work, daily planning, and a little more clarity.",
  },
  {
    slug: "lume",
    name: "Westside Aesthetics",
    category: "Med Spa",
    description: "A calm, clinically precise experience for modern aesthetic care.",
  },
  {
    slug: "noir",
    name: "The Oak House",
    category: "Hospitality",
    description: "A cinematic reservation experience built around appetite and atmosphere.",
  },
  {
    slug: "velor",
    name: "First Class Rentals",
    category: "Car Rental",
    description: "A booking experience engineered around performance and exceptional cars.",
  },
] as const;

function NovaConcept() {
  const { t } = useLanguage();
  return (
    <div className="demo-concept-site demo-concept-nova">
      <img loading="lazy" decoding="async" src="/portfolio/nova-detail.jpg" alt={t("Contemporary luxury residence architecture")} />
      <div className="demo-concept-shade" />
      <header><b>Park &amp; Stone</b><nav><span>{t("Residences")}</span><span>{t("Architecture")}</span><span>{t("Neighbourhood")}</span></nav><span>{t("Private viewings")} <ArrowIcon inline /></span></header>
      <div className="demo-nova-hero"><p>{t("Private residences · Tirana")}</p><h3>{t("Life, framed")}<br />{t("by architecture.")}</h3><span>{t("Explore availability")} <ArrowIcon direction="down-right" inline /></span></div>
      <div className="demo-nova-detail"><img loading="lazy" decoding="async" src="/portfolio/nova-main.jpg" alt="" /><span>{t("Residence 04")}<br />{t("Three bedrooms · 186 m²")}</span></div>
      <div className="demo-nova-status"><span>{t("Now selling")}</span><span>{t("Completion · Autumn 2027")}</span></div>
    </div>
  );
}

function StillConcept() {
  const { t } = useLanguage();
  return (
    <div className={appStyles.scene}>
      <img
        className={appStyles.image}
        src="/portfolio/still-app.webp"
        srcSet="/portfolio/still-app-small.webp 640w, /portfolio/still-app.webp 1536w"
        sizes="auto, (max-width: 768px) 100vw, 90vw"
        width={1536}
        height={1024}
        alt={t("Still focus and planning app on a graphite smartphone in a softly lit charcoal workspace")}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

function LumeConcept() {
  const { t } = useLanguage();
  return (
    <div className="demo-concept-site demo-concept-lume">
      <header><b>Westside°</b><nav><span>{t("Treatments")}</span><span>{t("Doctors")}</span><span>{t("Philosophy")}</span></nav><span>{t("Book a consultation")} <ArrowIcon inline /></span></header>
      <div className="demo-lume-copy"><span>{t("Skin intelligence · Tirana")}</span><h3>{t("Results you see.")}<br /><i>{t("Restraint you feel.")}</i></h3><p>{t("Aesthetic medicine led by doctors and designed around skin health, natural expression and lasting confidence.")}</p><b>{t("Meet your skin")} <ArrowIcon direction="right" inline /></b></div>
      <div className="demo-lume-main"><img loading="lazy" decoding="async" src="/portfolio/lume-portrait.jpg" alt={t("Portrait focused on natural skin")} /></div>
      <div className="demo-lume-detail"><img loading="lazy" decoding="async" src="/portfolio/lume-detail.jpg" alt="" /><span>{t("Precision peel")}<br />{t("45 min · From €120")}</span></div>
    </div>
  );
}

function NoirConcept() {
  const { t } = useLanguage();
  return (
    <div className="demo-concept-site demo-concept-noir">
      <img loading="lazy" decoding="async" className="demo-noir-image" src="/portfolio/noir-main-2.jpg" alt={t("Contemporary fine dining room")} />
      <div className="demo-concept-shade" />
      <header><span>{t("Menu   Cellar   Story")}</span><b>The Oak House</b><span>{t("Reserve a table")} <ArrowIcon inline /></span></header>
      <div className="demo-noir-copy"><p>{t("Tirana · Dinner, Tuesday—Sunday")}</p><h3>{t("The night")}<br /><i>{t("has a flavour.")}</i></h3><span>{t("Discover the menu")} <ArrowIcon direction="right" inline /></span></div>
      <div className="demo-noir-detail"><img loading="lazy" decoding="async" src="/portfolio/noir-main.jpg" alt="" /><span>{t("Chef’s table")}<br />{t("Eight seasonal courses")}</span></div>
      <div className="demo-noir-hours"><span>{t("Rruga e Durrësit, Tirana")}</span><span>{t("From 18:30 until late")}</span></div>
    </div>
  );
}

function VelorConcept() {
  const { t } = useLanguage();
  return (
    <div className="demo-concept-site demo-concept-velor">
      <img loading="lazy" decoding="async" className="demo-velor-image" src="/portfolio/velor-main.jpg" alt={t("Black performance car in motion")} />
      <div className="demo-concept-shade" />
      <header><b>First Class Rentals</b><nav><span>{t("Fleet")}</span><span>{t("Membership")}</span><span>{t("Destinations")}</span></nav><span>{t("Reserve")} <ArrowIcon inline /></span></header>
      <div className="demo-velor-copy"><p>{t("Porsche Panamera Turbo · Tirana")}</p><h3>{t("Performance,")}<br />{t("on your terms.")}</h3><span>{t("Configure your drive")} <ArrowIcon direction="right" inline /></span></div>
      <div className="demo-velor-specs"><span>550 PS</span><span>0—100 · 3.8 sec</span><span>{t("From €680 / day")}</span><span>{t("24 / 7 concierge")}</span></div>
      <div className="demo-velor-detail"><img loading="lazy" decoding="async" src="/portfolio/velor-detail-2.jpg" alt="" /><span>{t("Also available")}<br />Bugatti Chiron</span></div>
    </div>
  );
}

const concepts = {
  nova: NovaConcept,
  maison: StillConcept,
  lume: LumeConcept,
  noir: NoirConcept,
  velor: VelorConcept,
};

function RentalMotion({ suspended }: { suspended: boolean }) {
  const { t } = useLanguage();
  const scene = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = scene.current;
    if (!element) return;
    let intersecting = false;
    const update = () => setVisible(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      update();
    }, { threshold: .05 });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <div ref={scene} className={styles.motion} data-playing={visible && !paused && !suspended}>
      <div className={styles.motionScene} aria-hidden="true">
        <img className={styles.motionCar} src="/portfolio/velor-main.jpg" alt="" loading="lazy" decoding="async" />
        <span className={styles.motionBrand}>First Class / Rentals</span>
        <div className={styles.motionType}>{t("First class.")}<br /><i>{t("Every mile.")}</i></div>
        <div className={styles.motionRail}><span /></div>
        <div className={styles.motionInterface}>
          <span>{t("Your next drive")}</span><span>{t("Explore the fleet")} <ArrowIcon inline /></span>
        </div>
      </div>
      <button
        className={styles.pause}
        type="button"
        aria-label={t(paused ? "Play First Class motion" : "Pause First Class motion")}
        aria-pressed={paused}
        onClick={() => setPaused(value => !value)}
      >
        <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
      </button>
    </div>
  );
}

export function SelectedWork() {
  const { t } = useLanguage();
  const showcase = useRef<HTMLElement>(null);
  const [active, setActive] = useState<(typeof projects)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const ActiveConcept = active ? concepts[active.slug] : null;

  useEffect(() => {
    const section = showcase.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      desktop: "(min-width: 1025px) and (hover: hover) and (pointer: fine)",
      compact: "(max-width: 1024px), (hover: none), (pointer: coarse)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, context => {
      if (context.conditions?.reduced) return;
      const desktop = Boolean(context.conditions?.desktop);
      const frames = section.querySelectorAll<HTMLElement>(`[data-exhibit]`);
      frames.forEach((frame, index) => {
        const featured = index === 0;
        // Scroll owns the exhibit; hover owns its inner surface. Neither can
        // overwrite the other's transforms, including during breakpoint changes.
        gsap.fromTo(frame, {
          y: desktop ? (featured ? 44 : 24 + index * 3) : (featured ? 16 : 10),
          scale: featured ? (desktop ? .965 : .99) : 1,
          rotationX: desktop && featured ? 2.5 : 0,
          rotationY: desktop && !featured ? (index % 2 ? 1.2 : -1.2) : 0,
          transformPerspective: desktop ? 1600 : 0,
          opacity: desktop ? .45 : .7,
        }, {
          y: 0, scale: 1, rotationX: 0, rotationY: 0, opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: desktop ? section : frame,
            start: desktop ? `top ${92 - index * 2}%` : "top 96%",
            end: desktop ? `top ${30 + index * 3}%` : "top 72%",
            scrub: desktop ? .55 : .2,
            invalidateOnRefresh: true,
          },
        });
      });
      if (desktop) {
        section.querySelectorAll<HTMLElement>(`[data-image-depth]`).forEach((layer, index) => {
          gsap.fromTo(layer, { yPercent: index === 0 ? -1.2 : -.6 }, {
            yPercent: index === 0 ? 1.2 : .6,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: .65 },
          });
        });
      }
    }, section);
    return () => media.revert();
  }, []);

  useEffect(() => {
    if (!active || !dialog.current) return;
    const modal = dialog.current;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    modal.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      modal.close();
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [active]);

  return (
    <section ref={showcase} className={styles.showcase} id="work" aria-label={t("Selected website concepts")}>
      <div className={styles.composition}>
        {projects.map((project, index) => {
          const Concept = concepts[project.slug];
          return (
            <article
              className={`${styles.project} ${styles[project.slug]} ${index === 0 ? styles.featured : ""}`}
              key={project.slug}
              data-exhibit
              onPointerMove={event => {
                if (event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                event.currentTarget.style.setProperty("--tilt-x", `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 2.4}deg`);
                event.currentTarget.style.setProperty("--tilt-y", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 3}deg`);
              }}
              onPointerLeave={event => {
                event.currentTarget.style.setProperty("--tilt-x", "0deg");
                event.currentTarget.style.setProperty("--tilt-y", "0deg");
              }}
            >
              <div className={styles.surface}>
                <div className={styles.media} aria-hidden={index === 4 ? undefined : true}>
                  {index === 4 ? <RentalMotion suspended={Boolean(active)} /> : (
                    <div className={styles.mediaZoom}>
                      <div className={styles.mediaDepth} data-image-depth>
                        <div className={conceptStyles.preview}><Concept /></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.caption}>
                  <h3 id={`work-${project.slug}`}>{project.name}</h3>
                  <p id={`category-${project.slug}`}>{t(project.category)}</p>
                </div>
                <button
                  className={styles.projectTrigger}
                  type="button"
                  aria-label={`${t("Preview")} ${project.name}, ${t(project.category)}`}
                  aria-haspopup="dialog"
                  onClick={event => {
                    trigger.current = event.currentTarget;
                    setActive(project);
                  }}
                >
                  <span className={styles.view} aria-hidden="true"><ArrowIcon /></span>
                </button>
              </div>
            </article>
          );
        })}
        <BookingLink className={styles.callTile}>
          <span className={styles.callEyebrow}>{t("Your next chapter")}</span>
          <span className={styles.callLabel}>{t("Book a discovery call")} <span aria-hidden="true"><ArrowIcon /></span></span>
        </BookingLink>
      </div>

      <dialog
        ref={dialog}
        className={styles.modal}
        aria-labelledby="project-preview-title"
        aria-describedby="project-preview-description"
        onClose={() => setActive(null)}
        onKeyDown={event => {
          if (event.key === "Escape") {
            event.preventDefault();
            dialog.current?.close();
          }
        }}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
      >
        {active && ActiveConcept && (
          <>
            <div className={styles.modalHeader}>
              <div>
                <p>{t(active.category)} · {t("Design concept")}</p>
                <h2 id="project-preview-title">{active.name}</h2>
              </div>
              <button ref={closeButton} className={styles.close} type="button" onClick={() => dialog.current?.close()}>
                {t("Close")} <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className={styles.modalMedia} aria-hidden="true">
              <div className={conceptStyles.preview}><ActiveConcept /></div>
            </div>
            <p className={styles.modalDescription} id="project-preview-description">{t(active.description)}</p>
          </>
        )}
      </dialog>
    </section>
  );
}
