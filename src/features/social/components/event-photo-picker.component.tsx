import React from 'react'
import { Image, StyleSheet } from 'react-native'

import { Box, Button, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

type EventPhotoPickerProps = {
  uri: string | null
  label?: string
  onPick: () => void
  onClear: () => void
}

export const EventPhotoPicker: React.FC<EventPhotoPickerProps> = ({ uri, label, onPick, onClear }) => {
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
        accessibilityLabel={uri ? 'Trocar foto do evento' : 'Adicionar foto do evento'}
      >
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
            accessible
            accessibilityLabel="Foto do evento selecionada"
          />
        ) : (
          <Box alignItems="center" justifyContent="center" gap={2} style={styles.emptyState}>
            <ThemedIcon name="ImagePlus" size={24} color="textSecondary" />
            <ThemedText color="textSecondary">adicionar foto do evento</ThemedText>
            <ThemedText size="xs" color="textSecondary">
              opcional
            </ThemedText>
          </Box>
        )}
      </Touchable>

      <Box flexDirection="row" gap={3}>
        <Button variant={uri ? 'outline' : 'solid'} size="sm" onPress={onPick} flex={1}>
          <ThemedText color={uri ? 'primary' : 'background'} weight="semibold">
            {uri ? 'Trocar foto' : 'Escolher foto'}
          </ThemedText>
        </Button>
        {uri && (
          <Button variant="ghost" size="sm" onPress={onClear}>
            <ThemedText color="error" weight="semibold">
              Remover
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
