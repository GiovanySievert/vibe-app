import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Avatar, Box, ThemedText } from '@src/shared/components'
import { formatRelativeTime } from '@src/shared/utils'

import { FeedReviewComment } from '../domain'

type Props = {
  item: FeedReviewComment
}

export const FeedReviewCommentItem: React.FC<Props> = ({ item }) => {
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  return (
    <Box flexDirection="row" gap={3} mb={4}>
      <Avatar
        size="xs"
        uri={item.user.image}
        placeholderIcon="User"
        onPress={() =>
          navigation.navigate('Modals', { screen: 'UsersProfileScreen', params: { userId: item.user.id } })
        }
      />
      <Box flex={1} gap={1}>
        <Box flexDirection="row" alignItems="center" gap={2} style={styles.commentMeta}>
          <ThemedText size="sm" weight="semibold" color="textPrimary">
            {item.user.username}
          </ThemedText>
          <ThemedText size="xs" color="textSecondary">
            {formatRelativeTime(item.createdAt)}
          </ThemedText>
        </Box>
        <ThemedText size="sm" color="textSecondary">
          {item.content}
        </ThemedText>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  commentMeta: {
    flexWrap: 'wrap'
  }
})
