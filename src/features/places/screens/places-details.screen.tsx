import React, { useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers/toast.provider'
import { Box, LoadingScreen, ThemedIcon, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesByIdResponse } from '@src/shared/domain'
import { useAppTranslation } from '@src/shared/i18n'
import { PlacesService } from '@src/shared/services'

import {
  PlacesAddress,
  PlacesCardInfo,
  PlacesFlutuantButton,
  PlacesInfoHeader,
  PlacesInfoPills,
  PlacesOpeningHours,
  PlacesReviewFriends,
  PlacesReviews
} from '../components'

type PlacesDetailsScreenScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'PlacesDetailsScreen'>

export const PlacesDetailsScreen: React.FC<PlacesDetailsScreenScreenProps> = ({ route, navigation }) => {
  const { t } = useAppTranslation()
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
    queryKey: ['fetchPlacesById', placeId],
    queryFn: fetchPlaces,
    retry: false,
    staleTime: 10 * 60_000,
    enabled: !!placeId
  })

  const hasFailed = !isLoading && (!!error || !placeData)

  useEffect(() => {
    if (!hasFailed) return
    showToast(t('places.errors.loadFailed'), 'error')
    navigation.goBack()
  }, [hasFailed, navigation, showToast, t])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!placeData) {
    return null
  }

  const isHot = route.params?.isHot === true || !!placeData.isHot

  return (
    <Box flex={1} bg="background">
      <ScrollView style={styles.scroll} overScrollMode="never" showsVerticalScrollIndicator={false}>
        <PlacesInfoHeader place={placeData} isHot={isHot} onBack={() => navigation.goBack()} />
        <PlacesInfoPills place={placeData} />
        {placeData.about ? (
          <Box pl={6} pr={6} mt={5} pb={1}>
            <ThemedText>{placeData.about}</ThemedText>
          </Box>
        ) : null}
        <PlacesCardInfo place={placeData} />
        {placeData.openingHours?.length ? (
          <PlacesOpeningHours place={placeData} />
        ) : (
          <PlacesAddress place={placeData} />
        )}
        {isHot ? (
          <Box pl={6} pr={6} pt={5} pb={5} style={styles.hotSection}>
            <Box flexDirection="row" alignItems="center" gap={3}>
              <Box alignItems="center" justifyContent="center" style={styles.hotIcon}>
                <ThemedIcon name="Flame" size={16} color="background" type="solid" />
              </Box>
              <Box flex={1} gap={1}>
                <ThemedText variant="mono" size="sm" textTransform="uppercase" color="primary">
                  {t('places.hotLabel')}
                </ThemedText>
                <ThemedText color="textSecondary">{t('places.hotDescription')}</ThemedText>
              </Box>
            </Box>
          </Box>
        ) : null}
        <PlacesReviewFriends placeId={placeId} />
        <PlacesReviews placeId={placeId} />
        <Box h={14} />
      </ScrollView>

      <PlacesFlutuantButton
        place={{
          id: placeId,
          name: placeData.name,
          type: placeData.brand.type,
          neighborhood: placeData.location.neighborhood,
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
  },
  hotSection: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.primaryGlow,
    marginTop: 8
  },
  hotIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary
  }
})
