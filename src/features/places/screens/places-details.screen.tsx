import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers'
import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { PlacesService } from '@src/shared/services'

import {
  PlacesAddress,
  PlacesCardInfo,
  PlacesFlutuantButton,
  PlacesInfoHeader,
  PlacesInfoPills,
  PlacesReviews
} from '../components'

type PlacesDetailsScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'PlacesDetailsScreen'>

export const PlacesDetailsScreen: React.FC<PlacesDetailsScreenScreenProps> = ({ route, navigation }) => {
  const placeId = route.params?.placeId
  const { showToast } = useToast()

  const fetchPlaces = async () => {
    const response = await PlacesService.fetchPlaceById(placeId)
    return response.data
  }

  const {
    data: placeData,
    isLoading,
    error
  } = useQuery<PlacesByIdResponse, Error>({
    queryKey: ['fetchPlacesById'],
    queryFn: fetchPlaces,
    retry: false,
    staleTime: 0
  })

  if (isLoading) {
    return (
      <Box flex={1} bg="background" alignItems="center" justifyContent="center">
        <ThemedText variant="mono">carregando...</ThemedText>
      </Box>
    )
  }

  if (!placeData || error) {
    navigation.goBack()
    showToast('algo deu errado, tente novamente mais tarde!', 'error')
    return null
  }

  return (
    <Box flex={1} bg="background">
      <ScrollView style={styles.scroll} overScrollMode="never" showsVerticalScrollIndicator={false}>
        <PlacesInfoHeader place={placeData} onBack={() => navigation.goBack()} />
        <PlacesInfoPills place={placeData} />
        {placeData.about ? (
          <Box pl={6} pr={6} mt={5} pb={1}>
            <ThemedText>{placeData.about}</ThemedText>
          </Box>
        ) : null}
        <PlacesCardInfo place={placeData} />
        <PlacesAddress place={placeData} />
        <PlacesReviews placeId={placeId} />
        <Box h={14} />
      </ScrollView>

      <PlacesFlutuantButton
        place={{
          id: placeId,
          name: placeData.name,
          lat: placeData.location.lat,
          lng: placeData.location.lng
        }}
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1
  },
  sectionHeader: {
    paddingTop: 28,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 8
  }
})
