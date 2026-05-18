import { atom } from 'jotai'

import { DEFAULT_LANGUAGE, SupportedLanguage } from './supported-languages'

export const currentLanguageAtom = atom<SupportedLanguage>(DEFAULT_LANGUAGE)
