import React from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'

import { PlacesActions } from './places-screen-header.component'

type PlacesInfoHeaderProps = {
  place: PlacesByIdResponse
  onBack: () => void
}

export const PlacesInfoHeader: React.FC<PlacesInfoHeaderProps> = ({ place, onBack }) => {
  return (
    <Box style={styles.container}>
      {place?.brand?.avatar ? (
        <Image
          source={{ uri: place?.brand?.avatar }}
          style={styles.heroImage}
          resizeMode="cover"
          accessible
          accessibilityLabel={`Imagem do local ${place.name}`}
        />
      ) : null}

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        accessibilityHint="Volta para a tela anterior"
      >
        <ThemedText style={styles.backArrow}>←</ThemedText>
      </TouchableOpacity>

      <Box style={styles.actionsContainer}>
        <PlacesActions place={place} />
      </Box>

      <Box style={styles.titleBlock}>
        <ThemedText variant="mono" style={styles.liveTag}>
          AO VIVO
        </ThemedText>
        <ThemedText variant="title" style={styles.placeName}>
          {place.name}
        </ThemedText>
        <ThemedText variant="mono" style={styles.subtitle}>
          {place.brand?.type.toLowerCase()} · {place.location?.neighborhood?.toLowerCase() ?? 'sem bairro'} · 0.3 km
        </ThemedText>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 340,
    backgroundColor: theme.colors.backgroundSecondary
  },
  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%'
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    zIndex: 10
  },
  backArrow: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'InterTight-Regular'
  },
  actionsContainer: {
    position: 'absolute',
    top: 44,
    right: 12,
    zIndex: 10
  },
  titleBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 4
  },
  liveTag: {
    color: theme.colors.primary,
    fontSize: 10,
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  placeName: {
    fontSize: 34,
    letterSpacing: -1,
    lineHeight: 36,
    color: theme.colors.textPrimary,
    fontFamily: 'InterTight-Bold'
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontSize: 11
  }
})
