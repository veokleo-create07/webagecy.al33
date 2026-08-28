"use client";

import { useEffect, useRef, useState } from "react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const navigation = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#expertise" },
  { label: "Process", href: "#process" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const firstMenuLink = useRef<HTMLAnchorElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => setIsReady(true));
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, []);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const updateNavigation = () => {
      const currentY = window.scrollY;
      setIsCompact(currentY > 72 && currentY > previousY);
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
      className={`site-header${isCompact ? " is-compact" : ""}${
        isMenuOpen ? " is-menu-open" : ""
      }${isScrolled ? " has-scrolled" : ""}${isReady ? " is-ready" : ""}`}
    >
      <div className="glass-nav">
        <div className="glass-nav__topline">
          <a className="wordmark" href="#top" aria-label="KREU WEB, home" onClick={closeMenu}>
            KREU WEB
          </a>

          <nav className="site-nav site-nav--desktop" aria-label="Primary navigation">
            {navigation.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <ShimmerButton
            type="button"
            size="sm"
            className="header-shimmer"
            shimmerColor="rgba(241, 239, 232, 0.78)"
            onClick={goToContact}
          >
            <span>Start a project</span>
            <span className="header-shimmer__arrow" aria-hidden="true">↗</span>
          </ShimmerButton>

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
            <ShimmerButton
              type="button"
              size="default"
              className="mobile-menu__shimmer"
              shimmerColor="rgba(241, 239, 232, 0.78)"
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={goToContact}
            >
              <span>Start a project</span>
              <span aria-hidden="true">↗</span>
            </ShimmerButton>
          </nav>
        </div>
      </div>
    </header>
  );
}
