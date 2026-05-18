import * as SecureStore from 'expo-secure-store'

import { resolveSupportedLanguage, SupportedLanguage } from './supported-languages'

enum VIBE_APP_I18N_KEYS_STORAGE {
  LANGUAGE = 'vibe_app_language'
}

export async function getLanguageFromStorage(): Promise<SupportedLanguage | null> {
  const stored = await SecureStore.getItemAsync(VIBE_APP_I18N_KEYS_STORAGE.LANGUAGE)
  if (!stored) return null
  return resolveSupportedLanguage(stored)
}

export async function saveLanguageInStorage(language: SupportedLanguage): Promise<void> {
  await SecureStore.setItemAsync(VIBE_APP_I18N_KEYS_STORAGE.LANGUAGE, language)
}

export async function removeLanguageFromStorage(): Promise<void> {
  await SecureStore.deleteItemAsync(VIBE_APP_I18N_KEYS_STORAGE.LANGUAGE)
}
