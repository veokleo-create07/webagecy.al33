"use client";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BookingLink } from "@/components/booking/booking-provider";
import { useLanguage } from "@/components/language-provider";

import { type CSSProperties, type PointerEvent, useEffect, useRef } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type FragmentKind = "plane" | "strip" | "shard" | "frame";
type Fragment = {
  kind: FragmentKind;
  final: [number, number];
  from: [number, number];
  rotation: [number, number, number];
  depth: number;
  arc: number;
  opacity: number;
  start: number;
  quiet?: boolean;
};

const fragments: Fragment[] = [
  { kind: "plane", final: [-37, -23], from: [-78, -55], rotation: [10, 19, -8], depth: 48, arc: -7, opacity: .58, start: .02 },
  { kind: "strip", final: [-32, -7], from: [-82, -9], rotation: [-7, 27, -13], depth: 82, arc: 9, opacity: .48, start: .06 },
  { kind: "frame", final: [-39, 15], from: [-84, 46], rotation: [12, 22, 7], depth: 34, arc: -8, opacity: .46, start: .1 },
  { kind: "shard", final: [-24, -32], from: [-37, -79], rotation: [24, -17, 26], depth: 110, arc: 7, opacity: .38, start: .13 },
  { kind: "plane", final: [-27, 29], from: [-58, 76], rotation: [-13, 28, -5], depth: 66, arc: -10, opacity: .42, start: .17 },
  { kind: "shard", final: [-45, 2], from: [-91, 11], rotation: [18, 35, 17], depth: -10, arc: 6, opacity: .3, start: .2, quiet: true },
  { kind: "strip", final: [-14, -39], from: [-8, -84], rotation: [-18, 12, -7], depth: 72, arc: 6, opacity: .34, start: .21, quiet: true },
  { kind: "plane", final: [36, -25], from: [81, -58], rotation: [-11, -21, 9], depth: 58, arc: 8, opacity: .55, start: .04 },
  { kind: "frame", final: [39, -5], from: [87, -18], rotation: [14, -26, 12], depth: 96, arc: -9, opacity: .5, start: .08 },
  { kind: "strip", final: [34, 18], from: [79, 51], rotation: [-8, -24, -6], depth: 42, arc: 8, opacity: .47, start: .11 },
  { kind: "shard", final: [23, -34], from: [42, -82], rotation: [22, 16, -24], depth: 122, arc: -7, opacity: .36, start: .15 },
  { kind: "plane", final: [27, 31], from: [55, 82], rotation: [12, -31, 5], depth: 74, arc: 10, opacity: .45, start: .18 },
  { kind: "shard", final: [45, 8], from: [93, 20], rotation: [-17, -36, -15], depth: 4, arc: -6, opacity: .3, start: .22, quiet: true },
  { kind: "strip", final: [13, 39], from: [4, 86], rotation: [16, -14, 8], depth: 88, arc: -8, opacity: .34, start: .23, quiet: true },
];

const clamp = gsap.utils.clamp(0, 1);
const ease = (value: number) => value * value * (3 - 2 * value);
const ctaConfig = {
  desktop: { distance: .88, rotation: 1, depth: 1, blur: 2.1, from: 1, arc: 1 },
  tablet: { distance: .7, rotation: .55, depth: .45, blur: 1, from: .82, arc: .65 },
  mobile: { distance: .54, rotation: .22, depth: .12, blur: 0, from: .68, arc: .35 },
} as const;
const desktopFragments = new Set([0, 1, 2, 3, 4, 7, 8, 9, 11]);
const tabletFragments = new Set([0, 1, 2, 4, 7, 8, 9, 11]);
const mobileFragments = new Set([0, 1, 2, 7, 8, 9]);

function GlassFragment({ fragment, index }: { fragment: Fragment; index: number }) {
  return (
    <i
      className={`magnetic-fragment magnetic-fragment--${fragment.kind}${fragment.quiet ? " magnetic-fragment--quiet" : ""}`}
      data-magnetic-fragment
      data-index={index}
      style={{ "--final-x": `${fragment.final[0]}vw`, "--final-y": `${fragment.final[1]}vh` } as CSSProperties}
    >
      <span className="magnetic-fragment__surface" />
      {(fragment.kind === "plane" || fragment.kind === "frame") && <span className="magnetic-fragment__trace" />}
    </i>
  );
}

type AppLanguage = "sq" | "en";

const DEMO_FPS = 30;
const DEMO_DURATION = 360;
const ROUTE_LENGTH = 255;

function progress(frame: number, start: number, end: number) {
  return interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(.22, 1, .36, 1),
  });
}

function cycleVisibility(frame: number) {
  return Math.min(progress(frame, 0, 18), interpolate(frame, [332, 359], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  }));
}

function revealStyle(frame: number, start: number, end: number, distance = 7): CSSProperties {
  const amount = progress(frame, start, end);
  return {
    opacity: amount * cycleVisibility(frame),
    transform: `translate3d(0, ${(1 - amount) * distance}px, 0)`,
  };
}

const appInterface = {
  en: {
    overview: "Operations overview",
    greeting: "Good morning, Erion",
    date: "Tuesday, 3 September",
    operational: "Network stable",
    active: "Active deliveries",
    activeNote: "Across 7 active routes",
    delivered: "Delivered today",
    delayed: "Delayed",
    fleet: "Fleet available",
    performance: "On-time performance",
    sevenDays: "This week",
    recent: "Recent shipments",
    viewAll: "View all",
    upcoming: "Upcoming arrivals",
    nextWindow: "Next 90 minutes",
    arrivalRoutes: ["Prishtina · Dock 04", "Tirana · Hub 02"],
    arrivalStatus: ["On time", "12 min early"],
    routes: ["Tirana · Prishtina", "Durrës · Skopje", "Milan · Tirana"],
    etas: ["14:30", "17:45", "Tomorrow"],
    drivers: ["AK", "EL", "NM"],
    transit: "In transit",
    scheduled: "Scheduled",
    etaShort: "ETA",
    navigation: ["Dashboard", "Shipments", "Fleet", "Clients", "Profile"],
    detail: "Shipment details",
    liveTracking: "Live tracking",
    updated: "Updated 1 min ago",
    from: "From",
    to: "To",
    eta: "Estimated arrival",
    progress: "Route progress",
    cargo: "Cargo",
    cargoType: "3 EUR pallets",
    weight: "Weight",
    weightValue: "1,240 kg",
    volume: "Volume",
    volumeValue: "8.6 m³",
    service: "Service level",
    priority: "Express",
    vehicle: "Vehicle",
    vehicleValue: "Actros · 01-482-KS",
    driver: "Assigned driver",
    trips: "trips",
    client: "Client",
    timeline: "Checkpoints",
    pickedUp: "Collected in Tirana",
    border: "Border cleared",
    arriving: "Arrival in Prishtina",
    contact: "Contact client",
    arrival: "24 May · 14:30",
    origin: "Tirana, AL",
    destination: "Prishtina, XK",
  },
  sq: {
    overview: "Përmbledhja e operacioneve",
    greeting: "Mirëmëngjes, Erion",
    date: "E martë, 3 shtator",
    operational: "Rrjeti stabil",
    active: "Dërgesa aktive",
    activeNote: "Në 7 linja aktive",
    delivered: "Dorëzuar sot",
    delayed: "Me vonesë",
    fleet: "Flota e lirë",
    performance: "Dërgesa në orar",
    sevenDays: "Këtë javë",
    recent: "Dërgesat e fundit",
    viewAll: "Shiko të gjitha",
    upcoming: "Mbërritjet e radhës",
    nextWindow: "90 minutat e ardhshme",
    arrivalRoutes: ["Prishtinë · Porta 04", "Tiranë · Qendra 02"],
    arrivalStatus: ["Në orar", "12 min më herët"],
    routes: ["Tiranë · Prishtinë", "Durrës · Shkup", "Milano · Tiranë"],
    etas: ["14:30", "17:45", "Nesër"],
    drivers: ["AK", "EL", "NM"],
    transit: "Në transit",
    scheduled: "Planifikuar",
    etaShort: "Mbërrin",
    navigation: ["Përmbledhje", "Dërgesat", "Flota", "Klientët", "Profili"],
    detail: "Detajet e dërgesës",
    liveTracking: "Gjurmim live",
    updated: "Përditësuar 1 min më parë",
    from: "Nga",
    to: "Në",
    eta: "Mbërritja e parashikuar",
    progress: "Ecuria e rrugës",
    cargo: "Ngarkesa",
    cargoType: "3 paleta EUR",
    weight: "Pesha",
    weightValue: "1.240 kg",
    volume: "Volumi",
    volumeValue: "8,6 m³",
    service: "Niveli i shërbimit",
    priority: "Express",
    vehicle: "Automjeti",
    vehicleValue: "Actros · 01-482-KS",
    driver: "Korrieri",
    trips: "udhëtime",
    client: "Klienti",
    timeline: "Pikat e rrugës",
    pickedUp: "Marrë në Tiranë",
    border: "Kaloi kufirin",
    arriving: "Mbërritja në Prishtinë",
    contact: "Kontakto klientin",
    arrival: "24 maj · 14:30",
    origin: "Tiranë, AL",
    destination: "Prishtinë, XK",
  },
} as const;

function NexaWordmark() {
  return <span className="nexa-wordmark">NEXA</span>;
}

function PhoneStatusBar() {
  return (
    <div className="logistics-statusbar">
      <span>9:41</span>
      <i className="logistics-island" />
      <span className="logistics-system-icons" aria-hidden="true"><i /><i /><i /></span>
    </div>
  );
}

function DashboardScreen({ language }: { language: AppLanguage }) {
  const frame = useCurrentFrame();
  const copy = appInterface[language];
  const activeDeliveries = Math.round(interpolate(progress(frame, 20, 68), [0, 1], [0, 24]));
  const delivered = Math.round(interpolate(progress(frame, 76, 126), [0, 1], [32, 48]));
  const delayed = Math.round(interpolate(progress(frame, 84, 132), [0, 1], [5, 3]));
  const fleet = Math.round(interpolate(progress(frame, 92, 138), [0, 1], [15, 18]));
  const chart = progress(frame, 38, 104);
  const activeRow = progress(frame, 176, 204) * (1 - progress(frame, 286, 318));
  const statusPulse = progress(frame, 202, 214) * (1 - progress(frame, 214, 228));
  const bars = [44, 63, 54, 78, 71, 89, 94];
  return (
    <div className="nexa-remotion-stage">
    <div className="logistics-app logistics-app--dashboard">
      <PhoneStatusBar />
      <div className="logistics-app__header">
        <span className="logistics-app__menu" aria-hidden="true"><i /><i /></span>
        <NexaWordmark />
        <span className="logistics-app__profile">EK</span>
      </div>
      <div className="logistics-app__body">
        <div className="logistics-title-row" style={revealStyle(frame, 0, 26)}><span><small>{copy.date}</small><h3>{copy.greeting}</h3></span><i>{copy.operational}</i></div>
        <section className="logistics-metric" style={revealStyle(frame, 8, 40, 9)}>
          <div><span>{copy.active}</span><strong>{activeDeliveries}</strong><small>{copy.activeNote}</small></div>
          <div className="logistics-trend">
            <svg viewBox="0 0 132 68" aria-hidden="true">
              <path className="logistics-chart-grid" d="M2 13 H130 M2 34 H130 M2 55 H130" />
              <path className="logistics-chart-line" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - chart} d="M4 55 C17 52 23 40 35 43 S53 53 65 37 S80 25 91 29 S106 17 116 16 S124 9 130 7" />
              <circle cx="130" cy="7" r="3" style={{ opacity: chart }} />
            </svg>
            <span style={{ opacity: progress(frame, 84, 108) }}>+8.4%</span>
          </div>
        </section>
        <div className="logistics-summary">
          <span style={revealStyle(frame, 58, 86)}><small>{copy.delivered}</small><strong>{delivered}</strong><i>+12</i></span>
          <span style={revealStyle(frame, 68, 96)}><small>{copy.delayed}</small><strong>{delayed}</strong><i>−2</i></span>
          <span style={revealStyle(frame, 78, 106)}><small>{copy.fleet}</small><strong>{fleet}/22</strong><i>{Math.round(fleet / 22 * 100)}%</i></span>
        </div>
        <div className="logistics-performance-heading" style={revealStyle(frame, 84, 112, 4)}><span>{copy.performance}</span><small>96.8% · {copy.sevenDays}</small></div>
        <div className="logistics-performance" style={{ opacity: cycleVisibility(frame) }}>{bars.map((height, index) => <i key={height} style={{ height: `${height * progress(frame, 90 + index * 5, 126 + index * 5)}%` }} />)}</div>
        <div className="logistics-list-heading" style={revealStyle(frame, 100, 126, 4)}><span>{copy.recent}</span><small>{copy.viewAll}</small></div>
        <div className="logistics-shipments">
          {["NXA-2841", "NXA-2837", "NXA-2829"].map((id, index) => (
            <div key={id} style={{
              ...revealStyle(frame, 112 + index * 18, 142 + index * 18, 6),
              background: index === 0 ? `rgba(67, 86, 76, ${activeRow * .075})` : undefined,
              boxShadow: index === 0 ? `inset 2px 0 rgba(67, 86, 76, ${activeRow * .72})` : undefined,
            }}>
              <span className="shipment-route"><b>{id}</b><small>{copy.routes[index]}</small></span>
              <span className="shipment-eta"><small>{copy.etaShort}</small><b>{copy.etas[index]}</b></span>
              <span className="shipment-driver">{copy.drivers[index]}</span>
              <span className={`shipment-status shipment-status--${index === 1 ? "scheduled" : "transit"}`}><i style={index === 0 ? { transform: `scale(${1 + statusPulse * .42})`, boxShadow: `0 0 0 ${statusPulse * 4}px rgba(67,86,76,${statusPulse * .12})` } : undefined} />{index === 1 ? copy.scheduled : copy.transit}</span>
            </div>
          ))}
        </div>
        <div className="logistics-list-heading logistics-list-heading--arrivals" style={revealStyle(frame, 164, 190, 4)}><span>{copy.upcoming}</span><small>{copy.nextWindow}</small></div>
        <div className="logistics-arrivals" style={revealStyle(frame, 176, 208, 5)}>
          {["14:30", "15:10"].map((time, index) => (
            <div key={time}><strong>{time}</strong><span><b>{copy.arrivalRoutes[index]}</b><small>NXA-{index === 0 ? "2841" : "2816"}</small></span><i>{copy.arrivalStatus[index]}</i></div>
          ))}
        </div>
      </div>
      <div className="logistics-tabbar" style={{ opacity: cycleVisibility(frame) }}>
        {copy.navigation.map((item, index) => <span key={item} className={index === 0 ? "is-active" : ""}><i data-icon={index} />{item}</span>)}
      </div>
    </div>
    </div>
  );
}

function TrackingScreen({ language }: { language: AppLanguage }) {
  const frame = useCurrentFrame();
  const copy = appInterface[language];
  const route = progress(frame, 34, 132);
  const deliveryProgress = Math.round(interpolate(progress(frame, 112, 194), [0, 1], [18, 73]));
  const markerX = interpolate(route, [0, .2, .42, .64, .82, 1], [27, 60, 70, 111, 146, 180]);
  const markerY = interpolate(route, [0, .2, .42, .64, .82, 1], [155, 137, 111, 92, 65, 39]);
  const markerRotation = interpolate(route, [0, .2, .42, .64, .82, 1], [-12, -18, -62, -18, -10, -34]);
  const markerVisible = progress(frame, 46, 64) * cycleVisibility(frame);
  const statusActive = frame >= 142;
  return (
    <div className="nexa-remotion-stage">
    <div className="logistics-app logistics-app--tracking">
      <PhoneStatusBar />
      <div className="tracking-heading"><span aria-hidden="true">‹</span><NexaWordmark /><i aria-hidden="true"><b /><b /><b /></i></div>
      <div className="tracking-title" style={revealStyle(frame, 4, 30)}><span><small>{copy.detail}</small><strong>NXA-2841</strong></span><i style={{ opacity: progress(frame, 124, 150) }}><b />{statusActive ? copy.transit : copy.scheduled}</i></div>
      <div className="tracking-map" style={revealStyle(frame, 12, 42, 5)}>
        <span className="tracking-map__grid" />
        <div className="tracking-map__meta" style={{ opacity: progress(frame, 62, 92) }}><span><i />{copy.liveTracking}</span><small>{copy.updated}</small></div>
        <svg viewBox="0 0 220 190" aria-hidden="true">
          <path className="tracking-map__roads" d="M-8 38 C42 52 65 24 109 40 S178 78 230 48 M12 122 C53 105 90 132 126 112 S181 81 226 100 M-5 164 C41 143 69 177 112 156 S179 121 230 139 M54 -4 C61 43 37 82 58 126 S86 167 76 196 M170 -8 C146 36 170 68 154 111 S130 159 144 198 M102 -8 C93 41 112 75 94 118 S97 173 112 199" />
          <path className="tracking-map__route-shadow" strokeDasharray={ROUTE_LENGTH} strokeDashoffset={ROUTE_LENGTH * (1 - route)} d="M27 155 C48 150 66 139 65 111 S92 101 111 92 S112 70 137 68 S164 56 180 39" />
          <path className="tracking-map__route" strokeDasharray={ROUTE_LENGTH} strokeDashoffset={ROUTE_LENGTH * (1 - route)} d="M27 155 C48 150 66 139 65 111 S92 101 111 92 S112 70 137 68 S164 56 180 39" />
          <circle cx="27" cy="155" r="5" style={{ opacity: progress(frame, 50, 68) }} /><circle cx="180" cy="39" r="5" style={{ opacity: progress(frame, 104, 126) }} />
          <circle className="tracking-map__checkpoint" cx="66" cy="111" r="3" style={{ opacity: progress(frame, 74, 88) }} /><circle className="tracking-map__checkpoint" cx="137" cy="68" r="3" style={{ opacity: progress(frame, 94, 108) }} />
          <rect x="-9" y="-9" width="18" height="18" rx="4" transform={`translate(${markerX} ${markerY}) rotate(${markerRotation})`} style={{ opacity: markerVisible }} />
        </svg>
        <span className="tracking-map__city tracking-map__city--from" style={{ opacity: progress(frame, 58, 78) }}>{copy.origin.split(",")[0]}</span>
        <span className="tracking-map__city tracking-map__city--to" style={{ opacity: progress(frame, 98, 120) }}>{copy.destination.split(",")[0]}</span>
      </div>
      <div className="tracking-card" style={revealStyle(frame, 82, 116, 7)}>
        <div className="tracking-route"><span><small>{copy.from}</small><b>{copy.origin}</b></span><i aria-hidden="true"><svg viewBox="0 0 28 8"><path d="M1 4h24M21 1l4 3-4 3" /></svg></i><span><small>{copy.to}</small><b>{copy.destination}</b></span></div>
        <div className="tracking-arrival" style={{ opacity: progress(frame, 126, 152) }}><small>{copy.eta}</small><strong>{copy.arrival}</strong></div>
        <div className="tracking-progress"><i style={{ width: `${deliveryProgress}%` }} /></div>
        <div className="tracking-progress-label"><span>{copy.progress}</span><strong>{deliveryProgress}%</strong></div>
      </div>
      <div className="tracking-specs" style={revealStyle(frame, 138, 176, 6)}>
        <span><small>{copy.cargo}</small><b>{copy.cargoType}</b></span>
        <span><small>{copy.weight}</small><b>{copy.weightValue}</b></span>
        <span><small>{copy.volume}</small><b>{copy.volumeValue}</b></span>
        <span><small>{copy.service}</small><b>{copy.priority}</b></span>
        <span className="tracking-specs__wide"><small>{copy.vehicle}</small><b>{copy.vehicleValue}</b></span>
        <span className="tracking-specs__wide"><small>{copy.client}</small><b>Alba Trade</b></span>
      </div>
      <div className="tracking-party" style={revealStyle(frame, 162, 198, 5)}><span className="tracking-avatar">AK</span><span><small>{copy.driver}</small><b>Ardit Krasniqi</b></span><i><b>4.9</b><small>184 {copy.trips}</small></i></div>
      <div className="tracking-timeline" style={revealStyle(frame, 184, 222, 5)}>
        <strong>{copy.timeline}</strong>
        <div><span className="is-done"><i /><b>{copy.pickedUp}</b><small>08:10</small></span><span className="is-current"><i /><b>{copy.border}</b><small>11:42</small></span><span><i /><b>{copy.arriving}</b><small>14:30</small></span></div>
      </div>
      <div className="tracking-contact" style={revealStyle(frame, 212, 246, 4)}>{copy.contact}</div>
    </div>
    </div>
  );
}

function NexaScreenPlayer({ variant, language }: { variant: "front" | "rear"; language: AppLanguage }) {
  const player = useRef<PlayerRef>(null);
  const host = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = host.current;
    if (!element || reducedMotion) {
      player.current?.pause();
      player.current?.seekTo(286);
      return;
    }
    let visible = false;
    const sync = () => {
      if (visible && document.visibilityState === "visible") player.current?.play();
      else player.current?.pause();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, { threshold: .04, rootMargin: "120px 0px" });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      player.current?.pause();
    };
  }, [reducedMotion]);

  const Screen = variant === "front" ? DashboardScreen : TrackingScreen;
  return <div ref={host} className="nexa-remotion-player">
    <Player
      ref={player}
      component={Screen}
      inputProps={{ language }}
      durationInFrames={DEMO_DURATION}
      compositionWidth={390}
      compositionHeight={844}
      fps={DEMO_FPS}
      initialFrame={reducedMotion ? 286 : 0}
      autoPlay={false}
      loop={!reducedMotion}
      controls={false}
      clickToPlay={false}
      doubleClickToFullscreen={false}
      spaceKeyToPlayOrPause={false}
      acknowledgeRemotionLicense
      style={{ width: "100%", height: "100%" }}
    />
  </div>;
}

function PhoneDevice({ variant, language }: { variant: "front" | "rear"; language: AppLanguage }) {
  return (
    <div className={`coded-phone-position coded-phone-position--${variant}`} data-phone={variant}>
      <div className={`coded-phone coded-phone--${variant}`}>
        <span className="coded-phone__button coded-phone__button--top" />
        <span className="coded-phone__button coded-phone__button--middle" />
        <span className="coded-phone__button coded-phone__button--power" />
        <div className="coded-phone__rim">
          <div className="coded-phone__screen">
            <NexaScreenPlayer variant={variant} language={language} />
            <span className="coded-phone__screen-reflection" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FinalCTA() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const deviceStageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const visual = visualRef.current;
    const button = buttonRef.current;
    const frontPhone = section?.querySelector<HTMLElement>('[data-phone="front"]');
    const rearPhone = section?.querySelector<HTMLElement>('[data-phone="rear"]');
    if (!section || !content || !visual || !button) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add(
        {
          desktop: "(min-width: 1025px)",
          tablet: "(min-width: 768px) and (max-width: 1024px)",
          mobile: "(max-width: 767px)",
          short: "(max-height: 700px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        match => {
          const mode = match.conditions?.desktop ? "desktop" : match.conditions?.tablet ? "tablet" : "mobile";
          const config = ctaConfig[mode];
          const elements = gsap.utils.toArray<HTMLElement>("[data-magnetic-fragment]");
          const arcs = gsap.utils.toArray<SVGPathElement>(".magnetic-field__arcs path");
          const arcLengths = arcs.map(path => path.getTotalLength());
          const reduced = match.conditions?.reduced;
          const shouldPin = mode === "desktop" || (mode === "tablet" && !match.conditions?.short);
          let sceneHeight = section.clientHeight;
          const state = { progress: reduced ? 1 : 0 };

          const render = (progress: number) => {
            section.style.setProperty("--magnetic-progress", String(progress));
            section.style.setProperty("--magnetic-glow", String(.04 + progress * .03));
            elements.forEach((element, index) => {
              const spec = fragments[index];
              const visible = mode === "desktop" ? desktopFragments.has(index) : mode === "tablet" ? tabletFragments.has(index) : mobileFragments.has(index);
              if (!visible) {
                element.style.opacity = "0";
                return;
              }
              const local = ease(clamp((progress - spec.start) / (1 - spec.start)));
              const edge = mode === "mobile" ? 1.08 : 1;
              const finalX = spec.final[0] * edge;
              const finalY = spec.final[1] * (mode === "mobile" ? .92 : 1);
              const x = gsap.utils.interpolate(spec.from[0] * config.from, finalX, local);
              const y = gsap.utils.interpolate(spec.from[1] * config.from, finalY, local) + Math.sin(local * Math.PI) * spec.arc * config.arc;
              const bend = Math.sin(local * Math.PI * 1.15 + index * .73) * (1 - local) * 2.2 * config.rotation;
              const depth = (spec.depth * local - (1 - local) * 90) * config.depth;
              element.style.opacity = String(.035 + local * spec.opacity * (mode === "mobile" ? .62 : 1));
              element.style.filter = config.blur ? `blur(${(1 - local) * config.blur}px)` : "none";
              element.style.transform = mode === "mobile"
                ? `translate3d(${x}vw, ${y * sceneHeight / 100}px, 0) scale(${.82 + local * .18})`
                : `translate3d(${x}vw, ${y * sceneHeight / 100}px, ${depth}px) rotateX(${(spec.rotation[0] + (1 - local) * 38) * config.rotation}deg) rotateY(${spec.rotation[1] * config.rotation + bend * 5}deg) rotateZ(${spec.rotation[2] * config.rotation + bend}deg) scale(${.62 + local * .38})`;
            });

            arcs.forEach((path, index) => {
              const local = ease(clamp((progress - .08 - index * .025) / .74));
              path.style.strokeDasharray = String(arcLengths[index]);
              path.style.strokeDashoffset = String(arcLengths[index] * (1 - local));
              path.style.opacity = String(.035 + local * (mode === "desktop" ? .245 : mode === "tablet" ? .165 : .075));
            });

            const copyProgress = ease(clamp((progress - .14) / .44));
            const frontProgress = ease(clamp((progress - .02) / .68));
            const rearProgress = ease(clamp((progress - .16) / .62));
            const buttonProgress = ease(clamp((progress - .48) / .25));
            gsap.set(content, {
              opacity: (mode === "mobile" ? .92 : .82) + copyProgress * (mode === "mobile" ? .08 : .18),
              x: (mode === "desktop" ? -10 : 0) * (1 - copyProgress),
              y: (mode === "mobile" ? 5 : 4) * (1 - copyProgress),
            });
            gsap.set(visual, {
              opacity: 1,
            });
            if (rearPhone) gsap.set(rearPhone, {
              opacity: (mode === "mobile" ? .18 : .08) + rearProgress * (mode === "mobile" ? .72 : .92),
              x: (mode === "desktop" ? 54 : mode === "tablet" ? 12 : 0) * (1 - rearProgress),
              y: (mode === "desktop" ? 20 : mode === "tablet" ? 9 : 7) * (1 - rearProgress),
              z: mode === "desktop" ? -42 + rearProgress * 18 : mode === "tablet" ? -2 : 0,
              rotateX: mode === "desktop" ? -4 * (1 - rearProgress) : mode === "tablet" ? -(1 - rearProgress) : 0,
              rotateY: mode === "desktop" ? -9 + rearProgress * 3 : mode === "tablet" ? -2 + rearProgress : 0,
              rotateZ: mode === "desktop" ? 4 : mode === "tablet" ? 2 : 0,
              scale: (mode === "mobile" ? .97 : .94) + rearProgress * (mode === "mobile" ? .03 : .06),
            });
            if (frontPhone) gsap.set(frontPhone, {
              opacity: (mode === "mobile" ? .88 : .74) + frontProgress * (mode === "mobile" ? .12 : .26),
              x: (mode === "desktop" ? 24 : mode === "tablet" ? 6 : 0) * (1 - frontProgress),
              y: (mode === "desktop" ? 12 : 5) * (1 - frontProgress),
              z: mode === "desktop" ? 48 + frontProgress * 18 : mode === "tablet" ? 5 : 0,
              rotateX: mode === "desktop" ? -3 + frontProgress : mode === "tablet" ? -.75 + frontProgress * .35 : 0,
              rotateY: mode === "desktop" ? 7 - frontProgress * 2 : mode === "tablet" ? 2 - frontProgress : 0,
              rotateZ: mode === "desktop" ? -3 : mode === "tablet" ? -1.5 : 0,
              scale: (mode === "mobile" ? .985 : .96) + frontProgress * (mode === "mobile" ? .015 : .04),
            });
            gsap.set(button, { opacity: .84 + buttonProgress * .16, y: 4 * (1 - buttonProgress) });
          };

          render(state.progress);
          if (reduced) return;
          gsap.to(state, {
            progress: 1,
            ease: "none",
            onUpdate: () => render(state.progress),
            scrollTrigger: {
              trigger: section,
              start: shouldPin ? "top top" : "top 72%",
              end: shouldPin ? () => `+=${section.clientHeight * config.distance}` : "bottom 35%",
              scrub: mode === "mobile" ? .45 : .65,
              pin: shouldPin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: () => { sceneHeight = section.clientHeight; render(state.progress); },
            },
          });
        },
      );
    }, section);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const handleFieldParallax = (event: PointerEvent<HTMLElement>) => {
    const field = fieldRef.current;
    const deviceStage = deviceStageRef.current;
    if (!field || !deviceStage || !window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const x = (event.clientX / window.innerWidth - .5) * 7;
    const y = (event.clientY / window.innerHeight - .5) * 5;
    field.style.setProperty("--field-x", `${x}px`);
    field.style.setProperty("--field-y", `${y}px`);
    deviceStage.style.setProperty("--device-rx", `${-y * .16}deg`);
    deviceStage.style.setProperty("--device-ry", `${x * .18}deg`);
    deviceStage.style.setProperty("--device-x", `${x * .38}px`);
    deviceStage.style.setProperty("--device-y", `${y * .32}px`);
  };

  const handleLens = (event: PointerEvent<HTMLAnchorElement>) => {
    const button = buttonRef.current;
    if (!button || event.pointerType !== "mouse" || !window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const bounds = button.getBoundingClientRect();
    button.style.setProperty("--lens-x", `${((event.clientX - bounds.left) / bounds.width) * 100}%`);
    button.style.setProperty("--lens-y", `${((event.clientY - bounds.top) / bounds.height) * 100}%`);
  };

  return (
    <section
      ref={sectionRef}
      className="final-cta magnetic-cta"
      id="contact"
      aria-labelledby="contact-title"
      onPointerMove={handleFieldParallax}
      onPointerLeave={() => {
        const desktopPointer = window.matchMedia("(min-width: 1025px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches;
        fieldRef.current?.style.setProperty("--field-x", "0px");
        fieldRef.current?.style.setProperty("--field-y", "0px");
        deviceStageRef.current?.style.setProperty("--device-rx", "0deg");
        deviceStageRef.current?.style.setProperty("--device-ry", "0deg");
        deviceStageRef.current?.style.setProperty("--device-x", desktopPointer ? "0px" : "-8%");
        deviceStageRef.current?.style.setProperty("--device-y", "0px");
      }}
    >
      <div className="magnetic-cta__atmosphere" aria-hidden="true" />
      <div ref={fieldRef} className="magnetic-field" aria-hidden="true">
        <svg className="magnetic-field__arcs" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-80 690 C240 480 296 188 566 84" />
          <path d="M1520 650 C1220 468 1168 220 884 92" />
          <path d="M172 940 C318 748 442 715 570 692" />
          <path d="M1268 950 C1116 760 1002 726 870 700" />
        </svg>
        <div className="magnetic-field__depth">
          {fragments.map((fragment, index) => <GlassFragment key={index} fragment={fragment} index={index} />)}
        </div>
      </div>

      <div className="magnetic-cta__layout">
        <div ref={contentRef} className="final-cta__content magnetic-cta__content">
          <p className="final-cta__eyebrow">{t("For the next stage.")}</p>
          <h2 id="contact-title">{t("Make your business stand out where it matters.")}</h2>
          <p className="final-cta__subline">{t("A considered digital presence designed to strengthen trust, increase relevance and create new opportunities for the business.")}</p>
          <BookingLink
            ref={buttonRef}
            className="final-cta__button magnetic-cta__button"
            onPointerMove={handleLens}
            onPointerLeave={() => {
              buttonRef.current?.style.setProperty("--lens-x", "50%");
              buttonRef.current?.style.setProperty("--lens-y", "20%");
            }}
            style={{ "--lens-x": "50%", "--lens-y": "20%" } as CSSProperties}
          >
            <span>{t("Book a discovery call")}</span><span aria-hidden="true"><ArrowIcon /></span>
          </BookingLink>
        </div>

        <div ref={visualRef} className="magnetic-cta__visual" aria-hidden="true">
          <div ref={deviceStageRef} className="magnetic-device">
            <PhoneDevice variant="rear" language={language} />
            <PhoneDevice variant="front" language={language} />
            <span className="magnetic-device__contact-shadow" />
            <span className="magnetic-device__reflection" />
          </div>
        </div>
      </div>
    </section>
  );
}
