import React from 'react'
import { Image, StyleSheet } from 'react-native'

import { Box, Button, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

type EventPhotoPickerProps = {
  uri: string | null
  label?: string
  onPick: () => void
  onClear: () => void
}

export const EventPhotoPicker: React.FC<EventPhotoPickerProps> = ({ uri, label, onPick, onClear }) => {
  const { t } = useAppTranslation()

  return (
    <Box gap={3}>
      {label && (
        <ThemedText size="sm" weight="semibold">
          {label}
        </ThemedText>
      )}

      <Touchable
        activeOpacity={0.85}
        onPress={onPick}
        style={styles.previewCard}
        accessibilityRole="button"
        accessibilityLabel={uri ? t('social.createEvent.changePhotoA11y') : t('social.createEvent.addPhotoA11y')}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
            accessible
            accessibilityLabel={t('social.createEvent.photoSelectedA11y')}
          />
        ) : (
          <Box alignItems="center" justifyContent="center" gap={2} style={styles.emptyState}>
            <ThemedIcon name="ImagePlus" size={24} color="textSecondary" />
            <ThemedText color="textSecondary">{t('social.createEvent.addPhoto')}</ThemedText>
            <ThemedText size="xs" color="textSecondary">
              {t('common.optional')}
            </ThemedText>
          </Box>
        )}
      </Touchable>

      <Box flexDirection="row" gap={3}>
        <Button variant={uri ? 'outline' : 'solid'} size="sm" onPress={onPick} flex={1}>
          <ThemedText color={uri ? 'primary' : 'background'} weight="semibold">
            {uri ? t('social.createEvent.changePhoto') : t('social.createEvent.choosePhoto')}
          </ThemedText>
        </Button>
        {uri && (
          <Button variant="ghost" size="sm" onPress={onClear}>
            <ThemedText color="error" weight="semibold">
              {t('common.remove')}
            </ThemedText>
          </Button>
        )}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  previewCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary
  },
  emptyState: {
    flex: 1,
    paddingHorizontal: 24
  },
  image: {
    width: '100%',
    height: '100%'
  }
})
