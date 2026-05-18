import React from 'react'
import { FlatList } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Card, Divider, ThemedIcon, ThemedText, Touchable } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { userFavoritesPlacesAtom } from '@src/shared/state'

interface UserFavoritePlace {
  id: string
  venueId: string
  name: string
  avatar: string
}

export const UserFavoritesPlacesCards = () => {
  const { t } = useAppTranslation()
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const [userFavoritesPlaces] = useAtom(userFavoritesPlacesAtom)

  const renderItem = ({ item, index }: { item: UserFavoritePlace; index: number }) => {
    const [placeName, neighborhood] = item.name.split(' - ')

    return (
      <>
        <Box pl={4} pr={4} pb={4} pt={4}>
          <Touchable
            onPress={() =>
              navigation.navigate('Modals', {
                screen: 'PlacesDetailsScreen',
                params: { placeId: item.venueId }
              })
            }
          >
            <Box flexDirection="row" justifyContent="space-between" alignItems="center" gap={3}>
              <Box flexDirection="row" gap={4} alignItems="center">
                <Avatar square uri={item.avatar} placeholderIcon="MapPin" />
                <Box>
                  <ThemedText color="textPrimary" weight="bold" textTransform="lowercase">
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
                <Touchable>
                  <ThemedIcon name="ChevronRight" size={16} color="textSecondary" />
                </Touchable>
              </Box>
            </Box>
          </Touchable>
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
          {t('userFavoritesPlaces.title')}
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
