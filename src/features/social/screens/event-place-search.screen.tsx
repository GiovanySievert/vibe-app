import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Avatar, Box, Divider, Input, LoadingPage, ThemedText, Touchable } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { useDebounce } from '@src/shared/hooks'
import { PlacesService } from '@src/shared/services'

import { eventPlacePickerAtom } from '../state/event-place-picker.state'

type EventPlaceSearchScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'EventPlaceSearchScreen'>

export const EventPlaceSearchScreen: React.FC<EventPlaceSearchScreenProps> = ({ navigation }) => {
  const setSelectedPlace = useSetAtom(eventPlacePickerAtom)
  const [inputSearch, setInputSearch] = useState('')
  const debouncedSearch = useDebounce(inputSearch, 300)

  const { data: places, isFetching } = useQuery<PlacesModel[], Error>({
    queryKey: ['eventPlaceSearch', debouncedSearch],
    queryFn: async () => {
      const response = await PlacesService.fetchPlaceByName(debouncedSearch)
      return response.data
    },
    retry: false,
    staleTime: 0,
    enabled: debouncedSearch.length >= 3
  })

  const handleSelectPlace = (place: PlacesModel) => {
    setSelectedPlace({
      id: place.id,
      name: place.name,
      type: place.type ?? null,
      neighborhood: place.neighborhood ?? null
    })
    navigation.goBack()
  }

  return (
    <Box flex={1} bg="background">
      <ScrollView style={styles.scroll} overScrollMode="never" keyboardShouldPersistTaps="handled">
        <Screen>
          <Box p={5} gap={4}>
            <Box gap={1}>
              <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
                local do evento
              </ThemedText>
              <ThemedText color="textSecondary">Busque um local para associar ao evento.</ThemedText>
            </Box>

            <Input
              value={inputSearch}
              onChange={({ nativeEvent }) => setInputSearch(nativeEvent.text)}
              autoFocus
              isClearable
              onClear={() => setInputSearch('')}
              placeholder="buscar local"
              startIconName="Search"
              startIconColor="textPrimary"
            />

            {inputSearch.length < 3 && (
              <ThemedText color="textSecondary" size="sm">
                Digite pelo menos 3 caracteres para buscar um local.
              </ThemedText>
            )}

            {isFetching && (
              <Box bg="background">
                <LoadingPage />
              </Box>
            )}

            {!isFetching && inputSearch.length >= 3 && !places?.length && (
              <ThemedText color="textSecondary">Nenhum local encontrado.</ThemedText>
            )}

            <Box gap={4}>
              {(places ?? []).map((place) => (
                <Touchable key={place.id} onPress={() => handleSelectPlace(place)}>
                  <Box gap={4}>
                    <Box flexDirection="row" alignItems="center" gap={4}>
                      <Avatar size="sm" square uri={place.image} placeholderIcon="MapPin" />
                      <Box flex={1}>
                        <ThemedText color="textPrimary" weight="medium" size="lg">
                          {place.name}
                        </ThemedText>
                        {!![place.type, place.neighborhood].filter(Boolean).length && (
                          <ThemedText
                            color="textSecondary"
                            variant="mono"
                            weight="medium"
                            size="xs"
                            letterSpacing="wider"
                          >
                            {[place.type, place.neighborhood].filter(Boolean).join(' · ')}
                          </ThemedText>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                  </Box>
                </Touchable>
              ))}
            </Box>
          </Box>
        </Screen>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background
  }
})
