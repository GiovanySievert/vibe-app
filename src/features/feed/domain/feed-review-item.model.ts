export type FeedReviewItem = {
  id: string
  userId: string
  placeId: string
  placeName: string
  rating: 'crowded' | 'dead'
  placeImageUrl: string | null
  placeImageThumbnailUrl?: string | null
  selfieUrl: string | null
  selfieThumbnailUrl?: string | null
  comment: string | null
  createdAt: string
  updatedAt: string
  isFavorite: boolean
  user: {
    id: string
    username: string
    image: string | null
    imageThumbnail?: string | null
  }
}

export type ReviewCounts = {
  reviewId: string
  commentsCount: number
  onCount: number
  offCount: number
  viewerReaction: 'on' | 'off' | null
}

export type ReviewInteractionCount = {
  reviewId: string
  onCount: number
  offCount: number
  total: number
}

export type ReviewInteractionUser = {
  id: string
  username: string
  image: string | null
}
