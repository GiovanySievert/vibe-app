import React from 'react'
import { Dimensions, Image, StyleSheet, TouchableOpacity } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

import { FeedReviewItem } from '@src/features/feed/domain/feed-review-item.model'
import { Box } from '@src/shared/components/box'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

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
  const shouldShowSelfie = Boolean(item.placeImageUrl && item.selfieUrl)

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(item)}>
      <Box
        bg="backgroundSecondary"
        position="relative"
        style={[styles.cell, col !== 0 && styles.cellGap]}
      >
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />}
        {item.isFavorite && (
          <Box style={styles.favoriteBadge}>
            <ThemedIcon name="Star" color="primary" type="solid" size={16} />
          </Box>
        )}
        {shouldShowSelfie && (
          <Image source={{ uri: item.selfieUrl ?? undefined }} style={styles.selfie} resizeMode="cover" />
        )}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.9)']} style={styles.labelContainer}>
          <ThemedText variant="mono" color="textPrimary" size="xxs" numberOfLines={1}>
            {item.placeName}
          </ThemedText>
        </LinearGradient>
      </Box>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    marginBottom: GAP,
    overflow: 'hidden'
  },
  cellGap: {
    marginLeft: GAP
  },
  image: {
    width: '100%',
    height: '100%'
  },
  favoriteBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background
  },
  selfie: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 34,
    height: 44,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgb(17, 17, 17)',
    shadowColor: 'rgb(0, 0, 0)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6
  },
  labelContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 6,
    paddingTop: 18,
    paddingBottom: 6
  }
})
