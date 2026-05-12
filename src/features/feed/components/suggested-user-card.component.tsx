import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { UsersProfileFollowActions } from '@src/features/users-profile/components'
import { Avatar, Box, ThemedText } from '@src/shared/components'
import { UserSuggestion } from '@src/shared/domain/users.model'
import { useNavigateToProfile } from '@src/shared/hooks'

interface SuggestedUserCardProps {
  item: UserSuggestion
  badge?: string
}

export const SuggestedUserCard: React.FC<SuggestedUserCardProps> = ({ item, badge }) => {
  const navigateToProfile = useNavigateToProfile()

  return (
    <Box style={styles.card}>
      <TouchableOpacity onPress={() => navigateToProfile(item.id)} style={styles.info} activeOpacity={0.7}>
        <Avatar uri={item.image} size="sm" />
        <Box ml={3} flex={1}>
          <ThemedText weight="semibold" size="sm">
            {item.username}
          </ThemedText>
          {badge ? (
            <ThemedText size="xs" color="textSecondary">
              {badge}
            </ThemedText>
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
