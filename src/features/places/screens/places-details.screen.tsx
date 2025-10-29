import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Divider, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import {
  PlacesAddress,
  PlacesCardInfo,
  PlacesFlutuantButton,
  PlacesInfoHeader,
  PlacesInfoPills,
  PlacesOpeningHours,
  PlacesScreenHeader
} from '../components'

type PlacesDetailsScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'PlaceDetailsScreen'>

export const PlacesDetailsScreen: React.FC<PlacesDetailsScreenScreenProps> = ({ route }) => {
  const placeId = route.params?.placeId

  const fetchPlaces = async () => {
    const response = await PlacesService.fetchPlaceById(placeId)
    return response.data
  }

  const { data: placeData, isLoading } = useQuery<PlacesModel[], Error>({
    queryKey: ['fetchPlacesById'],
    queryFn: fetchPlaces,
    retry: false,
    staleTime: 0
  })

  if (isLoading) {
    return (
      <Box bg="background">
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
        <ThemedText>CARREGANDO</ThemedText>
      </Box>
    )
  }

  return (
    <Box flex={1}>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <PlacesScreenHeader />
          <PlacesInfoHeader place={placeData} />
          <PlacesInfoPills />
          <PlacesCardInfo />
          <PlacesAddress />
          <PlacesOpeningHours />

          <Box mb={14}>
            <Divider />
          </Box>
        </Screen>
      </ScrollView>

      <PlacesFlutuantButton />
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
