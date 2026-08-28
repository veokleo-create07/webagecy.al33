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
        },
      );

      gsap.to([".project-gallery", ".selected-work__intro"], {
        yPercent: -7,
        scale: 0.975,
        opacity: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: ".perception-section",
          start: "top bottom",
          end: "top 38%",
          scrub: 0.85,
        },
      });

      gsap.fromTo(
        ".perception-section__content",
        { y: 64, scale: 0.975, opacity: 0.08, clipPath: "inset(10% 0% 0% 0%)" },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: ".perception-section",
            start: "top 88%",
            end: "center 54%",
            scrub: 0.8,
          },
        },
      );

      gsap.to(".perception-section__content", {
        y: -54,
        scale: 0.985,
        opacity: 0.16,
        ease: "none",
        scrollTrigger: {
          trigger: ".perception-section",
          start: "58% center",
          end: "bottom 12%",
          scrub: 0.85,
        },
      });

      gsap.fromTo(
        ".foundation-section:first-child",
        { y: 58, opacity: 0.16, clipPath: "inset(8% 0% 0% 0%)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: {
            trigger: ".section-flow",
            start: "top 88%",
            end: "top 35%",
            scrub: 0.8,
          },
        },
      );

      gsap.to(".foundation-section:last-child", {
        y: -42,
        scale: 0.99,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: ".process-section",
          start: "top bottom",
          end: "top 38%",
          scrub: 0.8,
        },
      });

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
