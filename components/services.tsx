const services = [
  "Strategy & Design",
  "Web Development",
  "Marketing & SEO",
  "Software Systems",
] as const;

export function Services() {
  return (
    <section className="services" id="expertise" aria-labelledby="services-title">
      <div className="services__pin">
        <header className="services__header">
          <h2 id="services-title">From strategy to growth</h2>
          <p>
            We connect design, development and digital visibility into one system
            built to move your business forward.
          </p>
          <a className="services__cta" href="mailto:hello@kreuweb.com">
            <span>Book a call</span>
            <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className="workflow" aria-label="Connected services workflow">
          {services.map((service, index) => (
            <div className="workflow__step" key={service}>
              <div className="workflow-node" data-workflow-node>
                <i aria-hidden="true" />
                <h3>{service}</h3>
              </div>
              <div className="workflow-connector" data-workflow-connector aria-hidden="true">
                <span />
              </div>
              {index === services.length - 1 && (
                <div className="workflow-node workflow-node--outcome" data-workflow-node>
                  <i aria-hidden="true" />
                  <p>Stronger digital presence</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
