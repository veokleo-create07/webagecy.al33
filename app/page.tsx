import { FoundationReveal } from "@/components/foundation-reveal";
import { SiteHeader } from "@/components/site-header";
import { SelectedWork } from "@/components/selected-work";

const foundations = [
  {
    id: "expertise",
    eyebrow: "Expertise",
    title: "Strategy. Design. Technology.",
    note: "One senior team, from the first question to the final interaction.",
  },
  {
    id: "studio",
    eyebrow: "The studio",
    title: "Small by design. Serious about the work.",
    note: "An independent web agency partnering closely with ambitious people.",
  },
];

const processStages = [
  {
    title: "Discover",
    description: "Understand the business, audience and ambition.",
  },
  {
    title: "Define",
    description: "Create the strategy and digital direction.",
  },
  {
    title: "Design",
    description: "Build the visual and interaction system.",
  },
  {
    title: "Develop",
    description: "Turn the experience into fast, scalable software.",
  },
  {
    title: "Launch",
    description: "Ship, measure and continuously improve.",
  },
];

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

        <section className="perception-section" aria-labelledby="perception-title">
          <div className="perception-section__content">
            <h2 id="perception-title">
              <span>We don&apos;t just build websites.</span>
              <span>We build perception.</span>
            </h2>
            <p>
              Your website shapes how people see your business before they ever
              speak to you. We make sure that first impression carries the right
              weight.
            </p>
          </div>
        </section>

        <div className="section-flow">
          {foundations.map((section) => (
            <section
              className="foundation-section"
              id={section.id}
              key={section.id}
              aria-labelledby={`${section.id}-title`}
            >
              <p className="eyebrow" data-reveal>
                {section.eyebrow}
              </p>
              <div className="foundation-section__body" data-reveal>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <p>{section.note}</p>
              </div>
            </section>
          ))}
        </div>

        <section className="process-section" id="process" aria-labelledby="process-title">
          <header className="process-section__intro">
            <p className="eyebrow">Our process</p>
            <h2 id="process-title">
              <span>From idea</span>
              <span>to launch.</span>
            </h2>
          </header>

          <div className="process-list">
            {processStages.map((stage, index) => (
              <article
                className="process-stage"
                data-process-stage
                data-state={index === 0 ? "current" : "next"}
                key={stage.title}
              >
                <h3>{stage.title}</h3>
                <p>{stage.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta" id="contact" aria-labelledby="contact-title">
          <div className="final-cta__atmosphere" aria-hidden="true">
            <div className="final-cta__light" />
            <div className="final-cta__depth" />
            <div className="final-cta__grain" />
            <div className="final-cta__vignette" />
          </div>

          <div className="final-cta__content" data-final-reveal>
            <h2 id="contact-title">
              <span>Let&apos;s build</span>
              <span>something</span>
              <span>serious.</span>
            </h2>
            <a className="final-cta__button" href="mailto:hello@kreuweb.com">
              <span>Start a project</span>
              <span aria-hidden="true">→</span>
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
                <a href="#process">Process</a>
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
