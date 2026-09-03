"use client";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BookingLink } from "@/components/booking/booking-provider";
import { useLanguage } from "@/components/language-provider";

import { type CSSProperties, type PointerEvent, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FragmentKind = "plane" | "strip" | "shard" | "frame";
type Fragment = {
  kind: FragmentKind;
  final: [number, number];
  from: [number, number];
  rotation: [number, number, number];
  depth: number;
  arc: number;
  opacity: number;
  start: number;
  quiet?: boolean;
};

const fragments: Fragment[] = [
  { kind: "plane", final: [-37, -23], from: [-78, -55], rotation: [10, 19, -8], depth: 48, arc: -7, opacity: .58, start: .02 },
  { kind: "strip", final: [-32, -7], from: [-82, -9], rotation: [-7, 27, -13], depth: 82, arc: 9, opacity: .48, start: .06 },
  { kind: "frame", final: [-39, 15], from: [-84, 46], rotation: [12, 22, 7], depth: 34, arc: -8, opacity: .46, start: .1 },
  { kind: "shard", final: [-24, -32], from: [-37, -79], rotation: [24, -17, 26], depth: 110, arc: 7, opacity: .38, start: .13 },
  { kind: "plane", final: [-27, 29], from: [-58, 76], rotation: [-13, 28, -5], depth: 66, arc: -10, opacity: .42, start: .17 },
  { kind: "shard", final: [-45, 2], from: [-91, 11], rotation: [18, 35, 17], depth: -10, arc: 6, opacity: .3, start: .2, quiet: true },
  { kind: "strip", final: [-14, -39], from: [-8, -84], rotation: [-18, 12, -7], depth: 72, arc: 6, opacity: .34, start: .21, quiet: true },
  { kind: "plane", final: [36, -25], from: [81, -58], rotation: [-11, -21, 9], depth: 58, arc: 8, opacity: .55, start: .04 },
  { kind: "frame", final: [39, -5], from: [87, -18], rotation: [14, -26, 12], depth: 96, arc: -9, opacity: .5, start: .08 },
  { kind: "strip", final: [34, 18], from: [79, 51], rotation: [-8, -24, -6], depth: 42, arc: 8, opacity: .47, start: .11 },
  { kind: "shard", final: [23, -34], from: [42, -82], rotation: [22, 16, -24], depth: 122, arc: -7, opacity: .36, start: .15 },
  { kind: "plane", final: [27, 31], from: [55, 82], rotation: [12, -31, 5], depth: 74, arc: 10, opacity: .45, start: .18 },
  { kind: "shard", final: [45, 8], from: [93, 20], rotation: [-17, -36, -15], depth: 4, arc: -6, opacity: .3, start: .22, quiet: true },
  { kind: "strip", final: [13, 39], from: [4, 86], rotation: [16, -14, 8], depth: 88, arc: -8, opacity: .34, start: .23, quiet: true },
];

const clamp = gsap.utils.clamp(0, 1);
const ease = (value: number) => value * value * (3 - 2 * value);
const ctaConfig = {
  desktop: { distance: .88, rotation: 1, depth: 1, blur: 2.1, from: 1, arc: 1 },
  tablet: { distance: .7, rotation: .55, depth: .45, blur: 1, from: .82, arc: .65 },
  mobile: { distance: .54, rotation: .22, depth: .12, blur: 0, from: .68, arc: .35 },
} as const;
const mobileFragments = new Set([0, 1, 2, 4, 7, 8, 9, 11]);

function GlassFragment({ fragment, index }: { fragment: Fragment; index: number }) {
  return (
    <i
      className={`magnetic-fragment magnetic-fragment--${fragment.kind}${fragment.quiet ? " magnetic-fragment--quiet" : ""}`}
      data-magnetic-fragment
      data-index={index}
      style={{ "--final-x": `${fragment.final[0]}vw`, "--final-y": `${fragment.final[1]}vh` } as CSSProperties}
    >
      <span className="magnetic-fragment__surface" />
      {(fragment.kind === "plane" || fragment.kind === "frame") && <span className="magnetic-fragment__trace" />}
    </i>
  );
}

export function FinalCTA() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const deviceStageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const visual = visualRef.current;
    const button = buttonRef.current;
    if (!section || !content || !visual || !button) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 1025px)",
          tablet: "(min-width: 768px) and (max-width: 1024px)",
          mobile: "(max-width: 767px)",
          short: "(max-height: 700px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        match => {
          const mode = match.conditions?.desktop ? "desktop" : match.conditions?.tablet ? "tablet" : "mobile";
          const config = ctaConfig[mode];
          const elements = gsap.utils.toArray<HTMLElement>("[data-magnetic-fragment]");
          const arcs = gsap.utils.toArray<SVGPathElement>(".magnetic-field__arcs path");
          const arcLengths = arcs.map(path => path.getTotalLength());
          const reduced = match.conditions?.reduced;
          const shouldPin = mode === "desktop" || !match.conditions?.short;
          let sceneHeight = section.clientHeight;
          const state = { progress: reduced ? 1 : 0 };

          const render = (progress: number) => {
            section.style.setProperty("--magnetic-progress", String(progress));
            section.style.setProperty("--magnetic-glow", String(.025 + progress * .045));
            elements.forEach((element, index) => {
              const spec = fragments[index];
              const visible = mode === "desktop" || (mode === "tablet" ? !spec.quiet : mobileFragments.has(index));
              if (!visible) {
                element.style.opacity = "0";
                return;
              }
              const local = ease(clamp((progress - spec.start) / (1 - spec.start)));
              const edge = mode === "mobile" ? 1.08 : 1;
              const finalX = spec.final[0] * edge;
              const finalY = spec.final[1] * (mode === "mobile" ? .92 : 1);
              const x = gsap.utils.interpolate(spec.from[0] * config.from, finalX, local);
              const y = gsap.utils.interpolate(spec.from[1] * config.from, finalY, local) + Math.sin(local * Math.PI) * spec.arc * config.arc;
              const bend = Math.sin(local * Math.PI * 1.15 + index * .73) * (1 - local) * 2.2 * config.rotation;
              const depth = (spec.depth * local - (1 - local) * 90) * config.depth;
              element.style.opacity = String(.01 + local * spec.opacity * (mode === "mobile" ? .72 : 1));
              element.style.filter = config.blur ? `blur(${(1 - local) * config.blur}px)` : "none";
              element.style.transform = `translate3d(${x}vw, ${y * sceneHeight / 100}px, ${depth}px) rotateX(${(spec.rotation[0] + (1 - local) * 38) * config.rotation}deg) rotateY(${spec.rotation[1] * config.rotation + bend * 5}deg) rotateZ(${spec.rotation[2] * config.rotation + bend}deg) scale(${.62 + local * .38})`;
            });

            arcs.forEach((path, index) => {
              const local = ease(clamp((progress - .08 - index * .025) / .74));
              path.style.strokeDasharray = String(arcLengths[index]);
              path.style.strokeDashoffset = String(arcLengths[index] * (1 - local));
              path.style.opacity = String(local * (mode === "desktop" ? .28 : mode === "tablet" ? .2 : .12));
            });

            const copyProgress = ease(clamp((progress - .14) / .44));
            const deviceProgress = ease(clamp((progress - .2) / .58));
            const buttonProgress = ease(clamp((progress - .48) / .25));
            gsap.set(content, {
              opacity: copyProgress,
              x: (mode === "desktop" ? -34 : 0) * (1 - copyProgress),
              y: (mode === "desktop" ? 8 : 18) * (1 - copyProgress),
            });
            gsap.set(visual, {
              opacity: deviceProgress,
              x: (mode === "desktop" ? 76 : 0) * (1 - deviceProgress),
              y: (mode === "desktop" ? 12 : 28) * (1 - deviceProgress),
              rotateX: (mode === "desktop" ? -3.5 : -1) * (1 - deviceProgress),
              rotateY: (mode === "desktop" ? 10 : 2) * (1 - deviceProgress),
              scale: .92 + deviceProgress * .08,
            });
            gsap.set(button, { opacity: buttonProgress, y: 12 * (1 - buttonProgress) });
          };

          render(state.progress);
          if (reduced) return;
          gsap.to(state, {
            progress: 1,
            ease: "none",
            onUpdate: () => render(state.progress),
            scrollTrigger: {
              trigger: section,
              start: shouldPin ? "top top" : "top 70%",
              end: shouldPin ? () => `+=${section.clientHeight * config.distance}` : "bottom bottom",
              scrub: mode === "mobile" ? .45 : .65,
              pin: shouldPin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => { sceneHeight = section.clientHeight; render(state.progress); },
            },
          });
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const handleFieldParallax = (event: PointerEvent<HTMLElement>) => {
    const field = fieldRef.current;
    const deviceStage = deviceStageRef.current;
    if (!field || !deviceStage || !window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const x = (event.clientX / window.innerWidth - .5) * 7;
    const y = (event.clientY / window.innerHeight - .5) * 5;
    field.style.setProperty("--field-x", `${x}px`);
    field.style.setProperty("--field-y", `${y}px`);
    deviceStage.style.setProperty("--device-rx", `${-y * .16}deg`);
    deviceStage.style.setProperty("--device-ry", `${x * .18}deg`);
    deviceStage.style.setProperty("--device-x", `${x * .38}px`);
    deviceStage.style.setProperty("--device-y", `${y * .32}px`);
  };

  const handleLens = (event: PointerEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    if (!button || event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const bounds = button.getBoundingClientRect();
    button.style.setProperty("--lens-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    button.style.setProperty("--lens-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <section
      ref={sectionRef}
      className="final-cta magnetic-cta"
      id="contact"
      aria-labelledby="contact-title"
      onPointerMove={handleFieldParallax}
      onPointerLeave={() => {
        fieldRef.current?.style.setProperty("--field-x", "0px");
        fieldRef.current?.style.setProperty("--field-y", "0px");
        deviceStageRef.current?.style.setProperty("--device-rx", "0deg");
        deviceStageRef.current?.style.setProperty("--device-ry", "0deg");
        deviceStageRef.current?.style.setProperty("--device-x", "0px");
        deviceStageRef.current?.style.setProperty("--device-y", "0px");
      }}
    >
      <div className="magnetic-cta__atmosphere" aria-hidden="true" />
      <div ref={fieldRef} className="magnetic-field" aria-hidden="true">
        <svg className="magnetic-field__arcs" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-80 690 C240 480 296 188 566 84" />
          <path d="M1520 650 C1220 468 1168 220 884 92" />
          <path d="M172 940 C318 748 442 715 570 692" />
          <path d="M1268 950 C1116 760 1002 726 870 700" />
        </svg>
        <div className="magnetic-field__depth">
          {fragments.map((fragment, index) => <GlassFragment key={index} fragment={fragment} index={index} />)}
        </div>
      </div>

      <div className="magnetic-cta__layout">
        <div ref={contentRef} className="final-cta__content magnetic-cta__content">
          <p className="final-cta__eyebrow">{t("For the next stage.")}</p>
          <h2 id="contact-title">{t("Make your business harder to ignore.")}</h2>
          <p className="final-cta__subline">{t("A considered digital presence designed to consolidate trust, increase relevance and open new opportunities for the business.")}</p>
          <BookingLink
            ref={buttonRef}
            className="final-cta__button magnetic-cta__button"
            onPointerMove={handleLens}
            onPointerLeave={() => {
              buttonRef.current?.style.setProperty("--lens-x", "50%");
              buttonRef.current?.style.setProperty("--lens-y", "20%");
            }}
            style={{ "--lens-x": "50%", "--lens-y": "20%" } as CSSProperties}
          >
            <span>{t("Book a discovery call")}</span><span aria-hidden="true"><ArrowIcon /></span>
          </BookingLink>
        </div>

        <div ref={visualRef} className="magnetic-cta__visual" aria-hidden="true">
          <div ref={deviceStageRef} className="magnetic-device">
            <div className="magnetic-device__plane magnetic-device__plane--rear">
              <img src="/cta/kreu-mobile-app.png" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="magnetic-device__plane magnetic-device__plane--front">
              <img src="/cta/kreu-mobile-app.png" alt="" loading="lazy" decoding="async" />
            </div>
            <span className="magnetic-device__contact-shadow" />
            <span className="magnetic-device__reflection" />
          </div>
        </div>
      </div>
    </section>
  );
}
