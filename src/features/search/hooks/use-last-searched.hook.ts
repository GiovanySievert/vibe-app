import { useCallback, useEffect, useState } from 'react'

import { SavedSearchItem } from '../domain'
import { getLastSearched, removeLastSearched, saveLastSearched } from '../storage/last-searched.storage'

export const useLastSearched = () => {
  const [lastSearched, setLastSearched] = useState<SavedSearchItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadLastSearched = async () => {
    setIsLoading(true)
    const data = await getLastSearched()
    setLastSearched(data)
    setIsLoading(false)
  }

  const saveSearch = useCallback(async (data: SavedSearchItem) => {
    await saveLastSearched(data)
    await loadLastSearched()
  }, [])

  const clearLastSearched = async () => {
    await removeLastSearched()
    setLastSearched(null)
  }

  useEffect(() => {
    loadLastSearched()
  }, [])

  return {
    lastSearched,
    isLoading,
    saveSearch,
    clearLastSearched,
    refreshLastSearched: loadLastSearched
  }
}
