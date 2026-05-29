import heroArt from './assets/hero-art.svg';

const domains = [
  {
    host: 'boogertime.shop',
    badge: 'primary',
    note: 'Main stage. Cleanest entry point for the brand.',
  },
  {
    host: 'www.boogertime.shop',
    badge: 'mirror',
    note: 'Canonical web alias for public traffic.',
  },
  {
    host: 'boogertime.xyz',
    badge: 'legacy',
    note: 'Still live in DNS for compatibility and redirects.',
  },
  {
    host: 'boogertime.club',
    badge: 'brand',
    note: 'Reserved for the club identity and future drops.',
  },
];

const routes = [
  { label: '/', value: 'Landing page' },
  { label: '/api', value: 'Service lane' },
  { label: '/dash', value: 'Operator view' },
  { label: '/booger', value: 'Internal access' },
];

function StatusPill({ label, tone = 'neutral' }) {
  return <span className={`status-pill ${tone}`}>{label}</span>;
}

function DomainCard({ host, badge, note }) {
  return (
    <article className="domain-card">
      <div className="domain-card__top">
        <strong>{host}</strong>
        <StatusPill label={badge} tone={badge} />
      </div>
      <p>{note}</p>
    </article>
  );
}

function RouteRow({ label, value }) {
  return (
    <div className="route-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default function App() {
  return (
    <main className="page-shell">
      <section className="hero">
        <header className="topbar">
          <div>
            <p className="eyebrow">BoogerTimeClub</p>
            <h1>Live, loud, and pointed at the server.</h1>
          </div>
          <div className="topbar__status">
            <StatusPill label="LIVE" tone="live" />
            <span>served through Caddy on port 3000</span>
          </div>
        </header>

        <div className="hero__grid">
          <div className="hero__copy">
            <p className="lede">
              A retro kinetic front door for the club domains. Fast to load, hard to ignore, and
              built to sit cleanly behind the current server setup.
            </p>

            <div className="hero__actions">
              <a className="button button--primary" href="#domains">
                Enter the main stage
              </a>
              <a className="button button--secondary" href="#routes">
                See the routes
              </a>
            </div>

            <dl className="metrics">
              <div>
                <dt>Upstream</dt>
                <dd>localhost:3000</dd>
              </div>
              <div>
                <dt>API lane</dt>
                <dd>localhost:8000</dd>
              </div>
              <div>
                <dt>DNS</dt>
                <dd>already pointed</dd>
              </div>
            </dl>
          </div>

          <div className="hero__visual" aria-label="Retro server visual">
            <img src={heroArt} alt="" />
            <div className="hero__visual-overlay">
              <span className="scanline" />
              <div className="visual-card visual-card--top">
                <span>signal</span>
                <strong>stable</strong>
              </div>
              <div className="visual-card visual-card--bottom">
                <span>traffic</span>
                <strong>open</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="info-band" id="domains">
        <div className="section-heading">
          <p className="eyebrow">Domains</p>
          <h2>Everything routes through a small, readable set of names.</h2>
        </div>
        <div className="domain-grid">
          {domains.map((domain) => (
            <DomainCard key={domain.host} {...domain} />
          ))}
        </div>
      </section>

      <section className="info-band info-band--split" id="routes">
        <div className="section-heading">
          <p className="eyebrow">Server map</p>
          <h2>Simple paths, no mystery stack.</h2>
        </div>
        <div className="routes-panel">
          {routes.map((route) => (
            <RouteRow key={route.label} {...route} />
          ))}
        </div>
      </section>

      <section className="status-strip">
        <div>
          <p className="eyebrow">Status</p>
          <h2>Ready for a live site, a redirect, or a bigger build later.</h2>
        </div>
        <p>
          The page is static at heart, but it is packaged to sit behind the current Caddy upstream
          without extra moving parts.
        </p>
      </section>
    </main>
  );
}
