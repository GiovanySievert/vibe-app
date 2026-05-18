export enum SupportedLanguage {
  PT = 'pt',
  EN = 'en',
  ES = 'es'
}

export const DEFAULT_LANGUAGE = SupportedLanguage.PT

export type SupportedLanguageMetadata = {
  code: SupportedLanguage
  nativeLabel: string
  flag: string
}

export const supportedLanguages: SupportedLanguageMetadata[] = [
  { code: SupportedLanguage.PT, nativeLabel: 'Português', flag: '🇧🇷' },
  { code: SupportedLanguage.EN, nativeLabel: 'English', flag: '🇺🇸' },
  { code: SupportedLanguage.ES, nativeLabel: 'Español', flag: '🇪🇸' }
]

export function resolveSupportedLanguage(rawCode: string | null | undefined): SupportedLanguage {
  if (!rawCode) return DEFAULT_LANGUAGE

  const normalized = rawCode.toLowerCase().split(/[-_]/)[0]

  if (normalized === SupportedLanguage.PT) return SupportedLanguage.PT
  if (normalized === SupportedLanguage.EN) return SupportedLanguage.EN
  if (normalized === SupportedLanguage.ES) return SupportedLanguage.ES

  return DEFAULT_LANGUAGE
}
