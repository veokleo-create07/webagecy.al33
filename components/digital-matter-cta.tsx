"use client";

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
  const sectionRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-magnetic-fragment]");
      const arcs = gsap.utils.toArray<SVGPathElement>(".magnetic-field__arcs path");
      const arcLengths = arcs.map(path => path.getTotalLength());
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const state = { progress: reduced ? 1 : 0 };

      const render = (progress: number) => {
        section.style.setProperty("--magnetic-progress", String(progress));
        section.style.setProperty("--magnetic-glow", String(.025 + progress * .045));
        const mobile = window.innerWidth < 768;
        elements.forEach((element, index) => {
          const spec = fragments[index];
          const local = ease(clamp((progress - spec.start) / (1 - spec.start)));
          const finalX = spec.final[0] * (mobile ? 1.08 : 1);
          const finalY = spec.final[1] * (mobile ? .94 : 1);
          const x = gsap.utils.interpolate(spec.from[0], finalX, local);
          const y = gsap.utils.interpolate(spec.from[1], finalY, local) + Math.sin(local * Math.PI) * spec.arc;
          const bend = Math.sin(local * Math.PI * 1.15 + index * .73) * (1 - local) * 2.2;
          const blur = (1 - local) * (mobile ? .7 : 2.1);
          const depth = spec.depth * local - (1 - local) * 120;
          element.style.opacity = String((.012 + local * spec.opacity) * (mobile && spec.quiet ? 0 : 1));
          element.style.filter = `blur(${blur}px)`;
          element.style.transform = `translate3d(${x}vw, ${y}vh, ${depth}px) rotateX(${spec.rotation[0] + (1 - local) * 42}deg) rotateY(${spec.rotation[1] + (1 - local) * bend * 6}deg) rotateZ(${spec.rotation[2] + bend}deg) scale(${.54 + local * .46})`;
        });

        arcs.forEach((path, index) => {
          const local = ease(clamp((progress - .08 - index * .025) / .74));
          path.style.strokeDasharray = String(arcLengths[index]);
          path.style.strokeDashoffset = String(arcLengths[index] * (1 - local));
          path.style.opacity = String(local * (mobile ? .18 : .28));
        });

        const clarity = ease(clamp((progress - .1) / .7));
        gsap.set(content, {
          opacity: .5 + clarity * .5,
          y: 16 * (1 - clarity),
          scale: .987 + clarity * .013,
        });
      };

      render(state.progress);
      if (reduced) return;

      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => render(state.progress),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * .92}`,
          scrub: .68,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: self => render(self.progress),
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  const handleFieldParallax = (event: PointerEvent<HTMLElement>) => {
    const field = fieldRef.current;
    if (!field || window.innerWidth < 768) return;
    const x = (event.clientX / window.innerWidth - .5) * 7;
    const y = (event.clientY / window.innerHeight - .5) * 5;
    field.style.setProperty("--field-x", `${x}px`);
    field.style.setProperty("--field-y", `${y}px`);
  };

  const handleLens = (event: PointerEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    if (!button) return;
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

      <div ref={contentRef} className="final-cta__content magnetic-cta__content" data-final-reveal>
        <p className="final-cta__eyebrow">Ready to build?</p>
        <h2 id="contact-title">Premium websites that move businesses forward.</h2>
        <p className="final-cta__subline">Strategy, design and development crafted to turn strong businesses into stronger digital brands.</p>
        <a
          ref={buttonRef}
          className="final-cta__button magnetic-cta__button"
          href="mailto:hello@kreuweb.com"
          onPointerMove={handleLens}
          onPointerLeave={() => {
            buttonRef.current?.style.setProperty("--lens-x", "50%");
            buttonRef.current?.style.setProperty("--lens-y", "20%");
          }}
          style={{ "--lens-x": "50%", "--lens-y": "20%" } as CSSProperties}
        >
          <span>Book a call</span><span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
