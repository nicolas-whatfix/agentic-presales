import { useState, useEffect } from 'react'

export interface CapturedOpportunity {
  id: string
  name: string
  csv?: string
  notes?: string
  transcript?: string
  createdAt: string
}

const STORAGE_KEY = 'captured_opportunities'

export function useCapturedContext() {
  const [opportunities, setOpportunities] = useState<CapturedOpportunity[]>([])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setOpportunities(JSON.parse(stored))
  }, [])

  const saveOpportunity = (opp: Omit<CapturedOpportunity, 'id' | 'createdAt'>) => {
    const full: CapturedOpportunity = {
      ...opp,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const updated = [...opportunities, full]
    setOpportunities(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return full
  }

  const deleteOpportunity = (id: string) => {
    const updated = opportunities.filter(o => o.id !== id)
    setOpportunities(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return { opportunities, saveOpportunity, deleteOpportunity }
}
