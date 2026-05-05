import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { UsersProfileFollowActions } from '@src/features/users-profile/components'
import { Avatar, Box, ThemedText } from '@src/shared/components'
import { UserSuggestion } from '@src/shared/domain/users.model'

interface SuggestedUserCardProps {
  item: UserSuggestion
  badge?: string
}

export const SuggestedUserCard: React.FC<SuggestedUserCardProps> = ({ item, badge }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  return (
    <Box style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Modals', {
            screen: 'UsersProfileScreen',
            params: { userId: item.id }
          })
        }
        style={styles.info}
        activeOpacity={0.7}
      >
        <Avatar uri={item.image} size="sm" />
        <Box ml={3} flex={1}>
          <ThemedText weight="semibold" size="sm">
            {item.username}
          </ThemedText>
          {badge ? (
            <ThemedText size="xs" color="textSecondary">{badge}</ThemedText>
          ) : item.mutualCount > 0 ? (
            <ThemedText size="xs" color="textSecondary">
              {item.mutualCount} {item.mutualCount === 1 ? 'amigo' : 'amigos'} em comum
            </ThemedText>
          ) : null}
        </Box>
      </TouchableOpacity>
      <UsersProfileFollowActions
        userData={{ id: item.id, username: item.username, image: item.image, name: item.username, bio: null }}
        compact
      />
    </Box>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  }
})
