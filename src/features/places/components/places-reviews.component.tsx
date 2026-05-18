import React from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { ReviewCard } from '@src/features/feed/components/review-card.component'
import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { authClient } from '@src/services/api/auth-client'
import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { usePlaceReviews } from '../hooks/use-place-reviews.hook'
import { PlacesPopularReviews } from './places-popular-reviews.component'

type PlacesReviewsProps = {
  placeId: string
}

export const PlacesReviews: React.FC<PlacesReviewsProps> = ({ placeId }) => {
  const { t } = useAppTranslation()
  const { data, isLoading } = usePlaceReviews(placeId)
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? ''

  const hasNoRecent = !isLoading && data?.length === 0

  if (isLoading) {
    return (
      <Box pl={6} pr={6} pt={4} pb={4}>
        <ThemedText>{t('common.loading')}</ThemedText>
      </Box>
    )
  }

  if (hasNoRecent) {
    return (
      <Box>
        <Box pl={6} pr={6} style={styles.sectionHeader}>
          <ThemedText>{t('places.reviews.emptyRecent')}</ThemedText>
        </Box>
        <PlacesPopularReviews placeId={placeId} />
      </Box>
    )
  }

  return (
    <FlatList<FeedReviewItem>
      data={data}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      ListHeaderComponent={
        <Box pl={6} pr={6} style={styles.sectionHeader}>
          <ThemedText>{t('places.reviews.recentTitle')}</ThemedText>
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
