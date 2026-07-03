import { describe, expect, it } from 'bun:test'

import { getGridReviewImageUris, getReviewDetailImageUris } from './profile-image-urls.ts'

describe('profile image urls', () => {
  it('uses thumbnails in the profile grid when they exist', () => {
    const result = getGridReviewImageUris({
      placeImageUrl: 'https://cdn/full-place.jpg',
      placeImageThumbnailUrl: 'https://cdn/thumb-place.jpg',
      selfieUrl: 'https://cdn/full-selfie.jpg',
      selfieThumbnailUrl: 'https://cdn/thumb-selfie.jpg'
    })

    expect(result.displayUri).toBe('https://cdn/thumb-place.jpg')
    expect(result.selfieUri).toBe('https://cdn/thumb-selfie.jpg')
    expect(result.shouldShowSelfie).toBe(true)
  })

  it('falls back to full urls in the profile grid', () => {
    const result = getGridReviewImageUris({
      placeImageUrl: 'https://cdn/full-place.jpg',
      selfieUrl: 'https://cdn/full-selfie.jpg'
    })

    expect(result.displayUri).toBe('https://cdn/full-place.jpg')
    expect(result.selfieUri).toBe('https://cdn/full-selfie.jpg')
  })

  it('uses selfie thumbnail when the review has only a selfie', () => {
    const result = getGridReviewImageUris({
      placeImageUrl: null,
      selfieUrl: 'https://cdn/full-selfie.jpg',
      selfieThumbnailUrl: 'https://cdn/thumb-selfie.jpg'
    })

    expect(result.displayUri).toBe('https://cdn/thumb-selfie.jpg')
    expect(result.shouldShowSelfie).toBe(false)
  })

  it('keeps full urls for review details', () => {
    const result = getReviewDetailImageUris({
      placeImageUrl: 'https://cdn/full-place.jpg',
      placeImageThumbnailUrl: 'https://cdn/thumb-place.jpg',
      selfieUrl: 'https://cdn/full-selfie.jpg',
      selfieThumbnailUrl: 'https://cdn/thumb-selfie.jpg'
    })

    expect(result.placeImageUri).toBe('https://cdn/full-place.jpg')
    expect(result.selfieUri).toBe('https://cdn/full-selfie.jpg')
  })
})
