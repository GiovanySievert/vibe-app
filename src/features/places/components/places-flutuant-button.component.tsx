import React, { useMemo } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList, ModalNavigatorParamsList } from '@src/app/navigation/types'
import { Box, Button, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { formatCountdown } from '@src/shared/utils'

import { useDistanceToPlace } from '../hooks/use-distance-to-place.hook'
import { usePlaceReviewEligibility } from '../hooks/use-place-review-eligibility.hook'

type Nav = NativeStackNavigationProp<ModalNavigatorParamsList>

type PlaceArg = {
  id: string
  name: string
  type?: string
  neighborhood?: string
  lat: number | string
  lng: number | string
}

enum FlutuantButtonStatus {
  LOADING = 'loading',
  NO_USER_LOCATION = 'no_user_location',
  OUT_OF_RANGE = 'out_of_range',
  COOLDOWN = 'cooldown',
  READY = 'ready'
}

type FlutuantButtonState =
  | { status: FlutuantButtonStatus.LOADING }
  | { status: FlutuantButtonStatus.NO_USER_LOCATION }
  | { status: FlutuantButtonStatus.OUT_OF_RANGE; distanceMeters: number }
  | { status: FlutuantButtonStatus.COOLDOWN; secondsRemaining: number }
  | { status: FlutuantButtonStatus.READY }

const toNumberCoord = (value: number | string): number => (typeof value === 'string' ? Number(value) : value)

export const PlacesFlutuantButton = ({ place }: { place: PlaceArg }) => {
  const navigation = useNavigation<Nav>()
  const { distanceMeters, withinRange, hasLocation } = useDistanceToPlace(place)

  const { eligibility, isLoading, secondsUntilAllowed } = usePlaceReviewEligibility({
    placeId: place.id
  })

  const placeLat = toNumberCoord(place.lat)
  const placeLng = toNumberCoord(place.lng)

  const buttonState = useMemo<FlutuantButtonState>(() => {
    if (!hasLocation) return { status: FlutuantButtonStatus.NO_USER_LOCATION }
    if (isLoading) return { status: FlutuantButtonStatus.LOADING }
    if (withinRange === false) {
      return {
        status: FlutuantButtonStatus.OUT_OF_RANGE,
        distanceMeters: distanceMeters ?? 0
      }
    }
    if (eligibility?.cooldown.active) {
      return {
        status: FlutuantButtonStatus.COOLDOWN,
        secondsRemaining: secondsUntilAllowed
      }
    }
    return { status: FlutuantButtonStatus.READY }
  }, [hasLocation, isLoading, withinRange, distanceMeters, eligibility, secondsUntilAllowed])

  const isDisabled = buttonState.status !== FlutuantButtonStatus.READY

  const handlePress = () => {
    if (buttonState.status !== FlutuantButtonStatus.READY) return
    navigation.getParent<NativeStackNavigationProp<AuthenticatedStackParamList>>()?.navigate('Tabs', {
      screen: 'PostScreen',
      params: {
        screen: 'PostMain',
        params: {
          preselectedPlace: {
            id: place.id,
            name: place.name,
            type: place.type,
            neighborhood: place.neighborhood,
            location: {
              lat: placeLat,
              lon: placeLng
            }
          }
        }
      }
    })
  }

  return (
    <Box m={5} alignItems="center" justifyContent="center" bg="primary">
      <Button style={styles.button} onPress={handlePress} disabled={isDisabled}>
        <FlutuantButtonLabel state={buttonState} />
      </Button>
    </Box>
  )
}

const FlutuantButtonLabel = ({ state }: { state: FlutuantButtonState }) => {
  const { t } = useAppTranslation()

  switch (state.status) {
    case FlutuantButtonStatus.LOADING:
      return (
        <Box flexDirection="row" alignItems="center" gap={2}>
          <ActivityIndicator color="#FFFFFF" />
          <ThemedText color="background" size="lg" weight="semibold">
            {t('places.reviewButton.checking')}
          </ThemedText>
        </Box>
      )
    case FlutuantButtonStatus.NO_USER_LOCATION:
      return (
        <ThemedText color="background" size="lg" weight="semibold">
          {t('places.reviewButton.enableLocation')}
        </ThemedText>
      )
    case FlutuantButtonStatus.OUT_OF_RANGE:
      return (
        <ThemedText color="background" size="lg" weight="semibold">
          {t('places.reviewButton.getCloser', {
            distance: state.distanceMeters
          })}
        </ThemedText>
      )
    case FlutuantButtonStatus.COOLDOWN:
      return (
        <ThemedText color="background" size="lg" weight="semibold">
          {t('places.reviewButton.wait', {
            time: formatCountdown(state.secondsRemaining)
          })}
        </ThemedText>
      )
    case FlutuantButtonStatus.READY:
      return (
        <ThemedText color="background" size="lg" weight="semibold">
          {t('places.reviewButton.ready')}
        </ThemedText>
      )
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    width: '100%'
  }
})
