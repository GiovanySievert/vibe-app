import React from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { HotPlaceItem } from '@src/features/search/domain'
import { Box, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { PlacesService } from '@src/shared/services'
import { locationStateAtom } from '@src/shared/state/location.state'

import { HotPlacesCard } from './hot-places-card.component'

export const HotPlaces: React.FC = () => {
  const { t } = useAppTranslation()
  const userLocation = useAtomValue(locationStateAtom)

  const { data } = useQuery<HotPlaceItem[], Error>({
    queryKey: ['fetchHotPlaces', userLocation?.latitude, userLocation?.longitude],
    queryFn: async () => {
      const response = await PlacesService.fetchHotPlaces(
        userLocation ? { lat: userLocation.latitude, lon: userLocation.longitude } : undefined
      )
      return response.data
    },
    retry: false,
    staleTime: 60_000
  })

  if (!data?.length) {
    return null
  }

  return (
    <Box mt={6}>
      <Box mb={4} flexDirection="row" justifyContent="space-between" alignItems="center">
        <ThemedText variant="mono" letterSpacing="wide">
          {t('search.hotPlaces.title')}
        </ThemedText>
        <ThemedText variant="secondary" size="xs">
          {t('search.hotPlaces.subtitle')}
        </ThemedText>
      </Box>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => <HotPlacesCard item={item} index={index} />}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  list: {
    gap: 16
  }
})
