import React, { useRef, useState } from 'react'
import { Animated, Image, StyleSheet, TouchableOpacity } from 'react-native'

import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'

type Props = {
  placeImageUrl: string | null
  selfieUrl: string | null
  aspectRatio?: number
  placeName?: string
}

export const DualPhoto: React.FC<Props> = ({ placeImageUrl, selfieUrl, aspectRatio = 4 / 5, placeName }) => {
  const [selfieExpanded, setSelfieExpanded] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handleThumbnailPress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true })
    ]).start()

    setSelfieExpanded((prev) => !prev)
  }

  const mainUri = selfieExpanded ? selfieUrl : placeImageUrl
  const thumbUri = selfieExpanded ? placeImageUrl : selfieUrl

  return (
    <Box style={[styles.photoWrap, { aspectRatio }]}>
      <Image source={{ uri: mainUri ?? undefined }} style={styles.mainPhoto} resizeMode="cover" />

      {placeName && !selfieExpanded ? (
        <Box position="absolute" pl={1} pr={1} style={styles.placeTag}>
          <ThemedText size="xs" weight="medium" color="textPrimary">
            {placeName}
          </ThemedText>
        </Box>
      ) : null}

      {selfieUrl && (
        <TouchableOpacity onPress={handleThumbnailPress} activeOpacity={1} style={styles.thumbnailWrap}>
          <Animated.View style={[styles.thumbnailContainer, { transform: [{ scale: scaleAnim }] }]}>
            <Image source={{ uri: thumbUri ?? undefined }} style={styles.thumbnail} resizeMode="cover" />
          </Animated.View>
        </TouchableOpacity>
      )}
    </Box>
  )
}

const styles = StyleSheet.create({
  photoWrap: {
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    position: 'relative',
    backgroundColor: theme.colors.backgroundSecondary
  },
  mainPhoto: {
    width: '100%',
    height: '100%'
  },
  placeTag: {
    top: 12,
    left: 12,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 6
  },
  thumbnailWrap: {
    position: 'absolute',
    bottom: 8,
    right: 8
  },
  thumbnailContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.background
  },
  thumbnail: {
    width: '100%',
    height: '100%'
  }
})
