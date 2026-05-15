import React from 'react'
import { Image, Pressable, StyleSheet, Switch, View } from 'react-native'

import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

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

const space = (value: keyof typeof theme.spacing) => Number.parseFloat(theme.spacing[value])
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
}) => (
  <Box pl={5} pr={5} gap={5}>
    <Box gap={2}>
      <ThemedText variant="title" letterSpacing="normal">
        mostra como tá
      </ThemedText>
      <ThemedText color="textSecondary" letterSpacing="normal">
        a foto do local é obrigatória; a selfie é opcional.
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
        a foto do local é obrigatória
      </ThemedText>
    ) : null}

    <Box style={styles.privacyCard}>
      <Box flex={1} pr={3}>
        <ThemedText weight="semibold" size="sm" letterSpacing="normal">
          Selfie apenas para amigos?
        </ThemedText>
        <ThemedText size="xs" color="textSecondary" letterSpacing="normal" style={styles.privacyDescription}>
          Quem segue você ainda vê a selfie. Se desligado, ela aparece para todo mundo.
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

const PhotoButton: React.FC<PhotoButtonProps> = ({ type, uri, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={type === 'place' ? 'adicionar foto do local' : 'adicionar selfie'}
    onPress={() => onPress(type)}
    style={[styles.photoButton, type === 'selfie' && styles.selfieButton]}
  >
    {uri ? (
      <Image source={{ uri }} style={styles.photoImage} resizeMode="cover" />
    ) : (
      <Box alignItems="center" justifyContent="center" gap={2}>
        <ThemedIcon name="Camera" size={type === 'place' ? 28 : 22} color="textSecondary" />
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
          {type === 'place' ? 'foto do local *' : 'selfie'}
        </ThemedText>
      </Box>
    )}
  </Pressable>
)

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
