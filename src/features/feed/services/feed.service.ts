import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { FeedReviewComment, FeedReviewItem, FeedReviewReactionType, ListFeedReviewCommentsResponse } from '../domain'

export const FeedService = {
  list: (page?: number): Promise<AxiosResponse<FeedReviewItem[]>> =>
    coreApi.get('/place-reviews/feed', { params: { page } }),

  listComments: (reviewId: string, page: number): Promise<AxiosResponse<ListFeedReviewCommentsResponse>> =>
    coreApi.get(`/place-reviews/${reviewId}/comments`, { params: { page } }),

  createComment: (reviewId: string, content: string): Promise<AxiosResponse<FeedReviewComment>> =>
    coreApi.post(`/place-reviews/${reviewId}/comments`, { content }),

  setReaction: (reviewId: string, type: FeedReviewReactionType): Promise<AxiosResponse<{ success: boolean }>> =>
    coreApi.put(`/place-reviews/${reviewId}/reaction`, { type }),

  removeReaction: (reviewId: string): Promise<AxiosResponse<{ success: boolean }>> =>
    coreApi.delete(`/place-reviews/${reviewId}/reaction`)
}
