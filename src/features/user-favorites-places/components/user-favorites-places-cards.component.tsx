import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Card, Divider, ThemedIcon, ThemedText } from '@src/shared/components'
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

  const renderItem = ({ item, index }: { item: UserFavoritePlace; index: number }) => {
    const [placeName, neighborhood] = item.name.split(' - ')

    return (
      <>
        <Box pl={4} pr={4} pb={4} pt={4}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Modals', {
                screen: 'PlacesDetailsScreen',
                params: { placeId: item.venueId }
              })
            }
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={3}>
              <Box flexDirection="row" gap={2} alignItems="center">
                <Avatar square uri={item.avatar} size="sm" />
                <Box>
                  <ThemedText color="textPrimary" weight="bold" size="sm" textTransform="lowercase">
                    {placeName}
                  </ThemedText>
                  {neighborhood && (
                    <ThemedText color="textSecondary" variant="mono" size="xs" textTransform="lowercase">
                      {neighborhood}
                    </ThemedText>
                  )}
                </Box>
              </Box>

              <Box mt={3}>
                <TouchableOpacity>
                  <ThemedIcon name="ChevronRight" size={16} color="textSecondary" />
                </TouchableOpacity>
              </Box>
            </Box>
          </TouchableOpacity>
        </Box>

        {index !== userFavoritesPlaces.length - 1 && <Divider />}
      </>
    )
  }

  if (!userFavoritesPlaces?.length) {
    return
  }

  return (
    <Box mr={5} ml={5} gap={3}>
      <Box justifyContent="space-between" flexDirection="row" alignItems="baseline">
        <ThemedText color="textSecondary" variant="mono" size="sm">
          FAVORITOS
        </ThemedText>
        <ThemedText color="textSecondary" variant="mono">
          {userFavoritesPlaces.length}
        </ThemedText>
      </Box>
      <Card gap={3}>
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
