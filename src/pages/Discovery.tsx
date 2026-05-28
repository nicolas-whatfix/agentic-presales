import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { CapturedOpportunity } from '../hooks/useCapturedContext'

const STORAGE_KEY = 'captured_opportunities'
const RESULTS_KEY = 'discovery_results'

interface DiscoveryResult {
  oppId: string
  oppName: string
  generatedAt: string
  fields: Record<string, { name: string; value: string }>
}

interface ModuleField {
  field_key: string
  name: string
  description: string
  sort_order: number
}

const EDGE_FN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/anthropic-proxy`

export default function Discovery() {
  const { session } = useAuth()
  const [opportunities, setOpportunities] = useState<CapturedOpportunity[]>([])
  const [selectedOppId, setSelectedOppId] = useState('')
  const [result, setResult] = useState<DiscoveryResult | null>(null)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setOpportunities(JSON.parse(stored))
  }, [])

  useEffect(() => {
    if (!selectedOppId) { setResult(null); return }
    const stored = localStorage.getItem(RESULTS_KEY)
    if (stored) {
      const all: DiscoveryResult[] = JSON.parse(stored)
      setResult(all.find(r => r.oppId === selectedOppId) ?? null)
    }
  }, [selectedOppId])

  async function generate() {
    setError(null)
    const opp = opportunities.find(o => o.id === selectedOppId)
    if (!opp || !session) return
    setGenerating(true)

    try {
      const [fieldsRes, promptRes] = await Promise.all([
        supabase.from('module_fields').select('*').eq('module', 'Discovery').order('sort_order'),
        supabase.from('module_prompts').select('prompt').eq('module', 'Discovery').single(),
      ])

      if (!promptRes.data?.prompt) throw new Error('No Discovery prompt defined. Add it in Admin Settings.')

      const fields: ModuleField[] = fieldsRes.data ?? []
      const fieldsBlock = fields.map((f, i) =>
        `${String.fromCharCode(65 + i)}. ${f.name}: ${f.description}`
      ).join('\n')

      const filledPrompt = promptRes.data.prompt
        .replace('{csv}', opp.csv ?? '(not provided)')
        .replace('{notes}', opp.notes ?? '(not provided)')
        .replace('{transcript}', opp.transcript ?? '(not provided)')
        .replace('{fields}', fieldsBlock)

      const response = await fetch(EDGE_FN_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: filledPrompt }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error ?? 'Edge Function call failed')
      }

      const data = await response.json()
      const text = data.content[0].text

      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? text.match(/(\{[\s\S]*\})/)
      let parsed: Record<string, string> = {}
      if (jsonMatch) {
        try { parsed = JSON.parse(jsonMatch[1]) } catch { parsed = { raw: text } }
      } else {
        parsed = { raw: text }
      }

      const resultFields: Record<string, { name: string; value: string }> = {}
      fields.forEach((f, i) => {
        const key = String.fromCharCode(65 + i)
        resultFields[key] = {
          name: f.name,
          value: parsed[key] ?? parsed[f.field_key] ?? parsed[f.name] ?? '',
        }
      })

      const newResult: DiscoveryResult = {
        oppId: opp.id,
        oppName: opp.name,
        generatedAt: new Date().toISOString(),
        fields: resultFields,
      }

      const stored = localStorage.getItem(RESULTS_KEY)
      const all: DiscoveryResult[] = stored ? JSON.parse(stored) : []
      localStorage.setItem(RESULTS_KEY, JSON.stringify([...all.filter(r => r.oppId !== opp.id), newResult]))
      setResult(newResult)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="page">
      <h1>Discovery</h1>

      <div className="card">
        <div className="card-header">
          <h2>Select Opportunity</h2>
          {result && <span className="muted">Last generated {new Date(result.generatedAt).toLocaleString()}</span>}
        </div>
        <div className="row" style={{ marginTop: 0 }}>
          <select className="input" value={selectedOppId} onChange={e => setSelectedOppId(e.target.value)}>
            <option value="">— Select an opportunity —</option>
            {opportunities.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <button className="btn btn-primary" onClick={generate} disabled={!selectedOppId || generating}>
            {generating ? 'Generating…' : result ? 'Regenerate' : 'Generate'}
          </button>
        </div>
        {opportunities.length === 0 && <p className="muted" style={{ marginTop: 12 }}>No opportunities captured yet. Go to the Dashboard to add one.</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {result && (
        <div className="discovery-result">
          <div className="discovery-opp-header">
            <div>
              <h2 className="discovery-opp-name">{result.oppName}</h2>
              <span className="muted" style={{ color: 'rgba(255,255,255,0.75)' }}>Discovery · {new Date(result.generatedAt).toLocaleString()}</span>
            </div>
          </div>
          {Object.entries(result.fields).map(([key, field]) => (
            <div key={key} className="discovery-field">
              <div className="discovery-field-label">
                <span className="discovery-field-key">{key}</span>
                <span className="discovery-field-name">{field.name}</span>
              </div>
              <p className="discovery-field-value">{field.value || <em className="muted">Not provided</em>}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
