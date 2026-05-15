import React from 'react'
import { Alert, Share, StyleSheet, TouchableOpacity } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as ExpoLinking from 'expo-linking'

import { useToast } from '@src/app/providers/toast.provider'
import { ThemedIcon } from '@src/shared/components/themed-icon'

import { FeedReviewItem } from '../domain/feed-review-item.model'
import { FeedService } from '../services'

type Props = {
  review: FeedReviewItem
  isOwner: boolean
}

export const ReviewCardMenu: React.FC<Props> = ({ review, isOwner }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

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

  const handleMenuPress = () => {
    const shareUrl = ExpoLinking.createURL(`reviews/share/${review.id}`)
    const actions: Parameters<typeof Alert.alert>[2] = [
      {
        text: 'Compartilhar',
        onPress: () =>
          Share.share({ message: `${review.user.username} avaliou ${review.placeName} no vibes\n${shareUrl}` })
      }
    ]

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
    <TouchableOpacity activeOpacity={0.7} onPress={handleMenuPress} style={styles.menuBtn}>
      <ThemedIcon name="Ellipsis" size={18} color="textSecondary" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  menuBtn: {
    padding: 4
  }
})
