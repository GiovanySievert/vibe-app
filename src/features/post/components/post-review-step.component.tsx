import React from 'react'
import { Image, Pressable, StyleSheet } from 'react-native'

import { PostPreselectedPlace } from '@src/app/navigation/types'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { theme } from '@src/shared/constants/theme'
import { space } from '@src/shared/utils'

export type PostRating = 'crowded' | 'dead'

type Props = {
  selectedPlace: PostPreselectedPlace | null
  rating: PostRating | null
  comment: string
  placePhotoUri: string | null
  selfieUri: string | null
  submitting: boolean
  onChangePlace: () => void
  onChangeRating: (rating: PostRating) => void
  onChangeComment: (comment: string) => void
  onSubmit: () => void
}

type RatingOptionProps = {
  value: PostRating
  label: string
  selected: boolean
  onPress: (value: PostRating) => void
}

const MAX_COMMENT_LENGTH = 600
const PHOTO_STAGE_HEIGHT = space(16) * 4
const REVIEW_PHOTO_HEIGHT = PHOTO_STAGE_HEIGHT - space(2)
const SELFIE_WIDTH = space(12) * 2
const SELFIE_HEIGHT = space(16) + space(12)
const RATING_OPTION_HEIGHT = space(8) + space(6)

export const PostReviewStep: React.FC<Props> = ({
  selectedPlace,
  rating,
  comment,
  placePhotoUri,
  selfieUri,
  submitting,
  onChangePlace,
  onChangeRating,
  onChangeComment,
  onSubmit
}) => (
  <Box pl={5} pr={5} gap={5}>
    <Box style={styles.reviewPhotoCard}>
      {placePhotoUri ? <Image source={{ uri: placePhotoUri }} style={styles.reviewPhoto} resizeMode="cover" /> : null}
      {selfieUri ? <Image source={{ uri: selfieUri }} style={styles.reviewSelfie} resizeMode="cover" /> : null}
    </Box>

    <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap={3}>
      <Box flex={1}>
        <ThemedText weight="bold" size="xl" letterSpacing="normal">
          {selectedPlace?.name}
        </ThemedText>
        <ThemedText variant="mono" size="xs" color="textSecondary" letterSpacing="normal">
          {[selectedPlace?.type, selectedPlace?.neighborhood].filter(Boolean).join(' · ') || 'review do local'}
        </ThemedText>
      </Box>
      <Pressable accessibilityRole="button" accessibilityLabel="mudar local" onPress={onChangePlace}>
        <ThemedText color="textSecondary" textDecorationLine="underline" letterSpacing="normal">
          mudar
        </ThemedText>
      </Pressable>
    </Box>

    <Box gap={3}>
      <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal" textTransform="uppercase">
        estado
      </ThemedText>
      <Box flexDirection="row" gap={3}>
        <RatingOption value="dead" label="Vazio" selected={rating === 'dead'} onPress={onChangeRating} />
        <RatingOption value="crowded" label="Lotado" selected={rating === 'crowded'} onPress={onChangeRating} />
      </Box>
    </Box>

    <Box gap={2}>
      <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal" textTransform="uppercase">
        como foi
      </ThemedText>
      <Input
        multiline
        multilineHeight={136}
        maxLength={MAX_COMMENT_LENGTH}
        value={comment}
        onChangeText={onChangeComment}
        placeholder="fui só pra um drink rápido e fiquei até fechar..."
      />
    </Box>

    <Button onPress={onSubmit} loading={submitting} disabled={submitting}>
      <ThemedText weight="bold" color="background" letterSpacing="normal">
        publicar review
      </ThemedText>
    </Button>
  </Box>
)

const RatingOption: React.FC<RatingOptionProps> = ({ value, label, selected, onPress }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    onPress={() => onPress(value)}
    style={[styles.ratingOption, selected && styles.ratingOptionSelected]}
  >
    <ThemedText
      weight="bold"
      color={selected ? 'background' : 'textPrimary'}
      letterSpacing="normal"
      textTransform="uppercase"
    >
      {label}
    </ThemedText>
  </Pressable>
)

const styles = StyleSheet.create({
  reviewPhotoCard: {
    height: REVIEW_PHOTO_HEIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: theme.colors.backgroundSecondary
  },
  reviewPhoto: {
    width: '100%',
    height: '100%'
  },
  reviewSelfie: {
    position: 'absolute',
    right: space(4),
    top: space(4),
    width: SELFIE_WIDTH - space(2),
    height: SELFIE_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  ratingOption: {
    flex: 1,
    minHeight: RATING_OPTION_HEIGHT,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary
  },
  ratingOptionSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary
  }
})
