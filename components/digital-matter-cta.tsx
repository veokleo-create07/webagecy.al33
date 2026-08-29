"use client";

import dynamic from "next/dynamic";
import { type CSSProperties, type MutableRefObject, type PointerEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const GlassCityScene = dynamic<{ progressRef: MutableRefObject<number> }>(
  () => import("@/components/glass-city-scene"),
  { ssr: false, loading: () => <div className="glass-city-loading" aria-hidden="true" /> },
);

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const progressRef = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(media.matches);
      if (media.matches) progressRef.current = 1;
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const state = { progress: 0 };
      gsap.set(content, { opacity: .52, y: 18, scale: .985 });
      gsap.to(state, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          progressRef.current = state.progress;
          const clarity = gsap.utils.clamp(0, 1, (state.progress - .14) / .64);
          const eased = clarity * clarity * (3 - 2 * clarity);
          gsap.set(content, { opacity: .52 + eased * .48, y: 18 * (1 - eased), scale: .985 + eased * .015 });
        },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * .98}`,
          scrub: .72,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);
    return () => context.revert();
  }, [reducedMotion]);

  const handleLens = (event: PointerEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    if (!button) return;
    const bounds = button.getBoundingClientRect();
    button.style.setProperty("--lens-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    button.style.setProperty("--lens-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <section ref={sectionRef} className="final-cta city-cta" id="contact" aria-labelledby="contact-title">
      <div className="city-cta__atmosphere" aria-hidden="true" />
      <div className="city-cta__scene" aria-hidden="true">
        {reducedMotion ? (
          <div className="glass-city-fallback">
            <i className="glass-city-fallback__horizon" />
            <i className="glass-city-fallback__river" />
            <i className="glass-city-fallback__left" />
            <i className="glass-city-fallback__right" />
          </div>
        ) : <GlassCityScene progressRef={progressRef} />}
      </div>
      <div ref={contentRef} className="final-cta__content city-cta__content" data-final-reveal>
        <h2 id="contact-title">Built for where your<br />business is going next.</h2>
        <p className="final-cta__subline">High-end digital experiences designed to create trust, momentum and growth.</p>
        <a
          ref={buttonRef}
          className="final-cta__button city-cta__button"
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
