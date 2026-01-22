import * as SecureStore from 'expo-secure-store'

import { SavedSearchItem } from '@src/features/search/domain/search.model'

const LAST_SEARCHED_KEY = 'vibe_app_last_searched'
const MAX_LAST_SEARCHED = 5

export async function saveLastSearched(data: SavedSearchItem) {
  const existingData = await getLastSearched()
  const currentList = existingData || []

  const filteredList = currentList.filter((item) => item.id !== data.id)

  const newList = [data, ...filteredList].slice(0, MAX_LAST_SEARCHED)

  await SecureStore.setItemAsync(LAST_SEARCHED_KEY, JSON.stringify(newList))
}

export async function getLastSearched(): Promise<SavedSearchItem[] | null> {
  const data = await SecureStore.getItemAsync(LAST_SEARCHED_KEY)
  if (!data) {
    return null
  }
  return JSON.parse(data)
}

export async function removeLastSearched() {
  await SecureStore.deleteItemAsync(LAST_SEARCHED_KEY)
}
