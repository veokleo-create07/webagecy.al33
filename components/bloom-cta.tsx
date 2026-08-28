"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function BloomCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [videoAvailable, setVideoAvailable] = useState(true);

  useEffect(() => {
    const section = sectionRef.current;
    const leftVideo = leftVideoRef.current;
    const rightVideo = rightVideoRef.current;
    const content = contentRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!section || !leftVideo || !rightVideo || !content || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    let cleanup: (() => void) | undefined;
    let fallbackCleanup: (() => void) | undefined;

    const setup = () => {
      const duration = Math.min(leftVideo.duration || 0, rightVideo.duration || leftVideo.duration || 0);
      if (!duration || !Number.isFinite(duration)) return;

      const state = { progress: 0 };
      const context = gsap.context(() => {
        gsap.set([leftVideo, rightVideo], { opacity: 1 });
        gsap.set(".bloom-cta__fallback", { opacity: 0 });

        gsap.to(state, {
          progress: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=180%",
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
          },
          onUpdate: () => {
            const time = state.progress * duration;
            if (!Number.isFinite(time)) return;
            leftVideo.currentTime = time;
            rightVideo.currentTime = time;
          },
        });

        gsap.fromTo(
          leftVideo,
          { xPercent: -15, yPercent: 16, rotate: -4, scale: 0.9 },
          {
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "+=150%", scrub: true },
          },
        );

        gsap.fromTo(
          rightVideo,
          { xPercent: 15, yPercent: 16, rotate: 4, scale: 0.9 },
          {
            xPercent: 0,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top top", end: "+=150%", scrub: true },
          },
        );

        gsap.fromTo(
          content,
          { opacity: 0.25, scale: 0.96, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            scrollTrigger: {
              trigger: section,
              start: "top+=35% top",
              end: "top+=110% top",
              scrub: true,
            },
          },
        );
      }, section);

      cleanup = () => context.revert();
    };

    const onLoaded = () => {
      cleanup?.();
      setup();
    };

    const setupFallback = () => {
      if (fallbackCleanup) return;
      const fallbackContext = gsap.context(() => {
        gsap.fromTo(
          ".bloom-cta__fallback",
          { clipPath: "inset(100% 0 0)", scaleX: 0.9, opacity: 0 },
          {
            clipPath: "inset(0% 0 0)",
            scaleX: 1,
            opacity: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=140%",
              scrub: 0.55,
              pin: true,
              anticipatePin: 1,
            },
          },
        );
        gsap.fromTo(
          content,
          { opacity: 0.3, scale: 0.96, y: 42 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            scrollTrigger: { trigger: section, start: "top+=30% top", end: "top+=95% top", scrub: true },
          },
        );
      }, section);
      fallbackCleanup = () => fallbackContext.revert();
    };

    const onError = () => {
      setVideoAvailable(false);
      setupFallback();
    };
    leftVideo.addEventListener("loadedmetadata", onLoaded);
    leftVideo.addEventListener("error", onError);
    rightVideo.addEventListener("error", onError);

    if (leftVideo.readyState >= 1) onLoaded();
    const readinessTimer = window.setTimeout(() => {
      if (leftVideo.readyState < 1 || rightVideo.readyState < 1) onError();
    }, 1800);

    return () => {
      cleanup?.();
      fallbackCleanup?.();
      window.clearTimeout(readinessTimer);
      leftVideo.removeEventListener("loadedmetadata", onLoaded);
      leftVideo.removeEventListener("error", onError);
      rightVideo.removeEventListener("error", onError);
    };
  }, []);

  return (
    <section ref={sectionRef} className="final-cta bloom-cta" id="contact" aria-labelledby="contact-title">
      <div className="final-cta__atmosphere" aria-hidden="true">
        <div className="final-cta__light" />
        <div className="final-cta__depth" />
        <div className="final-cta__grain" />
        <div className="final-cta__vignette" />
      </div>

      <img
        className="bloom-cta__fallback"
        src="/images/cta-roses.png"
        alt=""
        aria-hidden="true"
        data-active={!videoAvailable}
      />

      <video
        ref={leftVideoRef}
        className="bloom-cta__rose bloom-cta__rose--left"
        src="/animations/green-rose-bloom.webm"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        ref={rightVideoRef}
        className="bloom-cta__rose bloom-cta__rose--right"
        src="/animations/green-rose-bloom.webm"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div ref={contentRef} className="final-cta__content bloom-cta__content">
        <p className="bloom-cta__eyebrow">Ready to grow?</p>
        <h2 id="contact-title">
          Websites built to
          <br />
          elevate your business.
        </h2>
        <p className="final-cta__subline">
          Strategy, design and development shaped into digital experiences that help ambitious
          businesses grow.
        </p>
        <a className="final-cta__button" href="mailto:hello@kreuweb.com">
          <span>Book a call</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
