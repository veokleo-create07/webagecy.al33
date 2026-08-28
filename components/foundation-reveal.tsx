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

      const workflowMedia = gsap.matchMedia();

      workflowMedia.add(
        { wide: "(min-width: 1025px)", narrow: "(max-width: 1024px)" },
        (workflowContext) => {
          const isNarrow = Boolean(workflowContext.conditions?.narrow);
          const nodes = gsap.utils.toArray<HTMLElement>("[data-workflow-node]");
          const connectors = gsap.utils.toArray<HTMLElement>("[data-workflow-connector]");
          const flowLines = connectors.map((connector) => connector.querySelector<HTMLElement>("span"));

          gsap.set(nodes, { opacity: 0.22, scale: 0.96, y: 8 });
          gsap.set(flowLines, {
            scaleX: isNarrow ? 1 : 0,
            scaleY: isNarrow ? 0 : 1,
            transformOrigin: isNarrow ? "center top" : "left center",
          });

          const servicesTimeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: ".services",
              start: "top top",
              end: () => `+=${window.innerHeight * (isNarrow ? 3 : 2.55)}`,
              pin: ".services__pin",
              scrub: 0.8,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          servicesTimeline
            .fromTo(".services__header", { y: 20, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.34 }, 0)
            .to(nodes[0], { opacity: 1, scale: 1, y: 0, duration: 0.3 }, 0.12);

          connectors.forEach((_, index) => {
            const activationAt = 0.42 + index * 0.48;
            servicesTimeline
              .to(
                flowLines[index],
                isNarrow
                  ? { scaleY: 1, duration: 0.34, ease: "power2.out" }
                  : { scaleX: 1, duration: 0.34, ease: "power2.out" },
                activationAt,
              )
              .to(
                nodes[index + 1],
                { opacity: 1, scale: 1, y: 0, duration: 0.34 },
                activationAt + 0.2,
              );
          });

          servicesTimeline.to(
            ".services__header",
            { y: -8, opacity: 0.78, duration: 0.36 },
            2.25,
          );
        },
      );

      const enginePhases = gsap.utils.toArray<HTMLElement>("[data-engine-phase]");
      const engineSignals = gsap.utils.toArray<HTMLElement>("[data-engine-signal]");

      gsap.set(enginePhases, { y: 14, opacity: 0 });
      gsap.set(engineSignals, { opacity: 0, scale: 0.92 });
      gsap.set(".engine-signal i", { scaleX: 0 });
      gsap.set(".engine-structure", { scale: 0.86, opacity: 0, rotateX: 7 });
      gsap.set(".engine-structure i", { scaleX: 0, scaleY: 0 });
      gsap.set(".engine-layer", { y: 30, z: -70, opacity: 0, rotateY: -5 });
      gsap.set(".engine-build", { opacity: 0 });
      gsap.set(".engine-build i", { scaleX: 0, scaleY: 0 });
      gsap.set(".engine-output", { scale: 0.88, opacity: 0, rotateX: 5 });
      gsap.set(".engine-ready", { y: 18, opacity: 0 });

      const engineTimeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: ".kreu-engine",
          start: "top top",
          end: () => `+=${window.innerHeight * 4.15}`,
          pin: ".kreu-engine__pin",
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      engineTimeline
        .fromTo(".kreu-engine__header", { y: 22, opacity: 0.3 }, { y: 0, opacity: 1, duration: 0.32 }, 0)
        .to(enginePhases[0], { y: 0, opacity: 1, duration: 0.28 }, 0.12)
        .to(engineSignals, { opacity: 1, scale: 1, duration: 0.46, stagger: 0.07 }, 0.18)
        .to(".engine-signal i", { scaleX: 1, duration: 0.46, stagger: 0.06 }, 0.26)
        .to(enginePhases[0], { y: -12, opacity: 0, duration: 0.24 }, 0.8)
        .to(enginePhases[1], { y: 0, opacity: 1, duration: 0.28 }, 0.88)
        .to(engineSignals, { x: 0, y: 0, scale: 0.72, opacity: 0.18, duration: 0.52 }, 0.9)
        .to(".engine-structure", { scale: 1, opacity: 1, rotateX: 0, duration: 0.52 }, 0.96)
        .to(".engine-structure i", { scaleX: 1, scaleY: 1, duration: 0.46, stagger: 0.05 }, 1.02)
        .to(enginePhases[1], { y: -12, opacity: 0, duration: 0.24 }, 1.5)
        .to(enginePhases[2], { y: 0, opacity: 1, duration: 0.28 }, 1.58)
        .to(".engine-layer", { y: 0, z: 0, opacity: 1, rotateY: 0, duration: 0.6, stagger: 0.09 }, 1.62)
        .to(".engine-core", { background: "rgba(241,239,232,0.055)", duration: 0.4 }, 1.78)
        .to(enginePhases[2], { y: -12, opacity: 0, duration: 0.24 }, 2.2)
        .to(enginePhases[3], { y: 0, opacity: 1, duration: 0.28 }, 2.28)
        .to(".engine-build", { opacity: 1, duration: 0.28 }, 2.32)
        .to(".engine-build i", { scaleX: 1, scaleY: 1, duration: 0.5, stagger: 0.06 }, 2.36)
        .to(".engine-design", { scale: 1.035, rotateX: -1.5, duration: 0.52 }, 2.42)
        .to(enginePhases[3], { y: -12, opacity: 0, duration: 0.24 }, 2.88)
        .to(enginePhases[4], { y: 0, opacity: 1, duration: 0.28 }, 2.96)
        .to([".engine-signals", ".engine-structure", ".engine-build"], { opacity: 0.08, duration: 0.48 }, 3)
        .to(".engine-design", { scale: 0.92, opacity: 0.12, filter: "blur(5px)", duration: 0.5 }, 3.04)
        .to(".engine-core", { scale: 0.84, opacity: 0, duration: 0.38 }, 3.08)
        .to(".engine-output", { scale: 1, opacity: 1, rotateX: 0, duration: 0.62 }, 3.12)
        .to(enginePhases[4], { y: -10, opacity: 0, duration: 0.25 }, 3.7)
        .to(".kreu-engine__header", { y: -12, opacity: 0.18, duration: 0.35 }, 3.72)
        .to(".engine-ready", { y: 0, opacity: 1, duration: 0.42 }, 3.78);

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
