import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Item } from '../types'

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setError(error.message)
    } else {
      setItems(data ?? [])
    }
    setLoading(false)
  }, [])

  return { items, loading, error, refetch }
}
