import { Pressable, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Divider, ThemedIcon, ThemedText } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { GetUserByUsername } from '@src/shared/domain/users.model'
import { useNavigateToProfile } from '@src/shared/hooks'
import { HIT_SLOP } from '@src/shared/utils'

enum SearchType {
  USERS = 'USERS',
  PLACES = 'PLACES'
}

type SearchResultItemProps = {
  data: PlacesModel | GetUserByUsername
  searchType: 'PLACES' | 'USERS'
  onItemClick?: () => void
  onRemove?: () => void
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ data, searchType, onItemClick, onRemove }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const navigateToProfile = useNavigateToProfile()

  const handleNavigation = () => {
    if (onItemClick) {
      onItemClick()
    }
    navigation.goBack()
    if (searchType === SearchType.PLACES) {
      return navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId: data.id } })
    } else {
      navigateToProfile(data.id)
    }
  }

  const isPlace = searchType === SearchType.PLACES
  const placeData = data as PlacesModel
  const userData = data as GetUserByUsername

  return (
    <>
      <Box flexDirection="row" alignItems="center" gap={4}>
        <Avatar
          size="sm"
          square={isPlace ? true : false}
          uri={isPlace ? placeData.image : (userData.image ?? undefined)}
          placeholderIcon={isPlace ? 'MapPin' : 'User'}
        />
        <TouchableOpacity onPress={() => handleNavigation()} style={{ flex: 1 }}>
          {isPlace ? (
            <>
              <ThemedText color="textPrimary" weight="medium" size="lg">
                {placeData.name}
              </ThemedText>
              {(placeData.type || placeData.neighborhood) && (
                <ThemedText color="textSecondary" variant="mono" weight="medium" size="xs" letterSpacing="wider">
                  {[placeData.type, placeData.neighborhood].filter(Boolean).join(' · ')}
                </ThemedText>
              )}
            </>
          ) : (
            <>
              <ThemedText color="textPrimary" weight="medium" size="lg">
                {userData.username}
              </ThemedText>
              <ThemedText color="textSecondary" variant="mono" weight="medium" size="xs" letterSpacing="wider">
                @{userData.username}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
        {onRemove && (
          <Pressable
            onPress={onRemove}
            hitSlop={HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel="Remover do histórico"
          >
            <ThemedIcon name="X" size={18} color="textSecondary" />
          </Pressable>
        )}
      </Box>
      <Divider />
    </>
  )
}
