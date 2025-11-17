import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Divider, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { Tabs } from '@src/shared/components/tabs/tabs.component'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import {
  PlacesAddress,
  PlacesCardInfo,
  PlacesFlutuantButton,
  PlacesInfoHeader,
  PlacesInfoPills,
  PlacesMenu,
  PlacesScreenHeader
} from '../components'

type PlacesDetailsScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'PlacesDetailsScreen'>

export const PlacesDetailsScreen: React.FC<PlacesDetailsScreenScreenProps> = ({ route }) => {
  const placeId = route.params?.placeId
  const fetchPlaces = async () => {
    const response = await PlacesService.fetchPlaceById(placeId)
    return response.data
  }

  const { data: placeData, isLoading } = useQuery<PlacesByIdResponse, Error>({
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

  if (!placeData) {
    return
  }

  return (
    <Box flex={1}>
      <ScrollView style={styles.scroll} overScrollMode="never">
        <Screen>
          <PlacesScreenHeader place={placeData} />
          <PlacesInfoHeader place={placeData} />
          <Tabs titles={['Info', 'Cardápio']} defaultIndex={0}>
            <>
              <PlacesInfoPills place={placeData} />
              <PlacesCardInfo place={placeData} />
              <PlacesAddress place={placeData} />
            </>
            <PlacesMenu place={placeData} />
            <Box mb={14}>
              <Divider />
            </Box>
          </Tabs>
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
