import React, { useMemo } from 'react'
import { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated'

import { useAtom, useSetAtom } from 'jotai'

import { UserFavoritesPlacesService } from '@src/features/user-favorites-places/services'
import { AnimatedTouchable, Box, ThemedIcon } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'
import { useUserFavoritesPlaces } from '@src/shared/hooks/use-user-favorites-places.hook'
import { userFavoritesPlacesAtom } from '@src/shared/state'
import { HIT_SLOP, triggerLightHaptic } from '@src/shared/utils'

type PlacesHeaderFavoriteButtonProps = {
  place: PlacesByIdResponse
}

export const PlacesHeaderFavoriteButton: React.FC<PlacesHeaderFavoriteButtonProps> = ({ place }) => {
  const scale = useSharedValue(1)
  const setFavoritePlaces = useSetAtom(userFavoritesPlacesAtom)
  const { refetch } = useUserFavoritesPlaces()

  const [userFavoritesPlaces] = useAtom(userFavoritesPlacesAtom)

  const isPlaceFavorited = useMemo(
    () => userFavoritesPlaces.find((favoritePlace) => favoritePlace.placeId === place.id),
    [userFavoritesPlaces, place.id]
  )
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    }
  })

  const favoritePlace = async () => {
    triggerLightHaptic()
    scale.value = withSequence(
      withSpring(1.15, { damping: 5, stiffness: 200 }),
      withSpring(1, { damping: 5, stiffness: 200 })
    )

    await UserFavoritesPlacesService.favoritePlace(place.id)
    refetch()
  }

  const unfavoritePlace = async () => {
    triggerLightHaptic()
    scale.value = withSequence(
      withSpring(1.15, { damping: 5, stiffness: 200 }),
      withSpring(1, { damping: 5, stiffness: 200 })
    )
    setFavoritePlaces((prev) => prev.filter((fav) => fav.placeId !== place.id))
    return UserFavoritesPlacesService.unfavoritePlace(place.id)
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <AnimatedTouchable
        hitSlop={HIT_SLOP}
        onPress={() => (isPlaceFavorited ? unfavoritePlace() : favoritePlace())}
        style={animatedStyle}
      >
        <ThemedIcon name="Heart" color="background" type={isPlaceFavorited ? 'solid' : 'light'} size={20} />
      </AnimatedTouchable>
    </Box>
  )
}
