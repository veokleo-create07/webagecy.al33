const services = [
  {
    slug: "web",
    title: "Web Development",
    description: "Fast, responsive websites engineered to turn attention into action.",
  },
  {
    slug: "marketing",
    title: "Marketing / SEO",
    description: "Search strategy and content systems that make the right business easier to find.",
  },
  {
    slug: "design",
    title: "Design",
    description: "Distinctive visual and interaction systems that give every touchpoint authority.",
  },
  {
    slug: "software",
    title: "Software Development",
    description: "Scalable digital products that connect complex operations into one clear experience.",
  },
] as const;

function ServiceVisual({ type }: { type: (typeof services)[number]["slug"] }) {
  return (
    <div className={`service-visual service-visual--${type}`} aria-hidden="true">
      {type === "web" && (
        <>
          <i className="web-layer web-layer--back" />
          <i className="web-layer web-layer--middle" />
          <i className="web-layer web-layer--front"><b /><b /><b /></i>
        </>
      )}
      {type === "marketing" && (
        <>
          <i className="search-field"><b /></i>
          <i className="search-line search-line--one" />
          <i className="search-line search-line--two" />
          <i className="search-line search-line--three" />
        </>
      )}
      {type === "design" && (
        <>
          <i className="design-type">Aa</i>
          <i className="design-rule design-rule--one" />
          <i className="design-rule design-rule--two" />
          <i className="design-grid" />
        </>
      )}
      {type === "software" && (
        <>
          <i className="system-line system-line--one" />
          <i className="system-line system-line--two" />
          <i className="system-node system-node--one" />
          <i className="system-node system-node--two" />
          <i className="system-node system-node--three" />
          <i className="system-node system-node--four" />
        </>
      )}
    </div>
  );
}

export function Services() {
  return (
    <section className="services" id="expertise" aria-labelledby="services-title">
      <div className="services__pin">
        <header className="services__header">
          <h2 id="services-title">Our services</h2>
          <p>Everything needed to turn a strong business into a strong digital presence.</p>
        </header>

        <div className="services__stage">
          <div className="services__items">
            {services.map((service) => (
              <article className="service-item" data-service-item key={service.slug}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>

          <div className="services__visuals">
            {services.map((service) => (
              <ServiceVisual key={service.slug} type={service.slug} />
            ))}
          </div>
        </div>

        <div className="services__closing">
          <h3>Built to move your business forward.</h3>
          <p>Strategy, craft and technology aligned around meaningful progress.</p>
          <a className="services__cta" href="mailto:hello@kreuweb.com">
            <span>Book a call</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
