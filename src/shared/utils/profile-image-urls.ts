type ReviewImageUrls = {
  placeImageUrl: string | null
  placeImageThumbnailUrl?: string | null
  selfieUrl: string | null
  selfieThumbnailUrl?: string | null
}

type UserImageUrls = {
  image: string | null
  imageThumbnail?: string | null
}

export const getAvatarImageUris = (user: UserImageUrls) => ({
  displayUri: user.imageThumbnail ?? user.image,
  fullUri: user.image
})

export const getGridReviewImageUris = (item: ReviewImageUrls) => {
  const displayUri = item.placeImageThumbnailUrl ?? item.placeImageUrl ?? item.selfieThumbnailUrl ?? item.selfieUrl
  const selfieUri = item.selfieThumbnailUrl ?? item.selfieUrl

  return {
    displayUri,
    selfieUri,
    shouldShowSelfie: Boolean(item.placeImageUrl && item.selfieUrl)
  }
}

export const getReviewDetailImageUris = (item: ReviewImageUrls) => ({
  placeImageUri: item.placeImageUrl,
  selfieUri: item.selfieUrl
})
