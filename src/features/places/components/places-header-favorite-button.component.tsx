import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated'

import { useAtom, useSetAtom } from 'jotai'

import { UserFavoritesPlacesService } from '@src/features/user-favorites-places/services'
import { Box, ThemedIcon } from '@src/shared/components'
import { PlacesByIdResponse } from '@src/shared/domain'
import { useUserFavoritesPlaces } from '@src/shared/hooks/use-user-favorites-places.hook'
import { userFavoritesPlacesAtom } from '@src/shared/state'
import { HIT_SLOP } from '@src/shared/utils'

type PlacesHeaderFavoriteButtonProps = {
  place: PlacesByIdResponse
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const PlacesHeaderFavoriteButton: React.FC<PlacesHeaderFavoriteButtonProps> = ({ place }) => {
  const scale = useSharedValue(1)
  const setFavoritePlaces = useSetAtom(userFavoritesPlacesAtom)
  const { refetch } = useUserFavoritesPlaces()

  const [userFavoritesPlaces] = useAtom(userFavoritesPlacesAtom)

  const isPlaceFavorited = useMemo(
    () => userFavoritesPlaces.find((favoritePlace) => favoritePlace.venueId === place.id),
    [userFavoritesPlaces, place.id]
  )
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    }
  })

  const favoritePlace = async () => {
    scale.value = withSequence(
      withSpring(1.15, { damping: 5, stiffness: 200 }),
      withSpring(1, { damping: 5, stiffness: 200 })
    )

    await UserFavoritesPlacesService.favoritePlace(place.id)
    refetch()
  }

  const unfavoritePlace = async () => {
    scale.value = withSequence(
      withSpring(1.15, { damping: 5, stiffness: 200 }),
      withSpring(1, { damping: 5, stiffness: 200 })
    )
    setFavoritePlaces((prev) => prev.filter((fav) => fav.venueId !== place.id))
    return UserFavoritesPlacesService.unfavoritePlace(place.id)
  }

  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <AnimatedTouchableOpacity
        hitSlop={HIT_SLOP}
        onPress={() => (isPlaceFavorited ? unfavoritePlace() : favoritePlace())}
        style={animatedStyle}
      >
        <ThemedIcon name="Heart" color="textSecondary" type={isPlaceFavorited ? 'solid' : 'light'} size={16} />
      </AnimatedTouchableOpacity>
    </Box>
  )
}
