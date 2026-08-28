"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type PathProps = { d: string; className?: string };
type LeafProps = { x: number; y: number; rotate: number; scale?: number; flip?: boolean };
type BloomProps = { x: number; y: number; scale?: number; rotate?: number; petals?: number };

export function Stem({ d, className = "" }: PathProps) {
  return <path className={`botanical-path botanical-stem ${className}`} data-stem d={d} />;
}

export function Branch({ d, className = "" }: PathProps) {
  return <path className={`botanical-path botanical-branch ${className}`} data-branch d={d} />;
}

export function Leaf({ x, y, rotate, scale = 1, flip = false }: LeafProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -scale : scale} ${scale})`}>
      <g className="botanical-leaf" data-leaf>
        <path d="M0 0C-26-9-39-38-8-61C20-48 31-18 0 0Z" />
        <path className="botanical-leaf__vein" d="M-1-2C-3-20-5-39-8-57M-4-27L-21-39M-4-35L10-47" />
      </g>
    </g>
  );
}

export function Bloom({ x, y, scale = 1, rotate = 0, petals = 8 }: BloomProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="botanical-bloom" data-bloom>
        {Array.from({ length: petals }).map((_, index) => {
          const angle = (360 / petals) * index;
          const radius = index % 2 === 0 ? 23 : 17;
          return (
            <g key={angle} transform={`rotate(${angle}) translate(0 ${-radius})`}>
              <ellipse
                className="botanical-petal"
                data-petal
                cx="0"
                cy="0"
                rx={index % 2 === 0 ? 19 : 15}
                ry={index % 2 === 0 ? 31 : 25}
              />
            </g>
          );
        })}
        <circle className="botanical-bloom__core" r="17" />
        <circle className="botanical-bloom__light" r="7" />
      </g>
    </g>
  );
}

function Bud({ x, y, rotate = 0, scale = 1 }: BloomProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="botanical-bud" data-bud>
        <path d="M0 13C-22 2-20-29 0-42C20-28 22 1 0 13Z" />
        <path d="M-18 5C-22-10-14-23-2-31C-8-12-7-1 0 13Z" />
        <path d="M18 5C22-10 14-23 2-31C8-12 7-1 0 13Z" />
      </g>
    </g>
  );
}

export function BotanicalGrowth() {
  return (
    <svg
      className="botanical-growth"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="stem-green" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#173a2b" />
          <stop offset="0.55" stopColor="#2f6548" />
          <stop offset="1" stopColor="#7ba27c" />
        </linearGradient>
        <radialGradient id="leaf-green" cx="35%" cy="25%" r="85%">
          <stop offset="0" stopColor="#789a72" />
          <stop offset="0.42" stopColor="#285c40" />
          <stop offset="1" stopColor="#102d22" />
        </radialGradient>
        <radialGradient id="petal-green" cx="40%" cy="25%" r="80%">
          <stop offset="0" stopColor="#9bb998" stopOpacity="0.92" />
          <stop offset="0.34" stopColor="#3d7553" stopOpacity="0.95" />
          <stop offset="1" stopColor="#102b20" />
        </radialGradient>
        <filter id="botanical-depth" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <g className="botanical-plant botanical-plant--left" filter="url(#botanical-depth)">
        <Stem d="M48 914C74 790 78 688 125 594C169 506 194 410 236 310C265 240 296 180 338 123" />
        <Branch d="M116 614C162 573 202 550 252 538" />
        <Branch d="M155 522C116 475 94 432 87 383" />
        <Branch d="M202 399C246 377 281 337 296 292" />
        <Branch d="M247 286C214 247 199 213 198 172" />
        <Leaf x={111} y={650} rotate={-63} scale={1.15} />
        <Leaf x={158} y={563} rotate={72} scale={0.95} flip />
        <Leaf x={142} y={500} rotate={-55} scale={0.86} />
        <Leaf x={204} y={414} rotate={72} scale={0.78} flip />
        <Leaf x={248} y={344} rotate={-62} scale={0.72} />
        <Leaf x={272} y={265} rotate={65} scale={0.62} flip />
        <Bud x={87} y={372} rotate={-14} scale={0.75} />
        <Bud x={198} y={166} rotate={-6} scale={0.66} />
        <Bloom x={255} y={524} scale={1.08} rotate={-12} petals={9} />
        <Bloom x={343} y={115} scale={0.94} rotate={8} petals={8} />
      </g>

      <g className="botanical-plant botanical-plant--right" filter="url(#botanical-depth)">
        <Stem d="M1395 914C1370 818 1351 743 1326 659C1295 555 1279 454 1246 358C1221 286 1186 230 1142 177" />
        <Branch d="M1334 688C1289 653 1243 636 1192 637" />
        <Branch d="M1298 559C1340 517 1363 476 1369 424" />
        <Branch d="M1261 401C1218 379 1185 350 1167 315" />
        <Branch d="M1214 292C1244 250 1256 210 1251 170" />
        <Leaf x={1338} y={712} rotate={61} scale={1.06} flip />
        <Leaf x={1299} y={626} rotate={-72} scale={0.98} />
        <Leaf x={1310} y={534} rotate={58} scale={0.82} flip />
        <Leaf x={1254} y={434} rotate={-65} scale={0.8} />
        <Leaf x={1204} y={355} rotate={60} scale={0.7} flip />
        <Leaf x={1180} y={250} rotate={-58} scale={0.6} />
        <Bud x={1369} y={416} rotate={15} scale={0.67} />
        <Bud x={1251} y={162} rotate={7} scale={0.78} />
        <Bloom x={1188} y={628} scale={0.82} rotate={14} petals={7} />
        <Bloom x={1137} y={169} scale={1.1} rotate={-7} petals={10} />
      </g>
    </svg>
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
      const paths = gsap.utils.toArray<SVGPathElement>("[data-stem], [data-branch]");
      const stems = gsap.utils.toArray<SVGPathElement>("[data-stem]");
      const branches = gsap.utils.toArray<SVGPathElement>("[data-branch]");
      const leaves = gsap.utils.toArray<SVGGElement>("[data-leaf]");
      const buds = gsap.utils.toArray<SVGGElement>("[data-bud]");
      const blooms = gsap.utils.toArray<SVGGElement>("[data-bloom]");
      const petals = gsap.utils.toArray<SVGEllipseElement>("[data-petal]");

      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });
      gsap.set(leaves, { scale: 0, opacity: 0, rotate: (index) => (index % 2 ? 18 : -18), transformOrigin: "0% 100%" });
      gsap.set(buds, { scale: 0, opacity: 0, transformOrigin: "50% 100%" });
      gsap.set(blooms, { opacity: 0 });
      gsap.set(petals, { scale: 0.08, opacity: 0, rotate: (index) => (index % 2 ? 22 : -22), transformOrigin: "50% 70%" });
      gsap.set(".botanical-bloom__core, .botanical-bloom__light", {
        scale: 0,
        opacity: 0,
        transformOrigin: "center",
      });
      gsap.set(content, { y: 24, opacity: 0.62, scale: 0.975 });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * 1.08}`,
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(stems, { strokeDashoffset: 0, duration: 0.22, stagger: 0.015, ease: "none" }, 0)
        .to(branches, { strokeDashoffset: 0, duration: 0.25, stagger: 0.018, ease: "none" }, 0.18)
        .to(leaves, { scale: 1, opacity: 1, rotate: 0, duration: 0.26, stagger: 0.018, ease: "back.out(1.25)" }, 0.32)
        .to(buds, { scale: 1, opacity: 1, duration: 0.2, stagger: 0.035, ease: "back.out(1.4)" }, 0.52)
        .to(blooms, { opacity: 1, duration: 0.06 }, 0.66)
        .to(petals, { scale: 1, opacity: 0.96, rotate: 0, duration: 0.3, stagger: 0.012, ease: "back.out(1.55)" }, 0.68)
        .to(
          ".botanical-bloom__core, .botanical-bloom__light",
          { scale: 1, opacity: 1, duration: 0.12, stagger: 0.01 },
          0.86,
        )
        .to(content, { y: 0, opacity: 1, scale: 1, duration: 0.35 }, 0.4);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="final-cta botanical-cta" id="contact" aria-labelledby="contact-title">
      <div className="final-cta__atmosphere" aria-hidden="true">
        <div className="final-cta__light" />
        <div className="final-cta__depth" />
        <div className="final-cta__grain" />
        <div className="final-cta__vignette" />
      </div>
      <BotanicalGrowth />
      <div ref={contentRef} className="final-cta__content botanical-cta__content">
        <h2 id="contact-title">Premium websites that move businesses forward.</h2>
        <p className="final-cta__subline">
          Strategy, design and development crafted to turn strong businesses into stronger digital brands.
        </p>
        <a className="final-cta__button" href="mailto:hello@kreuweb.com">
          <span>Book a call</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  );
}
