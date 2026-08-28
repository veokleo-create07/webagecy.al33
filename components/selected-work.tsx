const projects = [
  {
    slug: "nova",
    name: "Nova Residences",
    category: "Real Estate",
    description: "A refined digital experience for modern residential developments.",
  },
  {
    slug: "maison",
    name: "Maison",
    category: "Luxury E-commerce",
    description: "A fashion-led storefront where editorial desire becomes effortless commerce.",
  },
  {
    slug: "lume",
    name: "Lume",
    category: "Aesthetic Clinic",
    description: "A calm, clinically precise experience for modern aesthetic care.",
  },
  {
    slug: "noir",
    name: "Noir",
    category: "Restaurant / Hospitality",
    description: "A cinematic reservation experience built around appetite and atmosphere.",
  },
  {
    slug: "velor",
    name: "Velor",
    category: "Premium Car Rental",
    description: "A performance-driven booking experience for exceptional cars.",
  },
] as const;

function NovaConcept() {
  return (
    <div className="concept-site concept-nova">
      <img src="/portfolio/nova-detail.jpg" alt="Contemporary luxury residence architecture" />
      <div className="concept-shade" />
      <header><b>NOVA / R</b><nav><span>Residences</span><span>Architecture</span><span>Neighbourhood</span></nav><span>Private viewings ↗</span></header>
      <div className="nova-hero"><p>Private residences · Tirana</p><h3>Life, framed<br />by architecture.</h3><span>Explore availability ↘</span></div>
      <div className="nova-detail"><img src="/portfolio/nova-main.jpg" alt="" /><span>Residence 04<br />Three bedrooms · 186 m²</span></div>
      <div className="nova-status"><span>Now selling</span><span>Completion · Autumn 2027</span></div>
    </div>
  );
}

function MaisonConcept() {
  return (
    <div className="concept-site concept-maison">
      <header><span>Shop · Editorial · About</span><b>Maison</b><span>Search &nbsp; Bag (0)</span></header>
      <div className="maison-wordmark">MAISON</div>
      <div className="maison-main"><img src="/portfolio/maison-detail.jpg" alt="Fashion editorial in Milan" /><span>Issue 06 · Milano</span></div>
      <div className="maison-copy"><p>The city edition</p><h3>Poise in<br /><i>motion.</i></h3><span>Discover the story →</span></div>
      <div className="maison-detail"><img src="/portfolio/maison-main.jpg" alt="" /><span>New season · Look 14</span></div>
      <div className="maison-product"><span>Silk column coat</span><span>Exclusive online</span><span>€ 1,280</span></div>
    </div>
  );
}

function LumeConcept() {
  return (
    <div className="concept-site concept-lume">
      <header><b>LUME°</b><nav><span>Treatments</span><span>Doctors</span><span>Philosophy</span></nav><span>Book a consultation ↗</span></header>
      <div className="lume-copy"><span>Skin intelligence · Tirana</span><h3>Results you see.<br /><i>Restraint you feel.</i></h3><p>Doctor-led aesthetic medicine designed around skin health, natural expression, and long-term confidence.</p><b>Meet your skin →</b></div>
      <div className="lume-main"><img src="/portfolio/lume-portrait.jpg" alt="Portrait focused on natural skin" /></div>
      <div className="lume-detail"><img src="/portfolio/lume-detail.jpg" alt="" /><span>Precision peel<br />45 min · From €120</span></div>
      <div className="lume-treatments"><span>Signature facial</span><span>Skin renewal</span><span>Injectables</span></div>
    </div>
  );
}

function NoirConcept() {
  return (
    <div className="concept-site concept-noir">
      <img className="noir-image" src="/portfolio/noir-main-2.jpg" alt="Contemporary fine dining room" />
      <div className="concept-shade" />
      <header><span>Menu &nbsp; Cellar &nbsp; Story</span><b>NOIR</b><span>Reserve a table ↗</span></header>
      <div className="noir-copy"><p>Tirana · Dinner, Tuesday—Sunday</p><h3>The night<br /><i>has a flavour.</i></h3><span>Discover the menu →</span></div>
      <div className="noir-detail"><img src="/portfolio/noir-main.jpg" alt="" /><span>Chef’s table<br />Eight seasonal courses</span></div>
      <div className="noir-hours"><span>Rruga e Durrësit, Tirana</span><span>18:30 — Late</span></div>
    </div>
  );
}

function VelorConcept() {
  return (
    <div className="concept-site concept-velor">
      <img className="velor-image" src="/portfolio/velor-main.jpg" alt="Black performance car in motion" />
      <div className="concept-shade" />
      <header><b>VELOR</b><nav><span>Fleet</span><span>Membership</span><span>Destinations</span></nav><span>Reserve ↗</span></header>
      <div className="velor-copy"><p>Porsche Panamera Turbo · Tirana</p><h3>Performance,<br />on your terms.</h3><span>Configure your drive →</span></div>
      <div className="velor-specs"><span>550 PS</span><span>0—100 · 3.8 sec</span><span>From €680 / day</span><span>24 / 7 concierge</span></div>
      <div className="velor-detail"><img src="/portfolio/velor-detail-2.jpg" alt="" /><span>Also available<br />Bugatti Chiron</span></div>
    </div>
  );
}

const concepts = {
  nova: NovaConcept,
  maison: MaisonConcept,
  lume: LumeConcept,
  noir: NoirConcept,
  velor: VelorConcept,
};

export function SelectedWork() {
  return (
    <section className="selected-work" id="work" aria-labelledby="work-title">
      <div className="selected-work__pin">
        <header className="selected-work__intro">
          <h2 id="work-title">Digital work with presence.</h2>
        </header>

        <div className="project-gallery" aria-live="polite">
          {projects.map((project) => {
            const Concept = concepts[project.slug];
            return (
              <article className={`project-panel project-${project.slug}`} key={project.slug}>
                <div className="project-stage">
                  <Concept />
                </div>
                <div className="project-copy">
                  <p>{project.category}</p>
                  <h3>{project.name}</h3>
                  <div>
                    <p>{project.description}</p>
                    <a href="#contact">View project <span aria-hidden="true">↗</span></a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
