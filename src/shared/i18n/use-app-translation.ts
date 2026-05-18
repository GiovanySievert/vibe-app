import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useSetAtom } from 'jotai'

import { i18n } from './i18n.config'
import { currentLanguageAtom } from './language.state'
import { saveLanguageInStorage } from './language-storage'
import { SupportedLanguage } from './supported-languages'

export function useAppTranslation() {
  const { t } = useTranslation()
  const setCurrentLanguage = useSetAtom(currentLanguageAtom)

  const setLanguage = useCallback(
    async (language: SupportedLanguage) => {
      await i18n.changeLanguage(language)
      await saveLanguageInStorage(language)
      setCurrentLanguage(language)
    },
    [setCurrentLanguage]
  )

  return {
    t,
    language: (i18n.language as SupportedLanguage) ?? SupportedLanguage.PT,
    setLanguage
  }
}
