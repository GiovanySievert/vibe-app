import React from 'react'
import { FlatList } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Box, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { PlacesModel } from '@src/shared/domain'
import { useAppTranslation } from '@src/shared/i18n'
import { formatDistance } from '@src/shared/utils'

type Props = {
  places: PlacesModel[]
  selectedPlaceId?: string
  onPlacePress?: (place: PlacesModel) => void
}

export const NearbyPlacesScroll: React.FC<Props> = ({ places, selectedPlaceId, onPlacePress }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const { t } = useAppTranslation()

  const handlePlacePress = (place: PlacesModel) => {
    if (onPlacePress) {
      onPlacePress(place)
      return
    }

    navigation.navigate('Modals', {
      screen: 'PlacesDetailsScreen',
      params: { placeId: place.id, isHot: place.isHot }
    })
  }

  return (
    <Box pt={3} pb={4} bg="background">
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" pl={4} pr={4} pb={2}>
        <ThemedText weight="bold">{t('home.places.title')}</ThemedText>
        <ThemedText variant="mono" color="textSecondary" size="sm" style={{ marginTop: 5 }}>
          {t('home.places.activeCount', { count: places.length })}
        </ThemedText>
      </Box>
      <FlatList
        horizontal
        data={places}
        keyExtractor={(place) => place.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        renderItem={({ item: place }) => {
          const isSelected = place.id === selectedPlaceId

          return (
            <Touchable onPress={() => handlePlacePress(place)}>
              <Box
                bg={isSelected ? 'primary' : 'background'}
                flexDirection="row"
                alignItems="center"
                pl={3}
                pr={3}
                pt={1}
                pb={1}
                gap={1}
                style={{
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                  minWidth: 100
                }}
              >
                <Box
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: isSelected ? theme.colors.background : theme.colors.primary,
                    marginRight: 2
                  }}
                />
                <ThemedText weight="semibold" color={isSelected ? 'background' : 'textPrimary'} numberOfLines={1}>
                  {place.name}
                </ThemedText>
                <Box
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 1.5,
                    backgroundColor: isSelected ? theme.colors.background : theme.colors.textSecondary,
                    marginTop: 3,
                    marginHorizontal: 2
                  }}
                />
                <ThemedText
                  variant="mono"
                  color={isSelected ? 'background' : 'textSecondary'}
                  size="sm"
                  style={{ marginTop: 3 }}
                >
                  {formatDistance(place.distance)}
                </ThemedText>
              </Box>
            </Touchable>
          )
        }}
      />
    </Box>
  )
}
