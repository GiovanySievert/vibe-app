import React from 'react'
import { Image, Pressable, StyleSheet, Switch, View } from 'react-native'

import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { space } from '@src/shared/utils'

export type PostPhotoType = 'place' | 'selfie'

type Props = {
  placePhotoUri: string | null
  selfieUri: string | null
  selfieFriendsOnly: boolean
  submitAttempted: boolean
  onPhotoPress: (type: PostPhotoType) => void
  onSelfieFriendsOnlyChange: (value: boolean) => void
}

type PhotoButtonProps = {
  type: PostPhotoType
  uri: string | null
  onPress: (type: PostPhotoType) => void
}

const PHOTO_STAGE_HEIGHT = space(16) * 4
const SELFIE_WIDTH = space(12) * 2
const SELFIE_HEIGHT = space(16) + space(12)

export const PostPhotoStep: React.FC<Props> = ({
  placePhotoUri,
  selfieUri,
  selfieFriendsOnly,
  submitAttempted,
  onPhotoPress,
  onSelfieFriendsOnlyChange
}) => {
  const { t } = useAppTranslation()

  return (
    <Box pl={5} pr={5} gap={5}>
      <Box gap={2}>
        <ThemedText variant="title" letterSpacing="normal">
          {t('post.photos.title')}
        </ThemedText>
        <ThemedText color="textSecondary" letterSpacing="normal">
          {t('post.photos.description')}
        </ThemedText>
      </Box>

      <Box style={styles.photoStage}>
        <PhotoButton type="place" uri={placePhotoUri} onPress={onPhotoPress} />
        <View style={styles.selfieSlot}>
          <PhotoButton type="selfie" uri={selfieUri} onPress={onPhotoPress} />
        </View>
      </Box>

      {submitAttempted && !placePhotoUri ? (
        <ThemedText size="xs" style={styles.errorText} letterSpacing="normal">
          {t('post.photos.requiredError')}
        </ThemedText>
      ) : null}

      <Box style={styles.privacyCard}>
        <Box flex={1} pr={3}>
          <ThemedText weight="semibold" size="sm" letterSpacing="normal">
            {t('post.photos.privacyLabel')}
          </ThemedText>
          <ThemedText size="xs" color="textSecondary" letterSpacing="normal" style={styles.privacyDescription}>
            {t('post.photos.privacyDesc')}
          </ThemedText>
        </Box>
        <Switch
          value={selfieFriendsOnly}
          onValueChange={onSelfieFriendsOnlyChange}
          disabled={!selfieUri}
          trackColor={{
            true: theme.colors.primary,
            false: theme.colors.border
          }}
        />
      </Box>
    </Box>
  )
}

const PhotoButton: React.FC<PhotoButtonProps> = ({ type, uri, onPress }) => {
  const { t } = useAppTranslation()
  const isPlace = type === 'place'

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isPlace ? t('post.photos.addPlacePhoto') : t('post.photos.addSelfie')}
      onPress={() => onPress(type)}
      style={[styles.photoButton, type === 'selfie' && styles.selfieButton]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={styles.photoImage}
          resizeMode="cover"
          accessible
          accessibilityLabel={isPlace ? t('post.photos.placePhotoCaptured') : t('post.photos.selfieCaptured')}
        />
      ) : (
        <Box alignItems="center" justifyContent="center" gap={2}>
          <ThemedIcon name="Camera" size={isPlace ? 28 : 22} color="textSecondary" />
          <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
            {isPlace ? t('post.photos.placePhotoLabel') : t('post.photos.selfieLabel')}
          </ThemedText>
        </Box>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  photoStage: {
    height: PHOTO_STAGE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary
  },
  photoButton: {
    height: PHOTO_STAGE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSecondary
  },
  selfieSlot: {
    position: 'absolute',
    right: space(4),
    top: space(4),
    width: SELFIE_WIDTH,
    height: SELFIE_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background
  },
  selfieButton: {
    height: SELFIE_HEIGHT,
    width: '100%'
  },
  photoImage: {
    width: '100%',
    height: '100%'
  },
  errorText: {
    color: theme.colors.error
  },
  privacyCard: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: space(4),
    paddingVertical: space(3),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  privacyDescription: {
    marginTop: space(1),
    lineHeight: space(5)
  }
})
