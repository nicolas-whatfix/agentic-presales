import { useState, useRef } from 'react'
import type { CapturedOpportunity } from '../hooks/useCapturedContext'

interface Props {
  onSave: (opp: Omit<CapturedOpportunity, 'id' | 'createdAt'>) => void
  onClose: () => void
}

function extractNameFromCSV(csv: string): string {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return ''
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase())
  const values = lines[1].split(',').map(v => v.replace(/"/g, '').trim())
  const nameIdx = headers.findIndex(h => h.includes('opportunity name') || h === 'name')
  return nameIdx >= 0 ? values[nameIdx] : ''
}

export default function CaptureModal({ onSave, onClose }: Props) {
  const [step, setStep] = useState(1)
  const [oppName, setOppName] = useState('')
  const [csv, setCsv] = useState('')
  const [notes, setNotes] = useState('')
  const [transcript, setTranscript] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCsv(text)
      const extracted = extractNameFromCSV(text)
      if (extracted && !oppName) setOppName(extracted)
    }
    reader.readAsText(file)
  }

  function handleSave() {
    onSave({
      name: oppName.trim() || `Opportunity ${new Date().toLocaleDateString()}`,
      csv: csv || undefined,
      notes: notes.trim() || undefined,
      transcript: transcript.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-steps">
            {[1, 2, 3].map(n => (
              <div key={n} className={`modal-step ${step === n ? 'active' : step > n ? 'done' : ''}`}>
                {step > n ? '✓' : n}
              </div>
            ))}
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {step === 1 && (
            <>
              <h2>Capture Opportunity</h2>
              <p className="modal-desc">Give this opportunity a name, then optionally upload a Salesforce CSV export.</p>
              <label className="field-label">Opportunity name</label>
              <input
                className="input"
                placeholder="e.g. Acme Corp — Enterprise"
                value={oppName}
                onChange={e => setOppName(e.target.value)}
              />
              <label className="field-label" style={{ marginTop: 20 }}>Salesforce CSV <span className="optional">optional</span></label>
              <div
                className="file-drop"
                onClick={() => fileRef.current?.click()}
              >
                {csv
                  ? <span className="file-drop-name">CSV loaded — {csv.split('\n').length - 1} rows</span>
                  : <span>Click to upload CSV</span>
                }
                <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFile} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Salesforce Notes</h2>
              <p className="modal-desc">Paste any additional notes or opportunity details from Salesforce. <span className="optional">Optional</span></p>
              <textarea
                className="textarea-large"
                placeholder="Paste notes here…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </>
          )}

          {step === 3 && (
            <>
              <h2>Call Transcripts</h2>
              <p className="modal-desc">Paste call or meeting transcripts. <span className="optional">Optional</span></p>
              <textarea
                className="textarea-large"
                placeholder="Paste transcript here…"
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
              />
            </>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)}>Back</button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(s => s + 1)}>
              {step === 1 && !csv && !oppName.trim() ? 'Skip' : 'Next'}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handleSave}>Save Opportunity</button>
          )}
        </div>
      </div>
    </div>
  )
}
