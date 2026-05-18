import React from 'react'
import { Alert, Share, StyleSheet } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as ExpoLinking from 'expo-linking'

import { useToast } from '@src/app/providers/toast.provider'
import { Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'

import { FeedReviewItem } from '../domain/feed-review-item.model'
import { useFavoriteReview } from '../hooks/use-favorite-review'
import { FeedService } from '../services'

type Props = {
  review: FeedReviewItem
  isOwner: boolean
  enableFavoriteAction?: boolean
}

export const ReviewCardMenu: React.FC<Props> = ({ review, isOwner, enableFavoriteAction = false }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { isFavorite, setFavorite } = useFavoriteReview(review)

  const { mutate: deleteReview } = useMutation({
    mutationFn: () => FeedService.deleteReview(review.id),
    onSuccess: () => {
      queryClient.setQueriesData<{ pages: FeedReviewItem[][] }>({ queryKey: ['feed'] }, (old) => {
        if (!old) return old
        return { ...old, pages: old.pages.map((page) => page.filter((r) => r.id !== review.id)) }
      })
      showToast('review excluída.', 'success')
    },
    onError: () => {
      showToast('não foi possível excluir a review.', 'error')
    }
  })

  const handleFavoritePress = () => {
    if (isFavorite) {
      setFavorite(false)
      return
    }

    Alert.alert(
      'favoritar review?',
      'essa review vai aparecer primeiro no seu grid. se você já tiver outra favorita, ela será substituída.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Favoritar', onPress: () => setFavorite(true) }
      ]
    )
  }

  const handleMenuPress = () => {
    const shareUrl = ExpoLinking.createURL(`reviews/share/${review.id}`)
    const actions: Parameters<typeof Alert.alert>[2] = []

    if (isOwner && enableFavoriteAction) {
      actions.push({
        text: isFavorite ? 'Desfavoritar' : 'Favoritar',
        onPress: handleFavoritePress
      })
    }

    actions.push({
      text: 'Compartilhar',
      onPress: () =>
        Share.share({ message: `${review.user.username} avaliou ${review.placeName} no vibes\n${shareUrl}` })
    })

    if (isOwner) {
      actions.push({
        text: 'Excluir review',
        style: 'destructive',
        onPress: () => deleteReview()
      })
    }

    actions.push({ text: 'Cancelar', style: 'cancel' })
    Alert.alert('', '', actions)
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
