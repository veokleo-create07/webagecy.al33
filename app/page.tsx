import { FoundationReveal } from "@/components/foundation-reveal";
import { SiteHeader } from "@/components/site-header";
import { SelectedWork } from "@/components/selected-work";
import { Services } from "@/components/services";

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

        <section className="final-cta" id="contact" aria-labelledby="contact-title">
          <div className="final-cta__atmosphere" aria-hidden="true">
            <div className="final-cta__light" />
            <div className="final-cta__depth" />
            <div className="final-cta__grain" />
            <div className="final-cta__vignette" />
          </div>

          <div className="final-cta__botanicals" aria-hidden="true">
            <img className="final-cta__roses final-cta__rose-growth" src="/images/cta-roses.png" alt="" />
            <img className="final-cta__roses final-cta__rose-bloom" src="/images/cta-roses.png" alt="" />
          </div>

          <div className="final-cta__content">
            <h2 id="contact-title">
              Premium websites that move businesses forward.
            </h2>
            <p className="final-cta__subline">
              Strategy, design and development crafted to turn strong businesses into stronger
              digital brands.
            </p>
            <a className="final-cta__button" href="mailto:hello@kreuweb.com">
              <span>Book a call</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

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
