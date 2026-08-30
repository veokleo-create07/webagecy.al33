"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./site-header.module.css";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#expertise" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isOverFinalCta, setIsOverFinalCta] = useState(false);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    let frame = 0;
    let timeout = 0;

    const prepare = () => {
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setIsReady(true);
        return;
      }
      if (mobile.matches) {
        setIsReady(false);
        timeout = window.setTimeout(() => {
          frame = window.requestAnimationFrame(() => setIsReady(true));
        }, 780);
        return;
      }
      setIsReady(false);
      timeout = window.setTimeout(() => {
        frame = window.requestAnimationFrame(() => setIsReady(true));
      }, 140);
    };

    prepare();
    mobile.addEventListener("change", prepare);

    return () => {
      mobile.removeEventListener("change", prepare);
      window.clearTimeout(timeout);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const updateNavigation = () => {
      const currentY = window.scrollY;
      const richMotion = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;
      setIsCompact(richMotion && currentY > 72 && currentY > previousY + 1);
      setIsScrolled(currentY > 32);
      previousY = currentY;
      frame = 0;
    };

    const handleScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateNavigation);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    firstMenuLink.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    const finalCta = document.querySelector<HTMLElement>(".final-cta");
    if (!finalCta) return;
    const observer = new IntersectionObserver(
      entries => setIsOverFinalCta(entries.some(entry => entry.isIntersecting)),
      { rootMargin: "0px 0px -28% 0px", threshold: .01 },
    );
    observer.observe(finalCta);
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setIsMenuOpen(false);
  const goToContact = () => {
    closeMenu();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("contact")?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <header
      className={`${styles.header} site-header${isCompact ? " is-compact" : ""}${
        isMenuOpen ? " is-menu-open" : ""
      }${isScrolled ? " has-scrolled" : ""}${isReady ? " is-ready" : ""}`}
      data-final-cta={isOverFinalCta ? "visible" : "hidden"}
      onPointerMove={event => {
        if (event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--glass-light-x", `${Math.round((event.clientX - bounds.left) / bounds.width * 100)}%`);
      }}
      onPointerLeave={event => event.currentTarget.style.setProperty("--glass-light-x", "32%")}
    >
      <div className="glass-nav">
        <span className={styles.volume} aria-hidden="true" />
        <div className="glass-nav__topline">
          <a className="wordmark" href="#top" aria-label="KREU WEB, home" onClick={closeMenu}>
            <span className={styles.mark} aria-hidden="true"><img src="/brand/kreu-liquid-mark.png" alt="" width="690" height="387" /></span>
            <span>KREU WEB</span>
          </a>

          <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className={`header-shimmer ${styles.opticalControl}`}
            onClick={goToContact}
          >
            <span className={styles.controlLabel}><span>Start a project</span><span className="header-shimmer__arrow" aria-hidden="true">↗</span></span>
          </button>

          <button
            ref={menuButton}
            className="menu-toggle"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span>{isMenuOpen ? "Close" : "Menu"}</span>
            <span className="menu-toggle__glyph" aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>

        <div className="mobile-menu" id="mobile-menu" aria-hidden={!isMenuOpen}>
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <a
                ref={index === 0 ? firstMenuLink : undefined}
                key={item.href}
                href={item.href}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                <span>{item.label}</span>
                <span aria-hidden="true">↘</span>
              </a>
            ))}
            <button
              type="button"
              className={`mobile-menu__shimmer ${styles.opticalControl}`}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={goToContact}
            >
              <span className={styles.controlLabel}><span>Start a project</span><span aria-hidden="true">↗</span></span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
