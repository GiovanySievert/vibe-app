import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import { SearchInput, SearchPlaces } from '../components'

type SearchScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'SearchScreen'>

export const SearchScreen: React.FC<SearchScreenScreenProps> = ({}) => {
  const [inputSearch, setInputSearch] = useState('')

  const fetchPlacesByName = async () => {
    const response = await PlacesService.fetchPlaceByName(inputSearch)
    return response.data
  }

  const { data: placeData, isLoading } = useQuery<PlacesByIdResponse, Error>({
    queryKey: ['fetchPlacesByName'],
    queryFn: fetchPlacesByName,
    retry: false,
    staleTime: 0
  })

  if (isLoading) {
    return (
      <Box bg="background">
        <ThemedText>CARREGANDO</ThemedText>
      </Box>
    )
  }

  // if (!placeData) {
  //   return
  // }

  return (
    <Box flex={1}>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <Box p={5}>
            <SearchInput />
            <SearchPlaces />
          </Box>
        </Screen>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  absoluteContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 24,
    padding: 24
  },
  relativeContainer: {
    flex: 1
  },
  scroll: { flex: 1, backgroundColor: theme.colors.background }
})
