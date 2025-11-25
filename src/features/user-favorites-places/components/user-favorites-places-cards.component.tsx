import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Card, Divider, ThemedText } from '@src/shared/components'
import { userFavoritesPlacesAtom } from '@src/shared/state'

export const UserFavoritesPlacesCards = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const [userFavoritesPlaces] = useAtom(userFavoritesPlacesAtom)

  if (!userFavoritesPlaces?.length) {
    return <ThemedText>Sem favoritos</ThemedText>
  }
  return (
    <Box mr={5} ml={5} gap={3}>
      <ThemedText>Favoritos</ThemedText>
      <Card pr={5} pl={5} gap={3}>
        {userFavoritesPlaces.map((userFavoritePlace, index) => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Modals', {
                  screen: 'PlacesDetailsScreen',
                  params: { placeId: userFavoritePlace.id }
                })
              }
            >
              <Box flexDirection="row" alignItems="center" gap={3} key={userFavoritePlace.id}>
                <Avatar ring={0} uri={userFavoritePlace.avatar} size="sm" />
                <ThemedText color="primary" weight="medium">
                  {userFavoritePlace.name}
                </ThemedText>
              </Box>
              {index !== userFavoritesPlaces.length - 1 && <Divider />}
            </TouchableOpacity>
          )
        })}
      </Card>
    </Box>
  )
}
