const phases = [
  ["Discover", "Signals reveal the audience, ambition, market and friction."],
  ["Define", "What matters reorganizes into one clear direction."],
  ["Design", "Type, imagery, grids and interaction begin to take form."],
  ["Build", "Every layer connects, gains depth and becomes functional."],
  ["Launch", "The complete system switches on as one digital experience."],
] as const;

export function Process() {
  return (
    <section className="kreu-engine" id="process" aria-labelledby="process-title">
      <div className="kreu-engine__pin">
        <header className="kreu-engine__header">
          <h2 id="process-title">How an idea becomes something real.</h2>
        </header>

        <div className="engine-scene" aria-hidden="true">
          <div className="engine-signals">
            {[
              ["Audience", "signal--audience"],
              ["Goals", "signal--goals"],
              ["Market", "signal--market"],
              ["Problems", "signal--problems"],
            ].map(([label, className]) => (
              <span className={`engine-signal ${className}`} data-engine-signal key={label}>
                {label}<i />
              </span>
            ))}
          </div>

          <div className="engine-structure">
            <i /><i /><i /><i /><i /><i />
          </div>

          <div className="engine-design">
            <i className="engine-layer engine-layer--type">Aa</i>
            <i className="engine-layer engine-layer--image" />
            <i className="engine-layer engine-layer--interface"><b /><b /><b /></i>
          </div>

          <div className="engine-build">
            <i /><i /><i /><i />
          </div>

          <div className="engine-core">
            <i /><i /><i /><i />
            <span>Your business</span>
          </div>

          <div className="engine-output">
            <span>KREU / DIGITAL SYSTEM</span>
            <strong>Built with clarity.<br />Ready for attention.</strong>
            <i /><i /><i />
          </div>
        </div>

        <div className="engine-phases">
          {phases.map(([title, description]) => (
            <div className="engine-phase" data-engine-phase key={title}>
              <p>{title}</p>
              <span>{description}</span>
            </div>
          ))}
        </div>

        <p className="engine-ready">Ready to move.</p>
      </div>
    </section>
  );
}
