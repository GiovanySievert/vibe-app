import React, { useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { authClient } from '@src/services/api/auth-client'
import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { useUserReviews } from '../hooks/use-user-reviews.hook'
import { UserReviewDetailModal } from './user-review-detail-modal.component'
import { UserReviewsGridItem } from './user-reviews-grid-item.component'

type UserReviewsGridProps = {
  userId: string
  canViewReviews: boolean
  isReviewAccessLoading?: boolean
}

const COLUMNS = 3
const GAP = 2

export const UserReviewsGrid: React.FC<UserReviewsGridProps> = ({
  userId,
  canViewReviews,
  isReviewAccessLoading = false
}) => {
  const { t } = useAppTranslation()
  const { data, isLoading } = useUserReviews(userId, canViewReviews)
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? ''
  const reviewCount = data?.length ?? 0

  const [selectedItem, setSelectedItem] = useState<FeedReviewItem | null>(null)

  if (isLoading || isReviewAccessLoading) {
    return (
      <Box>
        <ThemedText>{t('common.loading')}</ThemedText>
      </Box>
    )
  }

  if (!canViewReviews) {
    return (
      <Box>
        <Box justifyContent="center" alignItems="center" flexDirection="row" pb={4} pt={4}>
          <ThemedText color="textPrimary" weight="bold">
            {t('usersProfile.vibes')}
          </ThemedText>
        </Box>
        <Box style={styles.divider} />
        <Box pt={4} pb={4} pl={5} pr={5} justifyContent="center" alignItems="center">
          <ThemedText variant="mono" color="textSecondary">
            {t('usersProfile.followToSee')}
          </ThemedText>
        </Box>
      </Box>
    )
  }

  if (!isLoading && reviewCount === 0) {
    return (
      <Box pt={4} pb={4} pl={5} pr={5} justifyContent="center" alignItems="center">
        <ThemedText variant="mono" color="textSecondary">
          {t('usersProfile.emptyVibes')}
        </ThemedText>
      </Box>
    )
  }

  return (
    <Box>
      <Box justifyContent="center" alignItems="center" flexDirection="row" pb={4} pt={4}>
        <ThemedText color="textPrimary" weight="bold">
          {t('usersProfile.vibes')}{' '}
        </ThemedText>
        <ThemedText variant="mono" size="xxs">
          {reviewCount}
        </ThemedText>
      </Box>
      <Box style={styles.divider} />

      {!isLoading && reviewCount > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={COLUMNS}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <UserReviewsGridItem item={item} col={index % COLUMNS} onPress={setSelectedItem} />
          )}
        />
      )}

      <UserReviewDetailModal item={selectedItem} currentUserId={currentUserId} onClose={() => setSelectedItem(null)} />
    </Box>
  )
}

const styles = StyleSheet.create({
  divider: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.textPrimary,
    borderRadius: 12,
    marginBottom: GAP
  }
})
