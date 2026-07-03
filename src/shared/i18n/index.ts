export { bootstrapI18n, i18n } from './i18n.config'
export { I18nGate } from './i18n-gate.component'
export { currentLanguageAtom } from './language.state'
export { getLanguageFromStorage, removeLanguageFromStorage, saveLanguageInStorage } from './language-storage'
export type { SupportedLanguageMetadata } from './supported-languages'
export {
  DEFAULT_LANGUAGE,
  resolveSupportedLanguage,
  SupportedLanguage,
  supportedLanguages
} from './supported-languages'
export { useAppTranslation } from './use-app-translation'
export { useInitializeI18n } from './use-initialize-i18n'
