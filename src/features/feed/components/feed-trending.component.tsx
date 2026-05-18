import React from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { TrendingUser } from '@src/shared/domain/users.model'
import { useAppTranslation } from '@src/shared/i18n'

import { useTrendingUsers } from '../hooks'
import { SuggestedUserCard } from './suggested-user-card.component'

export const FeedTrending: React.FC = () => {
  const { t } = useAppTranslation()
  const { data: trending } = useTrendingUsers()

  if (!trending?.length) return null

  return (
    <Box pt={6} pl={4} pr={4}>
      <Box mb={1}>
        <ThemedText weight="semibold" size="lg">
          {t('feed.trending.title')}
        </ThemedText>
      </Box>
      <Box mb={5}>
        <ThemedText color="textSecondary" size="sm">
          {t('feed.trending.description')}
        </ThemedText>
      </Box>
      <FlatList<TrendingUser>
        data={trending}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SuggestedUserCard item={{ ...item, mutualCount: 0 }} badge={`${item.reviewsCount} reviews`} />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <Box style={styles.separator} />}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border
  }
})
