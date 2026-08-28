"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function FoundationReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.from("[data-intro]", {
        y: 28,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 48,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
        });
      });

      gsap.from("[data-final-reveal]", {
        y: 22,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-final-reveal]",
          start: "top 80%",
          once: true,
        },
      });

      const processStages = gsap.utils.toArray<HTMLElement>("[data-process-stage]");

      const setActiveProcessStage = (activeIndex: number) => {
        processStages.forEach((stage, index) => {
          stage.dataset.state = index < activeIndex ? "previous" : index === activeIndex ? "current" : "next";
        });
      };

      processStages.forEach((stage, index) => {
        ScrollTrigger.create({
          trigger: stage,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveProcessStage(index),
          onEnterBack: () => setActiveProcessStage(index),
        });
      });

      gsap.to(".hero__content", {
        yPercent: -22,
        opacity: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(".hero__depth", {
        scale: 1.12,
        opacity: 0.42,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      const portfolioMedia = gsap.matchMedia();

      portfolioMedia.add(
        {
          desktop: "(min-width: 1025px)",
          mobile: "(max-width: 1024px)",
        },
        (mediaContext) => {
          const isMobile = Boolean(mediaContext.conditions?.mobile);
          const panels = gsap.utils.toArray<HTMLElement>(".project-panel");
          const stages = panels.map((panel) => panel.querySelector<HTMLElement>(".project-stage"));
          const copies = panels.map((panel) => panel.querySelector<HTMLElement>(".project-copy"));
          const introTitle = document.querySelector<HTMLElement>(".selected-work__intro h2");

          panels.forEach((panel, index) => {
            gsap.set(panel, { zIndex: panels.length - index, pointerEvents: index === 0 ? "auto" : "none" });
            gsap.set(stages[index], {
              xPercent: index === 0 ? 0 : isMobile ? 18 : 90,
              yPercent: index === 0 ? 0 : isMobile ? 2 : 5,
              scale: index === 0 ? 0.95 : isMobile ? 0.92 : 0.8,
              rotateY: index === 0 || isMobile ? 0 : -7,
              rotateZ: index === 0 || isMobile ? 0 : 0.7,
              opacity: 0,
              filter: `blur(${index === 0 ? 3 : isMobile ? 5 : 8}px)`,
            });
            gsap.set(copies[index], { y: 24, opacity: 0 });
          });

          const portfolioTimeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: ".selected-work",
              start: "top top",
              end: () => `+=${window.innerHeight * (isMobile ? 3.15 : 3.55)}`,
              pin: ".selected-work__pin",
              scrub: 0.9,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          portfolioTimeline
            .to(
              introTitle,
              {
                x: () => -window.innerWidth * (isMobile ? 0.25 : 0.39),
                y: () => -window.innerHeight * (isMobile ? 0.025 : 0.035),
                scale: isMobile ? 0.25 : 0.18,
                opacity: 0.76,
                duration: 0.5,
                transformOrigin: "center center",
              },
              0,
            )
            .to(".project-gallery", { opacity: 1, duration: 0.34 }, 0.38)
            .to(
              stages[0],
              { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.42 },
              0.4,
            )
            .to(copies[0], { y: 0, opacity: 1, duration: 0.3 }, 0.54);

          for (let index = 1; index < panels.length; index += 1) {
            const transitionAt = 0.86 + (index - 1) * 0.72;

            portfolioTimeline
              .set(panels[index], { pointerEvents: "auto" }, transitionAt)
              .to(
                copies[index - 1],
                { y: -12, opacity: 0, duration: 0.25, ease: "power2.out" },
                transitionAt,
              )
              .to(
                stages[index - 1],
                {
                  xPercent: isMobile ? -18 : -90,
                  yPercent: isMobile ? -1 : -4,
                  scale: isMobile ? 0.92 : 0.8,
                  rotateY: isMobile ? 0 : 7,
                  rotateZ: isMobile ? 0 : -0.7,
                  opacity: isMobile ? 0 : 0.08,
                  filter: `blur(${isMobile ? 5 : 8}px)`,
                  duration: 0.62,
                },
                transitionAt,
              )
              .to(
                stages[index],
                {
                  xPercent: 0,
                  yPercent: 0,
                  scale: 1,
                  rotateY: 0,
                  rotateZ: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.62,
                },
                transitionAt,
              )
              .to(
                copies[index],
                { y: 0, opacity: 1, duration: 0.32, ease: "power2.out" },
                transitionAt + 0.25,
              )
              .set(panels[index - 1], { pointerEvents: "none" }, transitionAt + 0.58);

            if (index > 1) {
              portfolioTimeline.to(
                stages[index - 2],
                { xPercent: isMobile ? -22 : -104, opacity: 0, duration: 0.38 },
                transitionAt,
              );
            }
          }

          portfolioTimeline.to(introTitle, { opacity: 0, duration: 0.18 }, 3.25);
        },
      );

      const serviceItems = gsap.utils.toArray<HTMLElement>("[data-service-item]");
      const serviceVisuals = gsap.utils.toArray<HTMLElement>(".service-visual");

      gsap.set(serviceItems, { y: 28, opacity: 0 });
      gsap.set(serviceVisuals, { scale: 0.94, rotateZ: 0.7, opacity: 0, filter: "blur(8px)" });
      gsap.set(serviceItems[0], { y: 0, opacity: 1 });
      gsap.set(serviceVisuals[0], { scale: 1, rotateZ: 0, opacity: 1, filter: "blur(0px)" });
      gsap.set(".services__closing", { y: 26, opacity: 0, pointerEvents: "none" });
      gsap.set(".web-layer", { xPercent: 8, yPercent: -5, opacity: 0.16 });
      gsap.set(".search-line", { scaleX: 0 });
      gsap.set([".design-rule", ".design-grid"], { scaleX: 0, opacity: 0.12 });
      gsap.set(".design-type", { scale: 0.9, opacity: 0.25, transformOrigin: "left top" });
      gsap.set(".system-line", { scaleX: 0 });
      gsap.set(".system-node", { scale: 0.68, opacity: 0.18 });

      const servicesTimeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: ".services",
          start: "top top",
          end: () => `+=${window.innerHeight * 3.15}`,
          pin: ".services__pin",
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      servicesTimeline.fromTo(
        ".services__header",
        { y: 18, opacity: 0.35 },
        { y: 0, opacity: 1, duration: 0.32 },
        0,
      );

      servicesTimeline.to(
        ".web-layer",
        { xPercent: 0, yPercent: 0, opacity: 1, duration: 0.5, stagger: 0.06 },
        0.08,
      );

      for (let index = 1; index < serviceItems.length; index += 1) {
        const transitionAt = 0.48 + (index - 1) * 0.68;

        servicesTimeline
          .to(serviceItems[index - 1], { y: -22, opacity: 0, duration: 0.28 }, transitionAt)
          .to(
            serviceVisuals[index - 1],
            { xPercent: -5, scale: 0.96, rotateZ: -0.6, opacity: 0, filter: "blur(7px)", duration: 0.34 },
            transitionAt,
          )
          .to(serviceItems[index], { y: 0, opacity: 1, duration: 0.38 }, transitionAt + 0.12)
          .to(
            serviceVisuals[index],
            { xPercent: 0, scale: 1, rotateZ: 0, opacity: 1, filter: "blur(0px)", duration: 0.46 },
            transitionAt + 0.06,
          );

        if (index === 1) {
          servicesTimeline.to(
            ".search-line",
            { scaleX: 1, duration: 0.42, stagger: 0.08, ease: "power2.out" },
            transitionAt + 0.14,
          );
        }

        if (index === 2) {
          servicesTimeline
            .to(".design-type", { scale: 1, opacity: 1, duration: 0.4 }, transitionAt + 0.12)
            .to(
              [".design-rule", ".design-grid"],
              { scaleX: 1, opacity: 1, duration: 0.4, stagger: 0.07 },
              transitionAt + 0.16,
            );
        }

        if (index === 3) {
          servicesTimeline
            .to(".system-line", { scaleX: 1, duration: 0.44, stagger: 0.08 }, transitionAt + 0.1)
            .to(
              ".system-node",
              { scale: 1, opacity: 1, duration: 0.36, stagger: 0.06 },
              transitionAt + 0.16,
            );
        }
      }

      servicesTimeline
        .to(".services__stage", { y: -18, opacity: 0, duration: 0.36 }, 2.58)
        .to(".services__header", { y: -12, opacity: 0.24, duration: 0.36 }, 2.58)
        .to(
          ".services__closing",
          { y: 0, opacity: 1, pointerEvents: "auto", duration: 0.48 },
          2.72,
        );

      gsap.fromTo(
        ".process-section__intro",
        { y: 48, opacity: 0.12, clipPath: "inset(8% 0% 0% 0%)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: ".process-section",
            start: "top 86%",
            end: "top 34%",
            scrub: 0.8,
          },
        },
      );

      gsap.to(".process-section", {
        opacity: 0.24,
        scale: 0.992,
        ease: "none",
        transformOrigin: "center bottom",
        scrollTrigger: {
          trigger: ".final-cta",
          start: "top bottom",
          end: "top 32%",
          scrub: 0.9,
        },
      });

      gsap.fromTo(
        ".final-cta__atmosphere",
        { opacity: 0.12, scale: 1.055 },
        {
          opacity: 1,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".final-cta",
            start: "top 92%",
            end: "top 28%",
            scrub: 0.9,
          },
        },
      );

    });

    const hero = document.querySelector<HTMLElement>(".hero");
    const light = document.querySelector<HTMLElement>(".hero__light");
    const moveX = light ? gsap.quickTo(light, "x", { duration: 1.8, ease: "power3.out" }) : null;
    const moveY = light ? gsap.quickTo(light, "y", { duration: 1.8, ease: "power3.out" }) : null;

    const handlePointerMove = (event: PointerEvent) => {
      if (!hero || !moveX || !moveY || event.pointerType === "touch") return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      moveX(x * 18);
      moveY(y * 12);
    };

    hero?.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      hero?.removeEventListener("pointermove", handlePointerMove);
      context.revert();
    };
  }, []);

  return null;
}
