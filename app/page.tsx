import { FoundationReveal } from "@/components/foundation-reveal";
import { SiteHeader } from "@/components/site-header";
import { SelectedWork } from "@/components/selected-work";
import { Services } from "@/components/services";
import { BloomCTA } from "@/components/bloom-cta";

export default function Home() {
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
              <span>We build websites that get</span>
              <span>businesses taken seriously.</span>
            </h1>

            <p className="hero__intro" data-intro>
              High-converting websites for ambitious businesses across Albania &amp; Kosovo.
            </p>

            <div className="hero__actions" data-intro>
              <a className="hero__primary" href="#contact">
                Start a project <span aria-hidden="true">↗</span>
              </a>
              <a className="hero__secondary" href="#work">
                View our work <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        <SelectedWork />

        <Services />

        <BloomCTA />

        <footer className="site-footer">
          <div className="site-footer__main">
            <div className="site-footer__identity">
              <p className="site-footer__wordmark">KREU WEB</p>
              <p className="site-footer__statement">
                <span>Web design.</span>
                <span>Development.</span>
                <span>Digital experiences.</span>
              </p>
            </div>

            <div className="site-footer__links">
              <nav aria-label="Footer navigation">
                <p>Navigation</p>
                <a href="#work">Work</a>
                <a href="#expertise">Services</a>
                <a href="#contact">Contact</a>
              </nav>

              <nav aria-label="Social links">
                <p>Social</p>
                <a href="https://www.instagram.com/" rel="noreferrer" target="_blank">
                  Instagram
                </a>
                <a href="https://www.linkedin.com/" rel="noreferrer" target="_blank">
                  LinkedIn
                </a>
              </nav>

              <div>
                <p>Contact</p>
                <a href="mailto:hello@kreuweb.com">Email</a>
              </div>
            </div>
          </div>

          <p className="site-footer__copyright">© 2026 Kreu Web</p>
        </footer>
      </div>
    </main>
  );
}
