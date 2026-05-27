import { useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Item } from '../types'
import Button from '../components/ui/Button'
import { useItems } from '../hooks/useItems'

export default function DbTest() {
  const [inputValue, setInputValue] = useState('')
  const [inserting, setInserting] = useState(false)
  const [insertError, setInsertError] = useState<string | null>(null)
  const { items, loading, error, refetch } = useItems()

  async function handleInsert() {
    const name = inputValue.trim()
    if (!name) return
    setInserting(true)
    setInsertError(null)
    const { error } = await supabase.from('items').insert({ name })
    if (error) {
      setInsertError(error.message)
    } else {
      setInputValue('')
      refetch()
    }
    setInserting(false)
  }

  return (
    <div className="page">
      <h1>DB Test</h1>

      <div className="notice">
        <strong>Setup required:</strong> This page requires an <code>items</code> table in your
        Supabase project with at least two columns: <code>id</code> (uuid, primary key) and{' '}
        <code>name</code> (text). See the migration file for the full SQL.
      </div>

      <section className="card">
        <h2>Insert item</h2>
        <div className="row">
          <input
            className="input"
            type="text"
            placeholder="Item name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
          />
          <Button onClick={handleInsert} disabled={inserting || !inputValue.trim()}>
            {inserting ? 'Inserting…' : 'Insert'}
          </Button>
        </div>
        {insertError && <p className="error">{insertError}</p>}
      </section>

      <section className="card">
        <div className="card-header">
          <h2>Items</h2>
          <Button variant="secondary" onClick={refetch} disabled={loading}>
            {loading ? 'Loading…' : 'Load items'}
          </Button>
        </div>

        {error && <p className="error">{error}</p>}

        {items.length === 0 && !loading && !error && (
          <p className="muted">No items yet. Insert one above.</p>
        )}

        {items.length > 0 && (
          <ul className="item-list">
            {items.map((item: Item) => (
              <li key={item.id} className="item-list-row">
                <span>{item.name}</span>
                <span className="muted">{new Date(item.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
