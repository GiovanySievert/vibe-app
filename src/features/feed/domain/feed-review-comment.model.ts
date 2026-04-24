export type FeedReviewComment = {
  id: string
  reviewId: string
  userId: string
  content: string
  createdAt: string
  user: {
    id: string
    username: string
    image: string | null
  }
}

export type ListFeedReviewCommentsResponse = {
  data: FeedReviewComment[]
  total: number
  hasMore: boolean
}

export type FeedReviewReactionType = 'on' | 'off'
