import { FoundationReveal } from "@/components/foundation-reveal";
import { SiteHeader } from "@/components/site-header";
import { SelectedWork } from "@/components/selected-work";
import { Services } from "@/components/services";
import { FinalCTA } from "@/components/digital-matter-cta";

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

        <FinalCTA />

        <footer className="site-footer">
          <div className="site-footer__note">
            <span className="site-footer__fold" aria-hidden="true" />
            <div className="site-footer__main">
              <div className="site-footer__identity">
                <p className="site-footer__wordmark">KREU WEB</p>
                <p className="site-footer__availability"><span aria-hidden="true" />Currently booking Q4 projects</p>
                <p className="site-footer__statement">
                  <span>Web design.</span>
                  <span>Development.</span>
                  <span>Digital presence.</span>
                </p>
              </div>

              <div className="site-footer__links">
                <nav aria-label="Footer navigation">
                  <a href="#work">Work</a>
                  <a href="#expertise">Services</a>
                  <a href="#contact">Contact</a>
                </nav>

                <nav aria-label="Social links">
                  <p>Connect</p>
                  <a href="https://www.instagram.com/" rel="noreferrer" target="_blank">
                    Instagram
                  </a>
                </nav>

                <div>
                  <p>Say hello</p>
                  <a href="mailto:hello@kreuweb.com">hello@kreuweb.com</a>
                </div>
              </div>
            </div>

            <div className="site-footer__bottom">
              <p>© 2026 Kreu Web. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
