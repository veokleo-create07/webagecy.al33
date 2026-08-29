"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Side = "left" | "right";
type PlaneSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  ry: number;
  rz: number;
  z: number;
  start: number;
  kind: "frame" | "lines" | "aperture";
};

const planeSets: Record<Side, PlaneSpec[]> = {
  left: [
    { x: 5, y: 67, width: 16, height: 9, rx: 13, ry: 28, rz: -13, z: 24, start: .2, kind: "lines" },
    { x: 12, y: 49, width: 20, height: 13, rx: -8, ry: 34, rz: -8, z: 54, start: .31, kind: "frame" },
    { x: 20, y: 30, width: 14, height: 18, rx: 18, ry: 25, rz: 7, z: 78, start: .44, kind: "aperture" },
    { x: 27, y: 17, width: 11, height: 8, rx: -12, ry: 31, rz: 15, z: 34, start: .57, kind: "lines" },
    { x: 34, y: 9, width: 8, height: 12, rx: 20, ry: 18, rz: 22, z: 96, start: .66, kind: "frame" },
  ],
  right: [
    { x: 79, y: 70, width: 15, height: 11, rx: -16, ry: -31, rz: 12, z: 42, start: .18, kind: "aperture" },
    { x: 69, y: 53, width: 19, height: 10, rx: 11, ry: -28, rz: 8, z: 68, start: .3, kind: "lines" },
    { x: 66, y: 35, width: 13, height: 17, rx: -19, ry: -34, rz: -6, z: 28, start: .42, kind: "frame" },
    { x: 61, y: 20, width: 12, height: 9, rx: 14, ry: -24, rz: -16, z: 88, start: .54, kind: "aperture" },
    { x: 57, y: 8, width: 8, height: 13, rx: -18, ry: -18, rz: -23, z: 51, start: .65, kind: "lines" },
  ],
};

function InterfacePlane({ spec, side, index }: { spec: PlaneSpec; side: Side; index: number }) {
  const style = {
    "--plane-x": `${spec.x}%`,
    "--plane-y": `${spec.y}%`,
    "--plane-w": `${spec.width}vw`,
    "--plane-h": `${spec.height}vh`,
  } as CSSProperties;

  return (
    <div
      className={`matter-plane matter-plane--${side} matter-plane--${spec.kind}`}
      data-matter-plane
      data-side={side}
      data-start={spec.start}
      data-rx={spec.rx}
      data-ry={spec.ry}
      data-rz={spec.rz}
      data-z={spec.z}
      style={style}
    >
      <i className="matter-plane__edge" />
      <span className="matter-plane__index">K{index + 1}</span>
      <span className="matter-plane__line matter-plane__line--one" />
      <span className="matter-plane__line matter-plane__line--two" />
      <span className="matter-plane__line matter-plane__line--three" />
      {spec.kind === "aperture" && <span className="matter-plane__aperture" />}
    </div>
  );
}

function LightStructure({ side }: { side: Side }) {
  const left = side === "left";
  const path = left
    ? "M-20 865 C72 801 96 716 143 637 C194 551 201 458 259 362 C306 284 355 202 451 119"
    : "M1460 884 C1374 814 1341 733 1300 648 C1256 558 1245 472 1187 378 C1138 299 1085 219 989 126";
  const secondary = left
    ? "M37 806 C158 739 235 674 305 589 C356 527 392 469 443 414"
    : "M1408 822 C1301 762 1215 691 1144 604 C1099 549 1060 493 1006 444";

  return (
    <>
      <svg className={`matter-rails matter-rails--${side}`} viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <path className="matter-rail matter-rail--shadow" data-matter-rail d={path} />
        <path className="matter-rail matter-rail--body" data-matter-rail d={path} />
        <path className="matter-rail matter-rail--highlight" data-matter-rail d={path} />
        <path className="matter-rail matter-rail--secondary" data-matter-rail-secondary d={secondary} />
      </svg>
      {planeSets[side].map((spec, index) => <InterfacePlane key={`${side}-${index}`} spec={spec} side={side} index={index} />)}
    </>
  );
}

export function DigitalMatter() {
  return (
    <div className="digital-matter" aria-hidden="true">
      <LightStructure side="left" />
      <LightStructure side="right" />
      <div className="matter-focus matter-focus--left" />
      <div className="matter-focus matter-focus--right" />
    </div>
  );
}

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const rails = gsap.utils.toArray<SVGPathElement>("[data-matter-rail]");
      const secondaryRails = gsap.utils.toArray<SVGPathElement>("[data-matter-rail-secondary]");
      const planes = gsap.utils.toArray<HTMLElement>("[data-matter-plane]");
      const lengths = new Map<SVGPathElement, number>();
      const clamp = gsap.utils.clamp(0, 1);
      const smooth = (value: number) => value * value * (3 - 2 * value);
      const range = (progress: number, start: number, end: number) => smooth(clamp((progress - start) / (end - start)));

      [...rails, ...secondaryRails].forEach(path => {
        const length = path.getTotalLength();
        lengths.set(path, length);
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      const draw = (path: SVGPathElement, progress: number) => {
        path.style.strokeDashoffset = String((lengths.get(path) ?? 0) * (1 - progress));
      };

      const render = (progress: number) => {
        const railGrowth = range(progress, 0, .77);
        rails.forEach(path => draw(path, railGrowth));
        secondaryRails.forEach((path, index) => draw(path, range(progress, .17 + index * .025, .67 + index * .025)));

        planes.forEach((plane, index) => {
          const start = Number(plane.dataset.start);
          const local = range(progress, start, start + .29);
          const side = plane.dataset.side === "left" ? -1 : 1;
          const rx = Number(plane.dataset.rx);
          const ry = Number(plane.dataset.ry);
          const rz = Number(plane.dataset.rz);
          const z = Number(plane.dataset.z);
          const lens = Math.sin(local * Math.PI) * 3.5;
          const lag = Math.sin(progress * Math.PI * 1.4 + index * .7) * local * .8;
          plane.style.opacity = String(local * .94);
          plane.style.transform = `translate3d(${side * (1 - local) * 95}px, ${(1 - local) * 88 + lag}px, ${-180 * (1 - local) + z * local}px) rotateX(${62 * (1 - local) + rx * local}deg) rotateY(${side * 42 * (1 - local) + ry * local}deg) rotateZ(${side * 19 * (1 - local) + rz * local + lens * side}deg) scale(${.42 + local * .58})`;
          plane.style.filter = `blur(${(1 - local) * 3.5}px)`;
        });

        const contentProgress = range(progress, .18, .62);
        gsap.set(content, {
          opacity: .72 + contentProgress * .28,
          y: 14 * (1 - contentProgress),
          scale: .985 + contentProgress * .015,
        });

        gsap.set(".matter-focus--left", { opacity: range(progress, .48, .92) * .42, x: Math.sin(progress * Math.PI) * 7 });
        gsap.set(".matter-focus--right", { opacity: range(progress, .52, .94) * .36, x: -Math.sin(progress * Math.PI) * 6 });
      };

      const state = { progress: 0 };
      render(0);
      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * .96}`,
          scrub: .58,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="final-cta matter-cta" id="contact" aria-labelledby="contact-title">
      <div className="final-cta__atmosphere" aria-hidden="true">
        <div className="final-cta__light" /><div className="final-cta__depth" /><div className="final-cta__grain" /><div className="final-cta__vignette" />
      </div>
      <DigitalMatter />
      <div ref={contentRef} className="final-cta__content matter-cta__content">
        <h2 id="contact-title">Premium websites that move businesses forward.</h2>
        <p className="final-cta__subline">Strategy, design and development crafted to turn strong businesses into stronger digital brands.</p>
        <a className="final-cta__button" href="mailto:hello@kreuweb.com"><span>Book a call</span><span aria-hidden="true">↗</span></a>
      </div>
    </section>
  );
}
