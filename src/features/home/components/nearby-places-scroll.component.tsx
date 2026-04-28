import React from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { formatDistance } from '@src/shared/utils'

type Props = {
  places: PlacesModel[]
}

export const NearbyPlacesScroll: React.FC<Props> = ({ places }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  return (
    <Box pt={3} pb={4} bg="background">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" pl={4} pr={4} pb={2}>
        <ThemedText weight="bold">o que tá rolando</ThemedText>
        <ThemedText variant="mono" color="textSecondary" size="sm" style={{ marginTop: 5 }}>
          {places.length} locais ativos
        </ThemedText>
      </Box>
      <FlatList
        horizontal
        data={places}
        keyExtractor={(place) => place.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item: place }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId: place.id } })
            }
          >
            <Box
              bg="background"
              flexDirection="row"
              alignItems="center"
              pl={3}
              pr={3}
              pt={1}
              pb={1}
              gap={1}
              style={{ borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border, minWidth: 100 }}
            >
              <Box
                style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: theme.colors.primary, marginRight: 2 }}
              />
              <ThemedText weight="semibold" numberOfLines={1}>
                {place.name}
              </ThemedText>
              <Box
                style={{
                  width: 3,
                  height: 3,
                  borderRadius: 1.5,
                  backgroundColor: theme.colors.textSecondary,
                  marginTop: 3,
                  marginHorizontal: 2
                }}
              />
              <ThemedText variant="mono" color="textSecondary" size="sm" style={{ marginTop: 3 }}>
                {formatDistance(place.distance)}
              </ThemedText>
            </Box>
          </TouchableOpacity>
        )}
      />
    </Box>
  )
}
