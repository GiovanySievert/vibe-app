import React from 'react'
import { StyleSheet } from 'react-native'

import { UsersProfileFollowActions } from '@src/features/users-profile/components'
import { Avatar, Box, ThemedText, Touchable } from '@src/shared/components'
import { UserSuggestion } from '@src/shared/domain/users.model'
import { useNavigateToProfile } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'

interface SuggestedUserCardProps {
  item: UserSuggestion
  badge?: string
}

export const SuggestedUserCard: React.FC<SuggestedUserCardProps> = ({ item, badge }) => {
  const { t } = useAppTranslation()
  const navigateToProfile = useNavigateToProfile()

  return (
    <Box style={styles.card}>
      <Touchable onPress={() => navigateToProfile(item.id)} style={styles.info} activeOpacity={0.7}>
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
              {t('social.suggestions.mutualFriends', {
                count: item.mutualCount
              })}
            </ThemedText>
          ) : null}
        </Box>
      </Touchable>
      <UsersProfileFollowActions
        userData={{
          id: item.id,
          username: item.username,
          image: item.image,
          name: item.username,
          bio: null
        }}
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
