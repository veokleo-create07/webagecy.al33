"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Side = "left" | "right";
type PathProps = { d: string; width?: number; side?: Side };
type PositionedProps = { x: number; y: number; rotate: number; scale?: number; flip?: boolean; side?: Side };

const petals = [
  [-112, -23, 10, .95, -24, 18], [-76, -29, -6, 1.08, -16, 26], [-39, -23, -25, 1.14, -7, 34],
  [-8, -5, -34, 1.2, 8, 22], [26, 18, -29, 1.08, 18, -18], [63, 30, -10, 1.12, 12, -30],
  [101, 27, 12, .92, -9, -27], [142, 13, 27, 1.06, -18, -14], [179, -9, 29, .88, 13, 22],
  [218, -25, 19, .98, 17, 12], [-62, -14, -9, .72, -13, 25], [-15, -3, -17, .68, 12, 19],
  [37, 13, -13, .75, 18, -22], [88, 16, 2, .66, -8, -26], [139, 7, 14, .72, -16, -12],
  [196, -10, 12, .62, 14, 16], [-31, -5, -5, .46, -10, 17], [42, 5, -5, .5, 12, -14],
];

export function Stem({ d, width = 10, side = "left" }: PathProps) {
  return <g className={`sculptural-stem sculptural-stem--${side}`}>
    <path className="botanical-path botanical-stem botanical-stem__shadow" data-growth-path d={d} strokeWidth={width + 5} />
    <path className="botanical-path botanical-stem botanical-stem__body" data-growth-path d={d} strokeWidth={width} />
    <path className="botanical-path botanical-stem botanical-stem__light" data-growth-path d={d} strokeWidth={Math.max(1.1, width * .15)} />
  </g>;
}

export function Branch({ d, width = 4, side = "left" }: PathProps) {
  return <g className={`sculptural-branch sculptural-branch--${side}`} data-branch-group>
    <path className="botanical-path botanical-branch botanical-branch__shadow" data-growth-path d={d} strokeWidth={width + 2.2} />
    <path className="botanical-path botanical-branch botanical-branch__body" data-growth-path d={d} strokeWidth={width} />
    <path className="botanical-path botanical-branch botanical-branch__light" data-growth-path d={d} strokeWidth=".8" />
  </g>;
}

export function Leaf({ x, y, rotate, scale = 1, flip = false, side = "left" }: PositionedProps) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${flip ? -scale : scale} ${scale})`}>
    <g className={`botanical-leaf botanical-leaf--${side}`} data-leaf>
      <path className="botanical-leaf__shadow" d="M2 3C-38-2-70-21-84-50C-57-82-15-92 42-72C66-63 78-43 70-20C50-5 25 3 2 3Z" />
      <path className="botanical-leaf__body" d="M0 0C-36-4-66-22-79-49C-54-77-14-87 39-69C61-61 72-42 65-21C46-6 23 2 0 0Z" />
      <path className="botanical-leaf__glaze" d="M-70-50C-42-69-5-75 43-59C19-57-10-47-37-27C-52-31-63-39-70-50Z" />
      <path className="botanical-leaf__vein" d="M0-1C-20-18-43-35-72-48M-26-24L-25-54M-43-35L-57-18M-12-13L-7-45M-55-42L-68-28" />
    </g>
  </g>;
}

export function Petal({ index, side }: { index: number; side: Side }) {
  const [a, x, y, s, rx, ry] = petals[index];
  return <g transform={`translate(${x * .58} ${y * .58}) rotate(${a}) scale(${s})`}>
    <g className={`botanical-petal botanical-petal--${side} botanical-petal--shade-${index % 4}`} data-petal data-rx={rx} data-ry={ry} data-rz={a}>
      <path className="botanical-petal__body" d="M0 7C-25 3-36-22-29-46C-23-70-1-85 22-72C44-60 48-35 34-15C24-2 11 6 0 7Z" />
      <path className="botanical-petal__fold" d="M-22-45C-8-64 8-69 24-60C11-58-2-48-10-31C-17-32-21-37-22-45Z" />
      <path className="botanical-petal__edge" d="M-27-44C-19-68 2-82 22-72" />
    </g>
  </g>;
}

export function Flower({ x, y, rotate, scale = 1, side = "left", secondary = false }: PositionedProps & { secondary?: boolean }) {
  const count = secondary ? 13 : 18;
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <g className={`botanical-flower botanical-flower--${side} botanical-flower--${secondary ? "secondary" : "hero"}`} data-flower>
      <ellipse className="botanical-flower__shadow" cx="0" cy="5" rx="59" ry="34" />
      {petals.slice(0, count).map((_, index) => <Petal key={index} index={index} side={side} />)}
      <circle className="botanical-flower__core" r={secondary ? 9 : 12} />
      <ellipse className="botanical-flower__core-light" cx="-3" cy="-5" rx="5" ry="3" />
    </g>
  </g>;
}

export function Bud({ x, y, rotate, scale = 1, side = "left" }: PositionedProps) {
  return <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
    <g className={`botanical-bud botanical-bud--${side}`} data-bud>
      <path className="botanical-bud__back" d="M0 15C-29 3-24-39 0-59C28-38 31 4 0 15Z" />
      <path className="botanical-bud__front" d="M0 13C-13-9-10-36 0-57C14-34 17-7 0 13Z" />
      <path className="botanical-bud__light" d="M-7-36C-1-48 7-49 12-39C3-33-1-22-1-9C-8-17-10-27-7-36Z" />
      <path className="botanical-bud__sepal" d="M-24 5L-7 24L0 12L8 25L25 4L13 34L-13 34Z" />
    </g>
  </g>;
}

function Definitions({ side }: { side: Side }) {
  const left = side === "left";
  return <defs>
    <linearGradient id={`${side}-stem-body`} x1="0" y1="1" x2={left ? "1" : "0"} y2="0"><stop offset="0" stopColor="#071c15"/><stop offset=".55" stopColor="#1d513a"/><stop offset="1" stopColor="#5a7d61"/></linearGradient>
    <linearGradient id={`${side}-leaf-body`} x1={left ? "0" : "1"} y1="1" x2={left ? "1" : "0"} y2="0"><stop offset="0" stopColor="#061a13"/><stop offset=".52" stopColor="#1c5439"/><stop offset="1" stopColor="#718b6e"/></linearGradient>
    <radialGradient id={`${side}-petal`} cx={left ? "31%" : "66%"} cy="21%" r="88%"><stop offset="0" stopColor="#adbda0"/><stop offset=".2" stopColor="#738f68"/><stop offset=".56" stopColor="#2f6848"/><stop offset="1" stopColor="#07231a"/></radialGradient>
    <filter id={`${side}-soft-shadow`} x="-70%" y="-70%" width="240%" height="240%"><feDropShadow dx={left ? "8" : "-8"} dy="17" stdDeviation="11" floodColor="#000" floodOpacity=".58"/></filter>
    <filter id={`${side}-petal-depth`} x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur in="SourceAlpha" stdDeviation="1.4" result="blur"/><feOffset dy="3" result="offset"/><feFlood floodColor="#00140c" floodOpacity=".5" result="shadow"/><feComposite in="shadow" in2="offset" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>;
}

function Plant({ side }: { side: Side }) {
  const left = side === "left";
  return <svg className={`botanical-plant botanical-plant--${side}`} viewBox="0 0 440 900" aria-hidden="true">
    <Definitions side={side}/>
    <g className="botanical-plant__sculpture" filter={`url(#${side}-soft-shadow)`}>{left ? <>
      <Stem side={side} width={11} d="M34 918C50 802 83 699 121 617C159 534 178 450 226 353C262 279 292 202 347 116"/>
      <Branch side={side} width={5.5} d="M102 658C145 621 191 594 250 580"/><Branch side={side} width={4.4} d="M156 535C115 500 88 453 77 397"/><Branch side={side} width={4.8} d="M205 394C249 368 280 330 303 282"/><Branch side={side} width={3.8} d="M260 279C226 242 209 202 211 158"/>
      <Leaf side={side} x={97} y={684} rotate={-58} scale={1.02}/><Leaf side={side} x={157} y={615} rotate={73} scale={.88} flip/><Leaf side={side} x={140} y={521} rotate={-51} scale={.84}/><Leaf side={side} x={86} y={420} rotate={-72} scale={.68}/><Leaf side={side} x={218} y={388} rotate={66} scale={.79} flip/><Leaf side={side} x={281} y={309} rotate={-43} scale={.64}/><Leaf side={side} x={238} y={255} rotate={76} scale={.57} flip/>
      <Bud side={side} x={77} y={390} rotate={-18} scale={.68}/><Bud side={side} x={211} y={151} rotate={-8} scale={.62}/><Flower side={side} x={350} y={112} rotate={-11} scale={1.08}/><Flower side={side} x={250} y={578} rotate={17} scale={.66} secondary/>
    </> : <>
      <Stem side={side} width={10} d="M410 920C384 819 367 727 337 647C305 558 284 477 257 394C231 317 193 251 140 181"/>
      <Branch side={side} width={5} d="M345 683C304 651 259 628 205 630"/><Branch side={side} width={4.2} d="M309 568C349 527 370 481 373 426"/><Branch side={side} width={5.2} d="M272 445C226 417 191 381 173 335"/><Branch side={side} width={3.6} d="M215 290C247 248 261 211 256 168"/>
      <Leaf side={side} x={350} y={706} rotate={59} scale={.94} flip/><Leaf side={side} x={301} y={643} rotate={-69} scale={.89}/><Leaf side={side} x={325} y={553} rotate={55} scale={.75} flip/><Leaf side={side} x={365} y={450} rotate={45} scale={.61} flip/><Leaf side={side} x={257} y={438} rotate={-66} scale={.82}/><Leaf side={side} x={189} y={361} rotate={57} scale={.7} flip/><Leaf side={side} x={229} y={270} rotate={-51} scale={.59}/>
      <Bud side={side} x={373} y={420} rotate={15} scale={.61}/><Bud side={side} x={256} y={160} rotate={9} scale={.76}/><Flower side={side} x={137} y={178} rotate={10} scale={.96}/><Flower side={side} x={205} y={628} rotate={-14} scale={.57} secondary/>
    </>}</g>
  </svg>;
}

export function BotanicalGrowth() { return <div className="botanical-growth" aria-hidden="true"><Plant side="left"/><Plant side="right"/></div>; }

export function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = sectionRef.current, content = contentRef.current;
    if (!section || !content || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>("[data-growth-path]");
      const stems = paths.filter(path => path.classList.contains("botanical-stem"));
      const branchPaths = paths.filter(path => path.classList.contains("botanical-branch"));
      const branches = gsap.utils.toArray<SVGGElement>("[data-branch-group]");
      const leaves = gsap.utils.toArray<SVGGElement>("[data-leaf]");
      const buds = gsap.utils.toArray<SVGGElement>("[data-bud]");
      const petals = gsap.utils.toArray<SVGGElement>("[data-petal]");
      paths.forEach(path => { const length = path.getTotalLength(); gsap.set(path, { strokeDasharray: length, strokeDashoffset: length }); });
      gsap.set(branches, { opacity: .35 });
      gsap.set(leaves, { scale: 0, opacity: 0, rotateX: -58, rotateY: 24, transformOrigin: "0% 55%", transformBox: "fill-box" });
      gsap.set(buds, { scale: 0, opacity: 0, rotate: -18, transformOrigin: "50% 100%", transformBox: "fill-box" });
      petals.forEach((petal, index) => gsap.set(petal, { scale: .05, opacity: 0, rotateX: Number(petal.dataset.rx) - 68, rotateY: Number(petal.dataset.ry) * .45, rotateZ: Number(petal.dataset.rz) + (index % 2 ? 13 : -13), transformOrigin: "50% 100%", transformBox: "fill-box" }));
      gsap.set(".botanical-flower__core, .botanical-flower__core-light, .botanical-flower__shadow", { scale: 0, opacity: 0, transformOrigin: "center" });
      gsap.set(content, { y: 18, opacity: .68, scale: .98 });
      const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" }, scrollTrigger: { trigger: section, start: "top top", end: () => `+=${window.innerHeight * 1.08}`, scrub: .62, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
      timeline.to(stems, { strokeDashoffset: 0, duration: .25, stagger: .006, ease: "none" }, 0)
        .to(branches, { opacity: 1, duration: .06 }, .24).to(branchPaths, { strokeDashoffset: 0, duration: .21, stagger: .008, ease: "none" }, .24)
        .to(leaves, { scale: 1, opacity: 1, rotateX: 0, rotateY: 0, duration: .25, stagger: .012, ease: "back.out(1.15)" }, .31)
        .to(buds, { scale: 1, opacity: 1, rotate: 0, duration: .23, stagger: .025, ease: "back.out(1.35)" }, .47)
        .to(petals, { scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0, duration: .3, stagger: .008, ease: "back.out(1.4)" }, .68)
        .to(".botanical-flower__shadow", { scale: 1, opacity: .52, duration: .17 }, .72)
        .to(".botanical-flower__core, .botanical-flower__core-light", { scale: 1, opacity: 1, duration: .14, stagger: .01 }, .84)
        .to(content, { y: 0, opacity: 1, scale: 1, duration: .34 }, .37);
    }, section);
    return () => context.revert();
  }, []);
  return <section ref={sectionRef} className="final-cta botanical-cta" id="contact" aria-labelledby="contact-title">
    <div className="final-cta__atmosphere" aria-hidden="true"><div className="final-cta__light"/><div className="final-cta__depth"/><div className="final-cta__grain"/><div className="final-cta__vignette"/></div>
    <BotanicalGrowth/><div ref={contentRef} className="final-cta__content botanical-cta__content"><h2 id="contact-title">Premium websites that move businesses forward.</h2><p className="final-cta__subline">Strategy, design and development crafted to turn strong businesses into stronger digital brands.</p><a className="final-cta__button" href="mailto:hello@kreuweb.com"><span>Book a call</span><span aria-hidden="true">↗</span></a></div>
  </section>;
}
