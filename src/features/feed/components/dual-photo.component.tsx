import React, { useEffect, useRef, useState } from 'react'
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native'

import { Touchable } from '@src/shared/components'
import { Box } from '@src/shared/components/box'
import { ThemedText } from '@src/shared/components/themed-text'
import { theme } from '@src/shared/constants/theme'
import { triggerLightHaptic } from '@src/shared/utils'

type Props = {
  placeImageUrl: string | null
  selfieUrl: string | null
  aspectRatio?: number
  placeName?: string
}

export const DualPhoto: React.FC<Props> = ({ placeImageUrl, selfieUrl, aspectRatio = 4 / 5, placeName }) => {
  const [selfieExpanded, setSelfieExpanded] = useState(false)
  const [overlaysHidden, setOverlaysHidden] = useState(false)
  const overlayOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(overlayOpacity, {
      toValue: overlaysHidden ? 0 : 1,
      duration: 120,
      useNativeDriver: true
    }).start()
  }, [overlayOpacity, overlaysHidden])

  const handleThumbnailPress = () => {
    triggerLightHaptic()
    setSelfieExpanded((prev) => !prev)
  }

  const mainUri = selfieExpanded ? selfieUrl : placeImageUrl
  const thumbUri = selfieExpanded ? placeImageUrl : selfieUrl
  const mainLabel = selfieExpanded ? 'Selfie do autor' : `Foto do local${placeName ? `, ${placeName}` : ''}`
  const thumbLabel = selfieExpanded ? `Foto do local${placeName ? `, ${placeName}` : ''}` : 'Selfie do autor'

  return (
    <Box style={[styles.photoWrap, { aspectRatio }]}>
      <Pressable
        style={styles.mainPhoto}
        onPressIn={() => setOverlaysHidden(true)}
        onPressOut={() => setOverlaysHidden(false)}
        accessibilityRole="image"
        accessibilityLabel={mainLabel}
      >
        <Image
          source={{ uri: mainUri ?? undefined }}
          style={styles.mainPhoto}
          resizeMode="cover"
          accessible
          accessibilityLabel={mainLabel}
        />
      </Pressable>

      {placeName && !selfieExpanded ? (
        <Animated.View
          pointerEvents={overlaysHidden ? 'none' : 'auto'}
          style={[styles.placeTag, { opacity: overlayOpacity }]}
        >
          <ThemedText size="xs" weight="medium" color="textPrimary">
            {placeName}
          </ThemedText>
        </Animated.View>
      ) : null}

      {selfieUrl && (
        <Animated.View
          pointerEvents={overlaysHidden ? 'none' : 'auto'}
          style={[styles.thumbnailWrap, { opacity: overlayOpacity }]}
        >
          <Touchable
            onPress={handleThumbnailPress}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityLabel={`Alternar para ${thumbLabel.toLowerCase()}`}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: thumbUri ?? undefined }}
                style={styles.thumbnail}
                resizeMode="cover"
                accessible
                accessibilityLabel={thumbLabel}
              />
            </View>
          </Touchable>
        </Animated.View>
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
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 4,
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
    height: 82,
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
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 4
  }
})
