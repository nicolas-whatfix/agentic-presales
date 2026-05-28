import { useState } from 'react'
import { useCapturedContext } from '../hooks/useCapturedContext'
import CaptureModal from '../components/CaptureModal'

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
  const [showModal, setShowModal] = useState(false)
  const { opportunities, saveOpportunity, deleteOpportunity } = useCapturedContext()

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

      {/* Capture Context */}
      <section className="capture-section">
        <div className="capture-header">
          <div>
            <h2 className="capture-title">Capture Context</h2>
            <p className="capture-desc">Upload opportunity data to ground the pre-sales agents. Stored locally only.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + New Opportunity
          </button>
        </div>

        {opportunities.length > 0 && (
          <ul className="opp-list">
            {opportunities.map(opp => (
              <li key={opp.id} className="opp-row">
                <div className="opp-info">
                  <span className="opp-name">{opp.name}</span>
                  <span className="opp-meta">
                    {[opp.csv && 'CSV', opp.notes && 'Notes', opp.transcript && 'Transcript']
                      .filter(Boolean).join(' · ') || 'No data'}
                    {' · '}
                    {new Date(opp.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button className="opp-delete" onClick={() => deleteOpportunity(opp.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        {opportunities.length === 0 && (
          <p className="capture-empty">No opportunities captured yet. Click "New Opportunity" to get started.</p>
        )}
      </section>

      {/* Workflow Modules */}
      <section>
        <h2 className="section-title">Workflow Modules</h2>
        <div className="wf-grid">
          {modules.map((m) => (
            <div key={m.label} className="wf-card">
              <span className="wf-card-icon">{m.icon}</span>
              <span className="wf-card-label">{m.label}</span>
            </div>
          ))}
        </div>
      </section>

      {showModal && (
        <CaptureModal
          onSave={saveOpportunity}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
