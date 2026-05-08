import React from 'react'
import { StyleSheet } from 'react-native'

import { ReviewCard } from '@src/features/feed/components/review-card.component'
import { authClient } from '@src/services/api/auth-client'
import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { usePlaceReviews } from '../hooks/use-place-reviews.hook'

type PlacesReviewsProps = {
  placeId: string
}

export const PlacesReviews: React.FC<PlacesReviewsProps> = ({ placeId }) => {
  const { data, isLoading } = usePlaceReviews(placeId)
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? ''

  if (!isLoading && data?.length === 0) {
    return (
      <Box pl={6} pr={6} pt={4} pb={4}>
        <ThemedText>nenhuma vibe nas últimas 24h</ThemedText>
      </Box>
    )
  }

  if (isLoading) {
    return (
      <Box pl={6} pr={6} pt={4} pb={4}>
        <ThemedText>carregando...</ThemedText>
      </Box>
    )
  }

  return (
    <Box>
      <Box pl={6} pr={6} style={styles.sectionHeader}>
        <ThemedText>vibes daqui · últimas 24h</ThemedText>
      </Box>

      {data?.map((review) => (
        <ReviewCard key={review.id} review={review} currentUserId={currentUserId} />
      ))}
    </Box>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 28,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 8
  }
})
