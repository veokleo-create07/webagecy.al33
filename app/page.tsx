"use client";
import { useLanguage } from "@/components/language-provider";
import { FoundationReveal } from "@/components/foundation-reveal";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { BookingLink } from "@/components/booking/booking-provider";
import { SiteHeader } from "@/components/site-header";
import { SelectedWork } from "@/components/selected-work";
import { Services } from "@/components/services";
import { FinalCTA } from "@/components/digital-matter-cta";
import Footer1 from "@/components/ui/footer-section-1";

export default function Home() {
  const { t } = useLanguage();
  return (
    <main id="top">
      <FoundationReveal />
      <div className="page-shell">
        <SiteHeader />

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__atmosphere" aria-hidden="true">
            <div className="hero__light" />
            <div className="hero__depth" />
            <div className="hero__grain" />
            <div className="hero__vignette" />
          </div>

          <div className="hero__content">
            <h1 id="hero-title" className="hero__headline" data-intro>
              <span>{t("Build a business")}</span>
              <span>{t("people take seriously.")}</span>
            </h1>

            <p className="hero__intro" data-intro>
              {t("We strengthen how your business is seen, trusted and chosen — so it can grow with more confidence.")}
            </p>

            <div className="hero__actions" data-intro>
              <BookingLink className="hero__primary">
                {t("Book a discovery call")} <span aria-hidden="true"><ArrowIcon /></span>
              </BookingLink>
              <a className="hero__secondary" href="#work">
                {t("View our work")} <span aria-hidden="true"><ArrowIcon direction="down" /></span>
              </a>
            </div>
          </div>
        </section>

        <SelectedWork />

        <Services />

        <FinalCTA />

        <Footer1 />
      </div>
    </main>
  );
}
