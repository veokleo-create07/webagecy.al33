"use client";
import { useLanguage } from "@/components/language-provider";
import type { SVGProps } from "react";

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17.35" cy="6.75" r="1" fill="currentColor" />
    </svg>
  );
}

export function SocialCloud({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <a
        href="https://www.instagram.com/"
        target="_blank"
        rel="noreferrer"
        aria-label={t("Kreu Web on Instagram")}
        className="group flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.025] text-white/55 transition-[color,background-color,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055] hover:text-[#f2f0e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <InstagramIcon className="size-[18px] transition-transform duration-300 group-hover:scale-105" />
      </a>
    </div>
  );
}
