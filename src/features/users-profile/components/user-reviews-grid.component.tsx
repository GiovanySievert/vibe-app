import React, { useState } from 'react'
import { Dimensions, FlatList, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { FeedReviewCard } from '@src/features/feed/components/feed-review-card.component'
import { FeedReviewCommentsContent } from '@src/features/feed/components/feed-review-comments-content.component'
import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { authClient } from '@src/services/api/auth-client'
import { Box } from '@src/shared/components/box'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { useUserReviews } from '../hooks/use-user-reviews.hook'

type UserReviewsGridProps = {
  userId: string
  canViewReviews: boolean
  isReviewAccessLoading?: boolean
}

const COLUMNS = 3
const GAP = 2
const SCREEN_WIDTH = Dimensions.get('window').width
const CELL_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS
const MODAL_HEIGHT = Dimensions.get('window').height * 0.9

export const UserReviewsGrid: React.FC<UserReviewsGridProps> = ({
  userId,
  canViewReviews,
  isReviewAccessLoading = false
}) => {
  const { data, isLoading } = useUserReviews(userId, canViewReviews)
  const { data: session } = authClient.useSession()
  const currentUserId = session?.user.id ?? ''
  const reviewCount = data?.length ?? 0

  const [selectedItem, setSelectedItem] = useState<FeedReviewItem | null>(null)

  if (isLoading || isReviewAccessLoading) {
    return (
      <Box>
        <ThemedText>carregando...</ThemedText>
      </Box>
    )
  }

  if (!canViewReviews) {
    return (
      <Box>
        <Box justifyContent="center" alignItems="center" flexDirection="row" pb={4} pt={4}>
          <ThemedText color="textPrimary" weight="bold">
            vibes
          </ThemedText>
        </Box>
        <Box style={styles.divider} />
        <Box pt={4} pb={4} pl={5} pr={5}>
          <ThemedText color="textSecondary">siga este usuário para ver as vibes dele.</ThemedText>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Box justifyContent="center" alignItems="center" flexDirection="row" pb={4} pt={4}>
        <ThemedText color="textPrimary" weight="bold">
          vibes{' '}
        </ThemedText>
        <ThemedText variant="mono" size="xxs">
          {reviewCount}
        </ThemedText>
      </Box>
      <Box style={styles.divider} />

      {!isLoading && reviewCount === 0 && (
        <Box>
          <ThemedText>nenhuma vibe ainda</ThemedText>
        </Box>
      )}

      {!isLoading && reviewCount > 0 && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          numColumns={COLUMNS}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            const imageUri = item.placeImageUrl ?? item.selfieUrl
            const col = index % COLUMNS

            return (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setSelectedItem(item)}>
                <Box bg="backgroundSecondary" position="relative" style={[styles.cell, col !== 0 && styles.cellGap]}>
                  {imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />}
                  <Box position="absolute" style={styles.labelContainer}>
                    <ThemedText variant="mono" color="primary" size="xxs" numberOfLines={1}>
                      {item.place.name}
                    </ThemedText>
                  </Box>
                </Box>
              </TouchableOpacity>
            )
          }}
        />
      )}

      <SwipeableModal
        visible={selectedItem !== null}
        height={MODAL_HEIGHT}
        onClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <KeyboardAvoidingView style={styles.modalContent} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FeedReviewCard item={selectedItem} currentUserId={currentUserId} hideComments />
            </ScrollView>
            <FeedReviewCommentsContent reviewId={selectedItem.id} visible={true} />
          </KeyboardAvoidingView>
        )}
      </SwipeableModal>
    </Box>
  )
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: GAP
  },
  cellGap: {
    marginLeft: GAP
  },
  image: {
    width: '100%',
    height: '100%'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%'
  },
  labelContainer: {
    bottom: 6,
    left: 6,
    right: 6
  },
  divider: {
    borderTopWidth: 2,
    borderTopColor: theme.colors.textPrimary,
    borderRadius: 12,
    marginBottom: GAP
  },
  modalContent: {
    flex: 1
  }
})
