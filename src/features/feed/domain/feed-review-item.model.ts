export type FeedReviewItem = {
  id: string
  userId: string
  placeId: string
  placeName: string
  rating: 'crowded' | 'dead'
  placeImageUrl: string | null
  selfieUrl: string | null
  comment: string | null
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    image: string | null
  }
}

export type ReviewCounts = {
  reviewId: string
  commentsCount: number
  onCount: number
  offCount: number
  viewerReaction: 'on' | 'off' | null
}
