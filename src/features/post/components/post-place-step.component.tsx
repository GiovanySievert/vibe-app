import React from 'react'
import { StyleSheet } from 'react-native'

import { PostPreselectedPlace } from '@src/app/navigation/types'
import { NearbyPlacesScroll } from '@src/features/home/components'
import { Box, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'

type Props = {
  places: PlacesModel[]
  isFetching: boolean
  selectedPlace: PostPreselectedPlace | null
  onSelectPlace: (place: PlacesModel) => void
}

const space = (value: keyof typeof theme.spacing) => Number.parseFloat(theme.spacing[value])

export const PostPlaceStep: React.FC<Props> = ({ places, isFetching, selectedPlace, onSelectPlace }) => (
  <Box gap={5}>
    <Box pl={5} pr={5} gap={2}>
      <ThemedText variant="title" letterSpacing="normal">
        onde voce está?
      </ThemedText>
      <ThemedText color="textSecondary" letterSpacing="normal">
        escolha um local próximo para marcar a sua review.
      </ThemedText>
    </Box>

    {places.length > 0 ? (
      <NearbyPlacesScroll places={places} selectedPlaceId={selectedPlace?.id} onPlacePress={onSelectPlace} />
    ) : (
      <Box pl={5} pr={5} pt={6} pb={6} style={styles.emptyState}>
        <ThemedText weight="semibold" letterSpacing="normal">
          {isFetching ? 'buscando locais próximos...' : 'nenhum local próximo encontrado'}
        </ThemedText>
        <ThemedText color="textSecondary" letterSpacing="normal" style={styles.emptyDescription}>
          {isFetching ? 'isso deve levar só alguns segundos.' : 'ative sua localização ou tente mover o mapa na home.'}
        </ThemedText>
      </Box>
    )}

    {selectedPlace ? (
      <Box pl={5} pr={5}>
        <Box style={styles.selectedPlaceCard}>
          <Box flex={1}>
            <ThemedText weight="bold" size="xl" letterSpacing="normal">
              {selectedPlace.name}
            </ThemedText>
            <ThemedText variant="mono" color="textSecondary" size="xs" letterSpacing="normal">
              {[selectedPlace.type, selectedPlace.neighborhood].filter(Boolean).join(' · ') || 'local selecionado'}
            </ThemedText>
          </Box>
          <ThemedIcon name="Check" size={22} color="primary" />
        </Box>
      </Box>
    ) : null}
  </Box>
)

const styles = StyleSheet.create({
  emptyState: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginHorizontal: space(5),
    backgroundColor: theme.colors.backgroundSecondary
  },
  emptyDescription: {
    marginTop: space(1)
  },
  selectedPlaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space(3),
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: space(4),
    backgroundColor: theme.colors.backgroundSecondary
  }
})
