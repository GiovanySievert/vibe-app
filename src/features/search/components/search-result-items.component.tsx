import { TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, Divider, ThemedText } from '@src/shared/components'
import { PlacesModel } from '@src/shared/domain'
import { GetUserByUsername } from '@src/shared/domain/users.model'

enum SearchType {
  USERS = 'USERS',
  PLACES = 'PLACES'
}

type SearchResultItemProps = {
  data: PlacesModel | GetUserByUsername
  searchType: 'PLACES' | 'USERS'
  onItemClick?: () => void
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({ data, searchType, onItemClick }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const handleNavigation = () => {
    if (onItemClick) {
      onItemClick()
    }
    navigation.goBack()
    if (searchType === SearchType.PLACES) {
      return navigation.navigate('Modals', { screen: 'PlacesDetailsScreen', params: { placeId: data.id } })
    } else {
      navigation.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId: data.id } })
    }
  }

  const isPlace = searchType === SearchType.PLACES
  const placeData = data as PlacesModel
  const userData = data as GetUserByUsername

  return (
    <>
      <Box flexDirection="row" alignItems="center" gap={3}>
        <Avatar
          size="sm"
          uri={
            isPlace
              ? placeData.image
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkB5zkX3mrbLiQ_WjvF-rWwWQJEJ3wK3oB-Q&s'
          }
        />
        <TouchableOpacity onPress={() => handleNavigation()}>
          {isPlace ? (
            <>
              <ThemedText>{placeData.name}</ThemedText>
              <ThemedText color="textSecondary" size="sm">
                Bar
              </ThemedText>
            </>
          ) : (
            <ThemedText>{userData.username}</ThemedText>
          )}
        </TouchableOpacity>
      </Box>
      <Divider />
    </>
  )
}
