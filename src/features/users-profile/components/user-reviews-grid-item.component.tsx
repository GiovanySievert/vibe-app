import React from 'react'
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native'

import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'

const COLUMNS = 3
const GAP = 2
const SCREEN_WIDTH = Dimensions.get('window').width
const CELL_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS

type Props = {
  item: FeedReviewItem
  col: number
  onPress: (item: FeedReviewItem) => void
}

export const UserReviewsGridItem: React.FC<Props> = ({ item, col, onPress }) => {
  const imageUri = item.placeImageUrl ?? item.selfieUrl

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
      <Box bg="backgroundSecondary" position="relative" style={[styles.cell, col !== 0 && styles.cellGap]}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />}
        <Box position="absolute" style={styles.labelContainer}>
          <ThemedText variant="mono" color="primary" size="xxs" numberOfLines={1}>
            {item.placeName}
          </ThemedText>
        </Box>
      </Box>
    </TouchableOpacity>
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
  labelContainer: {
    bottom: 6,
    left: 6,
    right: 6
  }
})
