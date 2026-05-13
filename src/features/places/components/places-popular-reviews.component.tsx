import React from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { ReviewCard } from '@src/features/feed/components/review-card.component'
import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { authClient } from '@src/services/api/auth-client'
import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { usePlacePopularReviews } from '../hooks/use-place-reviews.hook'

type PlacesPopularReviewsProps = {
  placeId: string
}

export const PlacesPopularReviews: React.FC<PlacesPopularReviewsProps> = ({ placeId }) => {
  const { data, isLoading } = usePlacePopularReviews(placeId, true)
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? ''

  if (isLoading) {
    return (
      <Box pl={6} pr={6} pt={4} pb={4}>
        <ThemedText>carregando...</ThemedText>
      </Box>
    )
  }

  if (!data || data.length === 0) {
    return null
  }

  return (
    <FlatList<FeedReviewItem>
      data={data}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ListHeaderComponent={
        <Box pl={6} pr={6} style={styles.sectionHeader}>
          <ThemedText>vibes populares · 3 meses</ThemedText>
        </Box>
      }
      renderItem={({ item }) => <ReviewCard review={item} currentUserId={currentUserId} />}
    />
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
