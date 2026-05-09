export enum PlaceReviewErrorCode {
  RATE_LIMITED = 'RATE_LIMITED',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  PHOTO_REQUIRED = 'PHOTO_REQUIRED'
}

export type PlaceReviewApiErrorBody = {
  code?: string
  message?: string
  nextAllowedAt?: string
  distanceMeters?: number
  maxAllowedMeters?: number
}

const FALLBACK_MESSAGE = 'algo deu errado, tente novamente mais tarde'

const MESSAGES: Record<PlaceReviewErrorCode, string> = {
  [PlaceReviewErrorCode.RATE_LIMITED]: 'você já postou aqui há pouco tempo, espere um pouco antes de postar de novo',
  [PlaceReviewErrorCode.OUT_OF_RANGE]: 'você precisa estar no local pra postar essa review',
  [PlaceReviewErrorCode.PHOTO_REQUIRED]: 'a foto do local é obrigatória'
}

export const placeReviewErrorMessage = (code: string | undefined): string => {
  if (!code) return FALLBACK_MESSAGE
  return MESSAGES[code as PlaceReviewErrorCode] ?? FALLBACK_MESSAGE
}
