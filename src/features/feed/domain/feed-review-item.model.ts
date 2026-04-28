export type FeedReviewItem = {
  id: string
  userId: string
  placeId: string
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
  place: {
    id: string
    name: string
  }
  commentsCount: number
  onCount: number
  offCount: number
  viewerReaction: 'on' | 'off' | null
}
