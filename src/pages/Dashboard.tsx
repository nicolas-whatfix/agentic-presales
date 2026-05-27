export default function Dashboard() {
  return (
    <div className="home">
      <section className="hero">
        <h1 className="hero-title">Agentic Presales</h1>
        <p className="hero-sub">AI-powered agents that research prospects, personalise outreach, and prep your team — before the first call.</p>
        <a href="/db-test" className="btn btn-primary hero-cta">Get started</a>
      </section>

      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🔍</span>
          <h3>Prospect Research</h3>
          <p>Automatically gather company intel, tech stack, and buying signals for every account.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">✉️</span>
          <h3>Personalised Outreach</h3>
          <p>Generate tailored emails and talk tracks grounded in real prospect context.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⚡</span>
          <h3>Call Prep in Seconds</h3>
          <p>One-click briefing docs so your team walks into every meeting fully prepared.</p>
        </div>
      </section>
    </div>
  )
}
