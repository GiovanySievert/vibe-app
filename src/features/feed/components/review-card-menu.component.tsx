import React from 'react'
import { Alert, Share, StyleSheet } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as ExpoLinking from 'expo-linking'

import { useToast } from '@src/app/providers/toast.provider'
import { Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { useAppTranslation } from '@src/shared/i18n'

import { FeedReviewItem } from '../domain/feed-review-item.model'
import { useFavoriteReview } from '../hooks/use-favorite-review'
import { FeedService } from '../services'

type Props = {
  review: FeedReviewItem
  isOwner: boolean
  enableFavoriteAction?: boolean
}

export const ReviewCardMenu: React.FC<Props> = ({ review, isOwner, enableFavoriteAction = false }) => {
  const { t } = useAppTranslation()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { isFavorite, setFavorite } = useFavoriteReview(review)

  const { mutate: deleteReview } = useMutation({
    mutationFn: () => FeedService.deleteReview(review.id),
    onSuccess: () => {
      queryClient.setQueriesData<{ pages: FeedReviewItem[][] }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => page.filter((r) => r.id !== review.id))
        }
      })
      showToast(t('feed.menu.deleteSuccess'), 'success')
    },
    onError: () => {
      showToast(t('feed.menu.deleteFailed'), 'error')
    }
  })

  const handleFavoritePress = () => {
    if (isFavorite) {
      setFavorite(false)
      return
    }

    Alert.alert(t('feed.menu.favoriteTitle'), t('feed.menu.favoriteMsg'), [
      { text: t('feed.menu.cancelBtn'), style: 'cancel' },
      { text: t('feed.menu.favoriteBtn'), onPress: () => setFavorite(true) }
    ])
  }

  const handleMenuPress = () => {
    const shareUrl = ExpoLinking.createURL(`reviews/share/${review.id}`)
    const actions: Parameters<typeof Alert.alert>[2] = []

    if (isOwner && enableFavoriteAction) {
      actions.push({
        text: isFavorite ? t('feed.menu.unfavoriteBtn') : t('feed.menu.favoriteBtn'),
        onPress: handleFavoritePress
      })
    }

    actions.push({
      text: t('feed.menu.shareBtn'),
      onPress: () =>
        Share.share({
          message: t('feed.card.shareMessage', {
            username: review.user.username,
            placeName: review.placeName,
            shareUrl
          })
        })
    })

    if (isOwner) {
      actions.push({
        text: t('feed.menu.deleteBtn'),
        style: 'destructive',
        onPress: () => deleteReview()
      })
    }

    actions.push({ text: t('feed.menu.cancelBtn'), style: 'cancel' })
    Alert.alert(t('feed.menu.alertTitle'), '', actions)
  }

  return (
    <Touchable activeOpacity={0.7} onPress={handleMenuPress} style={styles.menuBtn}>
      <ThemedIcon name="Ellipsis" size={18} color="textSecondary" />
    </Touchable>
  )
}

const styles = StyleSheet.create({
  menuBtn: {
    padding: 4
  }
})
