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
