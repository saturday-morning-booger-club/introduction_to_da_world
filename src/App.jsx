import { useEffect, useState } from 'react';
import heroArt from './assets/hero-art.svg';

const spreadsheetUrl = encodeURI('/Introduction to Da World - Deployment Master.xlsx');

const domains = [
  {
    host: 'boogertime.xyz',
    badge: 'primary',
    note: 'Main brand information page and primary entry point.',
  },
  {
    host: 'www.boogertime.xyz',
    badge: 'mirror',
    note: 'Canonical web alias for public traffic.',
  },
  {
    host: 'boogertime.shop',
    badge: 'legacy',
    note: 'Legacy name kept around for compatibility and redirects.',
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

const dashboardCommandLabels = [
  'Build React App:',
  'Start App with PM2:',
  'Save PM2 State:',
  'Check PM2 Status:',
  'Test Nginx Config:',
  'Reload Nginx:',
  'Setup SSL:',
];

function clean(value) {
  return String(value ?? '').trim();
}

function valueFromLabeledRow(entry, label) {
  const cell = clean(entry[0]);
  if (!cell.startsWith(label)) {
    return '';
  }

  const directValue = clean(entry[1]);
  if (directValue) {
    return directValue;
  }

  return cell.slice(label.length).replace(/^[:\s-]+/, '').trim();
}

function firstMatchingValue(rows, label) {
  const row = rows.find((entry) => clean(entry[0]) === label || clean(entry[0]).startsWith(label));
  return row ? valueFromLabeledRow(row, label) : '';
}

function extractCommands(rows) {
  return dashboardCommandLabels
    .map((label) => {
      const row = rows.find((entry) => clean(entry[0]).startsWith(label));
      return row ? clean(row[0]) : '';
    })
    .filter(Boolean);
}

function extractPorts(rows) {
  return rows
    .slice(1)
    .map((row) => ({
      port: clean(row[3]).replace(/\.0$/, ''),
      service: clean(row[4]),
      exposure: clean(row[5]),
    }))
    .filter((entry) => entry.port || entry.service || entry.exposure);
}

function useSpreadsheetDashboard() {
  const [state, setState] = useState({
    loading: true,
    error: '',
    updatedAt: '',
    workbookName: '',
    overview: {},
    ports: [],
    commands: [],
    sheetNames: [],
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const xlsxModule = await import('xlsx');
        const XLSX = xlsxModule.default ?? xlsxModule;
        const response = await fetch(spreadsheetUrl, { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to fetch spreadsheet (${response.status})`);
        }

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const serverSheet = workbook.Sheets['Server Cheatsheet'];
        const agentsSheet = workbook.Sheets['AGENTS.md'];

        if (!serverSheet || !agentsSheet) {
          throw new Error('Spreadsheet is missing expected sheets');
        }

        const serverRows = XLSX.utils.sheet_to_json(serverSheet, { header: 1, defval: '' });
        const agentsRows = XLSX.utils.sheet_to_json(agentsSheet, { header: 1, defval: '' });

        const overview = {
          ip: firstMatchingValue(serverRows, 'IP Address'),
          domains: firstMatchingValue(serverRows, 'Domains'),
          stack: firstMatchingValue(serverRows, 'Tech Stack'),
          webRoot: firstMatchingValue(agentsRows, 'Web Root (Static Sites):'),
          projectRoot: firstMatchingValue(agentsRows, 'Project Root:'),
        };

        const commands = extractCommands(agentsRows);
        const ports = extractPorts(serverRows);

        if (active) {
          setState({
            loading: false,
            error: '',
            updatedAt: new Date().toISOString(),
            workbookName: workbook.SheetNames.join(' · '),
            overview,
            ports,
            commands,
            sheetNames: workbook.SheetNames,
          });
        }
      } catch (error) {
        if (active) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : 'Failed to load spreadsheet',
          }));
        }
      }
    };

    load();
    const interval = window.setInterval(load, 15000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return state;
}

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

function DashboardCard({ title, value }) {
  return (
    <article className="dashboard-card">
      <span>{title}</span>
      <strong>{value || '—'}</strong>
    </article>
  );
}

function LiveDashboard() {
  const dashboard = useSpreadsheetDashboard();

  return (
    <section className="info-band live-dashboard" id="dashboard">
      <div className="section-heading">
        <p className="eyebrow">Live dashboard</p>
        <h2>Spreadsheet-backed deployment data that refreshes automatically.</h2>
      </div>

      <div className="dashboard-shell">
        <div className="dashboard-grid">
          <DashboardCard title="Workbook" value={dashboard.workbookName || 'Loading workbook'} />
          <DashboardCard title="Updated" value={dashboard.updatedAt ? new Date(dashboard.updatedAt).toLocaleString() : 'Waiting for first sync'} />
          <DashboardCard title="Source" value={spreadsheetUrl.replace(/^\//, '')} />
        </div>

        <div className="dashboard-panels">
          <article className="dashboard-panel">
            <div className="dashboard-panel__header">
              <p>Server overview</p>
              <span>pulled from the spreadsheet</span>
            </div>
            {dashboard.error ? (
              <div className="dashboard-state dashboard-state--error">{dashboard.error}</div>
            ) : dashboard.loading ? (
              <div className="dashboard-state">Loading spreadsheet data...</div>
            ) : (
              <div className="dashboard-fields">
                <div>
                  <span>IP</span>
                  <strong>{dashboard.overview.ip || '—'}</strong>
                </div>
                <div>
                  <span>Domains</span>
                  <strong>{dashboard.overview.domains || '—'}</strong>
                </div>
                <div>
                  <span>Tech stack</span>
                  <strong>{dashboard.overview.stack || '—'}</strong>
                </div>
                <div>
                  <span>Project root</span>
                  <strong>{dashboard.overview.projectRoot || '—'}</strong>
                </div>
                <div>
                  <span>Web root</span>
                  <strong>{dashboard.overview.webRoot || '—'}</strong>
                </div>
              </div>
            )}
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel__header">
              <p>Open ports</p>
              <span>from the cheatsheet sheet</span>
            </div>
            <div className="dashboard-list">
              {dashboard.ports.length ? (
                dashboard.ports.map((port) => (
                  <div className="dashboard-list__row" key={`${port.port}-${port.service}`}>
                    <strong>{port.port}</strong>
                    <span>{port.service}</span>
                    <em>{port.exposure || '—'}</em>
                  </div>
                ))
              ) : (
                <div className="dashboard-state">No ports loaded yet.</div>
              )}
            </div>
          </article>

          <article className="dashboard-panel dashboard-panel--wide">
            <div className="dashboard-panel__header">
              <p>Deployment flow</p>
              <span>live commands pulled from AGENTS.md</span>
            </div>
            <div className="dashboard-commands">
              {dashboard.commands.length ? (
                dashboard.commands.map((command) => (
                  <code key={command}>{command}</code>
                ))
              ) : (
                <div className="dashboard-state">No commands loaded yet.</div>
              )}
            </div>
          </article>
        </div>

        <p className="dashboard-footnote">
          Auto-refreshes every 15 seconds by refetching the spreadsheet asset.
          {dashboard.sheetNames.length ? ` Sheets: ${dashboard.sheetNames.join(', ')}` : ''}
        </p>
      </div>
    </section>
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
            <span>served by the Node server on port 3000</span>
          </div>
        </header>

        <div className="hero__grid">
          <div className="hero__copy">
            <p className="lede">
              A retro kinetic brand information page for the domains. Fast to load, hard to ignore, and
              built to sit cleanly behind the current server setup.
            </p>

            <div className="hero__actions">
              <a className="button button--primary" href="#domains">
                Enter the main stage
              </a>
              <a className="button button--secondary" href="#routes">
                See the routes
              </a>
              <a className="button button--secondary" href="#dashboard">
                Open the dashboard
              </a>
            </div>

            <dl className="metrics">
              <div>
                <dt>Upstream</dt>
                <dd>localhost:3000</dd>
              </div>
              <div>
                <dt>API lane</dt>
                <dd>reserved route</dd>
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

      <LiveDashboard />

      <section className="status-strip">
        <div>
          <p className="eyebrow">Status</p>
          <h2>Ready for a live site, a redirect, or a bigger build later.</h2>
        </div>
        <p>
          The page is static at heart, but it is packaged to sit behind the current Node server
          without extra moving parts.
        </p>
      </section>
    </main>
  );
}
