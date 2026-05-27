const modules = [
  { label: 'Discovery Call', icon: '📞' },
  { label: 'Solution Architecture', icon: '🏗️' },
  { label: 'Competitive Intel', icon: '🔍' },
  { label: 'Demo Scripting', icon: '📝' },
  { label: 'Demo Build', icon: '🛠️' },
  { label: 'Demo Delivery', icon: '🎯' },
  { label: 'Pilot / POC', icon: '🚀' },
  { label: 'Security Review', icon: '🔒' },
]

export default function Dashboard() {
  return (
    <div className="wf-dashboard">
      <header className="wf-header">
        <div className="wf-logo">
          <span className="wf-logo-dot" />
          Whatfix
        </div>
        <h1 className="wf-title">Pre-Sales Workflow</h1>
        <p className="wf-subtitle">Solution Consulting · Agentic Automation</p>
      </header>

      <div className="wf-grid">
        {modules.map((m) => (
          <div key={m.label} className="wf-card">
            <span className="wf-card-icon">{m.icon}</span>
            <span className="wf-card-label">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
