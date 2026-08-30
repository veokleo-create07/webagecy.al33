"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type MotionMode = "desktop" | "tablet" | "mobile";

const servicesConfig = {
  desktop: { distance: 2.15, vertical: false },
  tablet: { distance: 1.7, vertical: true },
  mobile: { distance: 1.18, vertical: true },
} as const;

export function FoundationReveal() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector<HTMLElement>(".hero");
    const light = document.querySelector<HTMLElement>(".hero__light");
    const imageListeners: Array<{ image: HTMLImageElement; handler: () => void }> = [];
    let refreshFrame = 0;
    let isActive = true;

    const refresh = () => {
      if (!isActive) return;
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    if (reduceMotion) {
      gsap.set("[data-intro], [data-reveal], [data-final-reveal]", { clearProps: "all" });
      gsap.set("[data-workflow-node]", { opacity: 1, scale: 1, y: 0 });
      gsap.set("[data-workflow-connector] span", { scaleX: 1, scaleY: 1 });
      refresh();
      return () => {
        isActive = false;
        cancelAnimationFrame(refreshFrame);
      };
    }

    const context = gsap.context(() => {
      gsap.from("[data-intro]", { y: 24, opacity: 0, duration: 1, stagger: .07, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(element => {
        gsap.from(element, {
          y: 36,
          opacity: 0,
          duration: .9,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
      const finalReveal = document.querySelector<HTMLElement>("[data-final-reveal]");
      if (finalReveal) {
        gsap.from(finalReveal, {
          y: 18,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: { trigger: finalReveal, start: "top 84%", once: true },
        });
      }
    });

    const heroMedia = gsap.matchMedia();
    heroMedia.add(
      { desktop: "(min-width: 1025px)", tablet: "(min-width: 768px) and (max-width: 1024px)", mobile: "(max-width: 767px)" },
      media => {
        const mode: MotionMode = media.conditions?.desktop ? "desktop" : media.conditions?.tablet ? "tablet" : "mobile";
        const values = mode === "desktop"
          ? { y: -18, opacity: .14, scale: 1.1 }
          : mode === "tablet"
            ? { y: -10, opacity: .28, scale: 1.055 }
            : { y: -5, opacity: .55, scale: 1.025 };
        gsap.to(".hero__content", {
          yPercent: values.y,
          opacity: values.opacity,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: mode === "mobile" ? .45 : .8 },
        });
        gsap.to(".hero__depth", {
          scale: values.scale,
          opacity: mode === "mobile" ? .6 : .42,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: mode === "mobile" ? .5 : 1 },
        });
      },
    );

    const workflowMedia = gsap.matchMedia();
    workflowMedia.add(
      { desktop: "(min-width: 1025px)", tablet: "(min-width: 768px) and (max-width: 1024px)", mobile: "(max-width: 767px)" },
      media => {
        const mode: MotionMode = media.conditions?.desktop ? "desktop" : media.conditions?.tablet ? "tablet" : "mobile";
        const config = servicesConfig[mode];
        const nodes = gsap.utils.toArray<HTMLElement>("[data-workflow-node]");
        const connectors = gsap.utils.toArray<HTMLElement>("[data-workflow-connector]");
        const lines = connectors.map(connector => connector.querySelector<HTMLElement>("span"));
        if (!nodes.length || lines.some(line => !line)) return;

        gsap.set(nodes, { opacity: mode === "mobile" ? .3 : .22, scale: mode === "mobile" ? 1 : .97, y: mode === "mobile" ? 0 : 6 });
        gsap.set(lines, {
          scaleX: config.vertical ? 1 : 0,
          scaleY: config.vertical ? 0 : 1,
          transformOrigin: config.vertical ? "center top" : "left center",
        });
        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ".services",
            start: "top top",
            end: () => `+=${window.innerHeight * config.distance}`,
            pin: ".services__pin",
            scrub: mode === "mobile" ? .5 : .72,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        timeline
          .fromTo(".services__header", { y: mode === "mobile" ? 8 : 16, opacity: .45 }, { y: 0, opacity: 1, duration: .28 }, 0)
          .to(nodes[0], { opacity: 1, scale: 1, y: 0, duration: .24 }, .1);
        connectors.forEach((_, index) => {
          const at = .34 + index * .38;
          timeline
            .to(lines[index], config.vertical ? { scaleY: 1, duration: .28 } : { scaleX: 1, duration: .28 }, at)
            .to(nodes[index + 1], { opacity: 1, scale: 1, y: 0, duration: .28 }, at + .16);
        });
      },
    );

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const moveX = finePointer && light ? gsap.quickTo(light, "x", { duration: 1.8, ease: "power3.out" }) : null;
    const moveY = finePointer && light ? gsap.quickTo(light, "y", { duration: 1.8, ease: "power3.out" }) : null;
    const handlePointerMove = (event: PointerEvent) => {
      if (!hero || !moveX || !moveY) return;
      const bounds = hero.getBoundingClientRect();
      moveX((((event.clientX - bounds.left) / bounds.width) - .5) * 16);
      moveY((((event.clientY - bounds.top) / bounds.height) - .5) * 10);
    };
    if (finePointer) hero?.addEventListener("pointermove", handlePointerMove, { passive: true });

    document.fonts?.ready.then(refresh);
    document.querySelectorAll<HTMLImageElement>("img").forEach(image => {
      if (image.complete) return;
      const handler = () => refresh();
      image.addEventListener("load", handler, { once: true });
      image.addEventListener("error", handler, { once: true });
      imageListeners.push({ image, handler });
    });
    window.addEventListener("load", refresh, { once: true });
    refresh();

    return () => {
      isActive = false;
      cancelAnimationFrame(refreshFrame);
      hero?.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("load", refresh);
      imageListeners.forEach(({ image, handler }) => {
        image.removeEventListener("load", handler);
        image.removeEventListener("error", handler);
      });
      heroMedia.revert();
      workflowMedia.revert();
      context.revert();
    };
  }, []);

  return null;
}
