import React from 'react'
import { Image, Pressable, StyleSheet } from 'react-native'

import { PostPreselectedPlace } from '@src/app/navigation/types'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Input } from '@src/shared/components/input'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
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
}) => {
  const { t } = useAppTranslation()

  return (
    <Box pl={5} pr={5} gap={5}>
      <Box style={styles.reviewPhotoCard}>
        {placePhotoUri ? (
          <Image
            source={{ uri: placePhotoUri }}
            style={styles.reviewPhoto}
            resizeMode="cover"
            accessible
            accessibilityLabel={t('post.review.placePhotoA11y')}
          />
        ) : null}
        {selfieUri ? (
          <Image
            source={{ uri: selfieUri }}
            style={styles.reviewSelfie}
            resizeMode="cover"
            accessible
            accessibilityLabel={t('post.review.authorSelfieA11y')}
          />
        ) : null}
      </Box>

      <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap={3}>
        <Box flex={1}>
          <ThemedText weight="bold" size="xl" letterSpacing="normal">
            {selectedPlace?.name}
          </ThemedText>
          <ThemedText variant="mono" size="xs" color="textSecondary" letterSpacing="normal">
            {[selectedPlace?.type, selectedPlace?.neighborhood].filter(Boolean).join(' · ') ||
              t('post.review.subtitle')}
          </ThemedText>
        </Box>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('post.review.changePlaceA11y')}
          onPress={onChangePlace}
        >
          <ThemedText color="textSecondary" textDecorationLine="underline" letterSpacing="normal">
            {t('post.review.changeBtn')}
          </ThemedText>
        </Pressable>
      </Box>

      <Box gap={3}>
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal" textTransform="uppercase">
          {t('post.review.stateLabel')}
        </ThemedText>
        <Box flexDirection="row" gap={3}>
          <RatingOption
            value="dead"
            label={t('post.review.emptyLabel')}
            selected={rating === 'dead'}
            onPress={onChangeRating}
          />
          <RatingOption
            value="crowded"
            label={t('post.review.crowdedLabel')}
            selected={rating === 'crowded'}
            onPress={onChangeRating}
          />
        </Box>
      </Box>

      <Box gap={2}>
        <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal" textTransform="uppercase">
          {t('post.review.commentLabel')}
        </ThemedText>
        <Input
          multiline
          multilineHeight={136}
          maxLength={MAX_COMMENT_LENGTH}
          value={comment}
          onChangeText={onChangeComment}
          placeholder={t('post.review.commentPlaceholder')}
        />
      </Box>

      <Button onPress={onSubmit} loading={submitting} disabled={submitting}>
        <ThemedText weight="bold" color="background" letterSpacing="normal">
          {t('post.review.publishBtn')}
        </ThemedText>
      </Button>
    </Box>
  )
}

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
