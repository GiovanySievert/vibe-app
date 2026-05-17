import { AxiosResponse } from 'axios'

import { coreApi } from '@src/services/api'

import { FeedReviewComment, FeedReviewItem, FeedReviewReactionType, ListFeedReviewCommentsResponse, ReviewCounts, ReviewInteractionCount, ReviewInteractionUser } from '../domain'

export const FeedService = {
  list: (page?: number): Promise<AxiosResponse<FeedReviewItem[]>> =>
    coreApi.get('/place-reviews/feed', { params: { page } }),

  getById: (reviewId: string): Promise<AxiosResponse<FeedReviewItem>> =>
    coreApi.get(`/place-reviews/${reviewId}`),

  getCounts: (reviewId: string): Promise<AxiosResponse<ReviewCounts>> =>
    coreApi.get(`/place-reviews/${reviewId}/counts`),

  listComments: (reviewId: string, page: number): Promise<AxiosResponse<ListFeedReviewCommentsResponse>> =>
    coreApi.get(`/place-reviews/${reviewId}/comments`, { params: { page } }),

  createComment: (reviewId: string, content: string): Promise<AxiosResponse<FeedReviewComment>> =>
    coreApi.post(`/place-reviews/${reviewId}/comments`, { content }),

  setReaction: (reviewId: string, type: FeedReviewReactionType): Promise<AxiosResponse<{ success: boolean }>> =>
    coreApi.put(`/place-reviews/${reviewId}/reaction`, { type }),

  removeReaction: (reviewId: string): Promise<AxiosResponse<{ success: boolean }>> =>
    coreApi.delete(`/place-reviews/${reviewId}/reaction`),

  favoriteReview: (reviewId: string): Promise<AxiosResponse<{ success: boolean }>> =>
    coreApi.put(`/place-reviews/${reviewId}/favorite`),

  unfavoriteReview: (reviewId: string): Promise<AxiosResponse<{ success: boolean }>> =>
    coreApi.delete(`/place-reviews/${reviewId}/favorite`),

  deleteReview: (reviewId: string): Promise<AxiosResponse<void>> =>
    coreApi.delete(`/place-reviews/${reviewId}`),

  getInteractionCount: (reviewId: string): Promise<AxiosResponse<ReviewInteractionCount>> =>
    coreApi.get(`/place-reviews/${reviewId}/interactions/count`),

  listInteractions: (reviewId: string, type: 'on' | 'off', page?: number): Promise<AxiosResponse<ReviewInteractionUser[]>> =>
    coreApi.get(`/place-reviews/${reviewId}/interactions`, { params: { type, page } }),

  deleteComment: (reviewId: string, commentId: string): Promise<AxiosResponse<void>> =>
    coreApi.delete(`/place-reviews/${reviewId}/comments/${commentId}`)
}
