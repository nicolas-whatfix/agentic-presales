import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const MODULES = ['Discovery', 'Solution Architecture', 'Competitive Intel', 'Demo Scripting', 'Demo Build', 'Demo Delivery', 'Pilot / POC', 'Security Review']
const VARIABLES = ['{csv}', '{notes}', '{transcript}', '{fields}']

interface Field {
  id?: string
  field_key: string
  name: string
  description: string
  sort_order: number
}

export default function AdminSettings() {
  const [activeModule, setActiveModule] = useState('Discovery')
  const [apiKey, setApiKey] = useState('')
  const [apiKeySaved, setApiKeySaved] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [prompt, setPrompt] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    loadApiKey()
  }, [])

  useEffect(() => {
    loadModuleData(activeModule)
  }, [activeModule])

  async function loadApiKey() {
    const { data } = await supabase.from('app_settings').select('value').eq('key', 'anthropic_api_key').single()
    if (data) setApiKey(data.value)
  }

  async function loadModuleData(module: string) {
    const [fieldsRes, promptRes] = await Promise.all([
      supabase.from('module_fields').select('*').eq('module', module).order('sort_order'),
      supabase.from('module_prompts').select('prompt').eq('module', module).single(),
    ])
    setFields(fieldsRes.data ?? [])
    setPrompt(promptRes.data?.prompt ?? '')
  }

  async function saveApiKey() {
    await supabase.from('app_settings').upsert({ key: 'anthropic_api_key', value: apiKey, updated_at: new Date().toISOString() })
    setApiKeySaved(true)
    setTimeout(() => setApiKeySaved(false), 2000)
  }

  function updateField(idx: number, key: keyof Field, value: string) {
    setFields(prev => prev.map((f, i) => i === idx ? { ...f, [key]: value } : f))
  }

  function addField() {
    setFields(prev => [...prev, {
      field_key: `field_${String.fromCharCode(97 + prev.length)}`,
      name: '',
      description: '',
      sort_order: prev.length,
    }])
  }

  function removeField(idx: number) {
    setFields(prev => prev.filter((_, i) => i !== idx))
  }

  async function saveModuleData() {
    setSaving(true)
    const module = activeModule

    await supabase.from('module_fields').delete().eq('module', module)
    if (fields.length > 0) {
      await supabase.from('module_fields').insert(fields.map((f, i) => ({ ...f, module, sort_order: i, id: undefined })))
    }

    await supabase.from('module_prompts').upsert({ module, prompt, updated_at: new Date().toISOString() })

    setSaving(false)
    setSavedMsg('Saved')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  function insertVariable(v: string) {
    setPrompt(p => p + v)
  }

  return (
    <div className="page">
      <h1>Admin Settings</h1>

      {/* API Key */}
      <section className="card">
        <h2>Anthropic API Key</h2>
        <p className="settings-desc">Stored in Supabase. Shared across all users of this app.</p>
        <div className="row" style={{ marginTop: 16 }}>
          <input
            className="input"
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
          <button className="btn btn-primary" onClick={saveApiKey}>
            {apiKeySaved ? 'Saved ✓' : 'Save'}
          </button>
        </div>
      </section>

      {/* Module selector */}
      <section className="card">
        <h2>Module Configuration</h2>
        <p className="settings-desc">Define fields and prompt for each workflow module.</p>
        <div className="module-tabs">
          {MODULES.map(m => (
            <button
              key={m}
              className={`module-tab ${activeModule === m ? 'active' : ''}`}
              onClick={() => setActiveModule(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="settings-module">
          {/* Fields */}
          <div className="settings-block">
            <div className="settings-block-header">
              <h3>Output Fields</h3>
              <button className="btn btn-secondary" onClick={addField}>+ Add field</button>
            </div>
            <p className="settings-desc">Fields define what the AI should populate for each opportunity. These are passed to the prompt as <code>{'{fields}'}</code>.</p>
            {fields.length === 0 && <p className="muted" style={{ marginTop: 12 }}>No fields defined yet.</p>}
            <div className="fields-list">
              {fields.map((f, idx) => (
                <div key={idx} className="field-row">
                  <span className="field-key-badge">{String.fromCharCode(65 + idx)}</span>
                  <div className="field-inputs">
                    <input
                      className="input"
                      placeholder="Field name"
                      value={f.name}
                      onChange={e => updateField(idx, 'name', e.target.value)}
                    />
                    <input
                      className="input"
                      placeholder="Description — what the AI should find out"
                      value={f.description}
                      onChange={e => updateField(idx, 'description', e.target.value)}
                    />
                  </div>
                  <button className="field-remove" onClick={() => removeField(idx)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="settings-block">
            <h3>Prompt Template</h3>
            <p className="settings-desc">Use these variables in your prompt:</p>
            <div className="variable-chips">
              {VARIABLES.map(v => (
                <button key={v} className="variable-chip" onClick={() => insertVariable(v)}>{v}</button>
              ))}
            </div>
            <textarea
              className="textarea-large"
              style={{ marginTop: 12 }}
              placeholder={`e.g. You are a presales assistant. Given the following context:\n\nCSV Data: {csv}\nNotes: {notes}\nTranscript: {transcript}\n\nPopulate the following fields as JSON:\n{fields}`}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
            {savedMsg && <span className="save-confirm">{savedMsg}</span>}
            <button className="btn btn-primary" onClick={saveModuleData} disabled={saving}>
              {saving ? 'Saving…' : 'Save Module'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
