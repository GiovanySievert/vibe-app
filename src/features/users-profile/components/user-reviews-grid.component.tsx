import React from 'react'
import { Dimensions, FlatList, Image, StyleSheet } from 'react-native'

import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

import { useUserReviews } from '../hooks/use-user-reviews.hook'

type UserReviewsGridProps = {
  userId: string
}

const COLUMNS = 3
const GAP = 2
const SCREEN_WIDTH = Dimensions.get('window').width
const CELL_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS

export const UserReviewsGrid: React.FC<UserReviewsGridProps> = ({ userId }) => {
  const { data, isLoading } = useUserReviews(userId)
  const reviewCount = data?.length ?? 0

  if (isLoading) {
    return (
      <Box>
        <ThemedText>carregando...</ThemedText>
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
              <Box bg="backgroundSecondary" position="relative" style={[styles.cell, col !== 0 && styles.cellGap]}>
                <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
                <Box position="absolute" style={styles.labelContainer}>
                  <ThemedText variant="mono" color="primary" size="xxs" numberOfLines={1}>
                    {item.place.name}
                  </ThemedText>
                </Box>
              </Box>
            )
          }}
        />
      )}
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
  }
})
