import 'intl-pluralrules'

import { initReactI18next } from 'react-i18next'

import * as Localization from 'expo-localization'
import i18n from 'i18next'

import { getLanguageFromStorage, saveLanguageInStorage } from './language-storage'
import en from './locales/en.json'
import es from './locales/es.json'
import pt from './locales/pt.json'
import { DEFAULT_LANGUAGE, resolveSupportedLanguage, SupportedLanguage } from './supported-languages'

const resources = {
  pt: { translation: pt },
  en: { translation: en },
  es: { translation: es }
} as const

let isInitialized = false

export async function bootstrapI18n(): Promise<SupportedLanguage> {
  const persisted = await getLanguageFromStorage()

  let language: SupportedLanguage
  if (persisted) {
    language = persisted
  } else {
    const deviceLocale = Localization.getLocales()[0]?.languageCode ?? null
    language = resolveSupportedLanguage(deviceLocale)
    await saveLanguageInStorage(language)
  }

  if (!isInitialized) {
    await i18n.use(initReactI18next).init({
      resources,
      lng: language,
      fallbackLng: DEFAULT_LANGUAGE,
      interpolation: { escapeValue: false },
      compatibilityJSON: 'v4',
      returnNull: false,
      react: { useSuspense: false }
    })
    isInitialized = true
  } else {
    await i18n.changeLanguage(language)
  }

  return language
}

export { i18n }
