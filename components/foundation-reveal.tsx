"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type MotionMode = "desktop" | "tablet" | "mobile";

const portfolioConfig = {
  desktop: { distance: 3.1, enterX: 72, exitX: -72, scale: .84, rotation: 4.5, blur: 5 },
  tablet: { distance: 2.65, enterX: 34, exitX: -34, scale: .9, rotation: 2, blur: 3 },
  mobile: { distance: 2.15, enterX: 12, exitX: -12, scale: .96, rotation: 0, blur: 1.2 },
} as const;

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
      gsap.set(".project-gallery", { opacity: 1 });
      gsap.set(".project-panel", { opacity: 0, pointerEvents: "none" });
      gsap.set(".project-panel:first-child", { opacity: 1, pointerEvents: "auto" });
      gsap.set(".project-panel:first-child .project-stage", { opacity: 1, scale: 1, xPercent: 0, yPercent: 0, filter: "none" });
      gsap.set(".project-panel:first-child .project-copy", { opacity: 1, y: 0 });
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

    const portfolioMedia = gsap.matchMedia();
    portfolioMedia.add(
      { desktop: "(min-width: 1025px)", tablet: "(min-width: 768px) and (max-width: 1024px)", mobile: "(max-width: 767px)" },
      media => {
        const mode: MotionMode = media.conditions?.desktop ? "desktop" : media.conditions?.tablet ? "tablet" : "mobile";
        const config = portfolioConfig[mode];
        const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
        const stages = panels.map(panel => panel.querySelector<HTMLElement>(".project-stage"));
        const copies = panels.map(panel => panel.querySelector<HTMLElement>(".project-copy"));
        const title = document.querySelector<HTMLElement>(".selected-work__intro h2");
        if (!panels.length || !title || stages.some(stage => !stage) || copies.some(copy => !copy)) return;

        panels.forEach((panel, index) => {
          gsap.set(panel, { zIndex: panels.length - index, pointerEvents: index === 0 ? "auto" : "none" });
          gsap.set(stages[index], {
            xPercent: index === 0 ? 0 : config.enterX,
            yPercent: index === 0 ? 0 : mode === "desktop" ? 3 : 1,
            scale: index === 0 ? .97 : config.scale,
            rotateY: index === 0 ? 0 : -config.rotation,
            rotateZ: index === 0 || mode === "mobile" ? 0 : .45,
            opacity: 0,
            filter: `blur(${index === 0 ? Math.min(config.blur, 2) : config.blur}px)`,
          });
          gsap.set(copies[index], { y: mode === "mobile" ? 12 : 20, opacity: 0 });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          scrollTrigger: {
            trigger: ".selected-work",
            start: "top top",
            end: () => `+=${window.innerHeight * config.distance}`,
            pin: ".selected-work__pin",
            scrub: mode === "mobile" ? .55 : .78,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(title, {
            x: () => mode === "desktop" ? -Math.min(window.innerWidth * .28, 400) : mode === "tablet" ? -Math.min(window.innerWidth * .19, 190) : 0,
            y: () => -window.innerHeight * (mode === "desktop" ? .075 : mode === "tablet" ? .065 : .11),
            scale: mode === "desktop" ? .26 : mode === "tablet" ? .32 : .38,
            opacity: .76,
            duration: .48,
            transformOrigin: "center center",
          }, 0)
          .to(".project-gallery", { opacity: 1, duration: .28 }, .28)
          .to(stages[0], { scale: 1, opacity: 1, filter: "blur(0px)", duration: .38 }, .3)
          .to(copies[0], { y: 0, opacity: 1, duration: .28 }, .44);

        let lastTransition = .8;
        for (let index = 1; index < panels.length; index += 1) {
          const at = .8 + (index - 1) * .62;
          lastTransition = at;
          timeline
            .set(panels[index], { pointerEvents: "auto" }, at)
            .to(copies[index - 1], { y: -8, opacity: 0, duration: .2, ease: "power2.out" }, at)
            .to(stages[index - 1], {
              xPercent: config.exitX,
              yPercent: mode === "desktop" ? -3 : -1,
              scale: config.scale,
              rotateY: config.rotation,
              rotateZ: mode === "mobile" ? 0 : -.45,
              opacity: 0,
              filter: `blur(${config.blur}px)`,
              duration: .5,
            }, at)
            .to(stages[index], {
              xPercent: 0,
              yPercent: 0,
              scale: 1,
              rotateY: 0,
              rotateZ: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: .5,
            }, at)
            .to(copies[index], { y: 0, opacity: 1, duration: .26, ease: "power2.out" }, at + .2)
            .set(panels[index - 1], { pointerEvents: "none" }, at + .48);
        }
        timeline.to(title, { opacity: 0, duration: .16 }, lastTransition + .48);
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
      portfolioMedia.revert();
      workflowMedia.revert();
      context.revert();
    };
  }, []);

  return null;
}
