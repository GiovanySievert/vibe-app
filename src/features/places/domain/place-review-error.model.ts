import { i18n } from '@src/shared/i18n'

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

const MESSAGE_KEYS: Record<PlaceReviewErrorCode, string> = {
  [PlaceReviewErrorCode.RATE_LIMITED]: 'post.errors.rateLimited',
  [PlaceReviewErrorCode.OUT_OF_RANGE]: 'post.errors.outOfRange',
  [PlaceReviewErrorCode.PHOTO_REQUIRED]: 'post.errors.photoRequired'
}

export const placeReviewErrorMessage = (code: string | undefined): string => {
  if (!code) return i18n.t('auth.errors.generic')
  const key = MESSAGE_KEYS[code as PlaceReviewErrorCode]
  return key ? i18n.t(key) : i18n.t('auth.errors.generic')
}
