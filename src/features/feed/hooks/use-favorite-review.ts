import { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers/toast.provider'
import { useAppTranslation } from '@src/shared/i18n'

import { FeedReviewItem } from '../domain/feed-review-item.model'
import { FeedService } from '../services'

const sortUserReviews = (items: FeedReviewItem[]) =>
  [...items].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (b.isFavorite && !a.isFavorite) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

export const useFavoriteReview = (review: FeedReviewItem) => {
  const { t } = useAppTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [isFavorite, setIsFavorite] = useState(Boolean(review.isFavorite))

  useEffect(() => {
    setIsFavorite(Boolean(review.isFavorite))
  }, [review.isFavorite])

  const { mutate } = useMutation({
    mutationFn: (nextIsFavorite: boolean) =>
      nextIsFavorite ? FeedService.favoriteReview(review.id) : FeedService.unfavoriteReview(review.id),
    onSuccess: (_data, nextIsFavorite) => {
      setIsFavorite(nextIsFavorite)
      queryClient.setQueryData<FeedReviewItem[]>(['userReviews', review.userId], (old) => {
        if (!old) return old
        const nextItems = old.map((item) => {
          if (nextIsFavorite) return { ...item, isFavorite: item.id === review.id }
          if (item.id === review.id) return { ...item, isFavorite: false }
          return item
        })
        return sortUserReviews(nextItems)
      })
      queryClient.invalidateQueries({
        queryKey: ['userReviews', review.userId]
      })
      showToast(nextIsFavorite ? t('feed.favorite.success') : t('feed.favorite.removed'), 'success')
    },
    onError: () => {
      showToast(t('feed.favorite.failed'), 'error')
    }
  })

  return { isFavorite, setFavorite: mutate }
}
