import { useEffect, useState } from 'react'

import { useSetAtom } from 'jotai'

import { bootstrapI18n } from './i18n.config'
import { currentLanguageAtom } from './language.state'

export function useInitializeI18n() {
  const [isReady, setIsReady] = useState(false)
  const setCurrentLanguage = useSetAtom(currentLanguageAtom)

  useEffect(() => {
    const initialize = async () => {
      try {
        const language = await bootstrapI18n()
        setCurrentLanguage(language)
      } catch (error) {
        console.error('Error initializing i18n', error)
      } finally {
        setIsReady(true)
      }
    }

    initialize()
  }, [setCurrentLanguage])

  return { isReady }
}
