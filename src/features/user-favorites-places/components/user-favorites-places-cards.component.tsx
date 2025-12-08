import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Card, Divider, ThemedText } from '@src/shared/components'
import { userFavoritesPlacesAtom } from '@src/shared/state'

interface UserFavoritePlace {
  id: string
  venueId: string
  name: string
  avatar: string
}

export const UserFavoritesPlacesCards = () => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const [userFavoritesPlaces] = useAtom(userFavoritesPlacesAtom)

  const renderItem = ({ item, index }: { item: UserFavoritePlace; index: number }) => (
    <Box>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Modals', {
            screen: 'PlacesDetailsScreen',
            params: { placeId: item.venueId }
          })
        }
      >
        <Box flexDirection="row" alignItems="center" gap={3}>
          <Avatar ring={0} uri={item.avatar} size="sm" />
          <ThemedText color="textPrimary" weight="medium">
            {item.name}
          </ThemedText>
        </Box>
      </TouchableOpacity>
      {index !== userFavoritesPlaces.length - 1 && <Divider />}
    </Box>
  )

  if (!userFavoritesPlaces?.length) {
    return
  }

  return (
    <Box mr={5} ml={5} gap={3}>
      <ThemedText>Favoritos</ThemedText>
      <Card pr={5} pl={5} gap={3}>
        <FlatList
          data={userFavoritesPlaces}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </Card>
    </Box>
  )
}
