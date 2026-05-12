import React from 'react'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { BlockedUserItem } from '@src/features/social/components/blocked-user-item.component'
import { useBlockActions } from '@src/features/social/hooks/use-block-actions'
import { useBlockedUsers } from '@src/features/social/hooks/use-blocked-users'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Box, ThemedText } from '@src/shared/components'

interface BlockedUsersListProps {
  limit?: number
}

export const BlockedUsersList = ({ limit }: BlockedUsersListProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthenticatedStackParamList>>()
  const { unblockUser } = useBlockActions()
  const { data: blockedUsers, isLoading } = useBlockedUsers()

  if (isLoading) return null

  const total = blockedUsers?.length ?? 0
  const displayed = limit ? (blockedUsers ?? []).slice(0, limit) : (blockedUsers ?? [])
  const hasMore = !!limit && total > limit
  const count = total.toString().padStart(2, '0')

  const openModal = () =>
    navigation.navigate('Modals', { screen: 'BlockedUsersScreen', params: undefined })

  return (
    <Box gap={3}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
          bloqueados
        </ThemedText>
        <ThemedText variant="mono" size="xs" letterSpacing="wider">
          {count}
        </ThemedText>
      </Box>

      {total === 0 ? (
        <ThemedText variant="mono" size="xs" color="textSecondary">
          você ainda não bloqueou ninguém.
        </ThemedText>
      ) : (
        <Box gap={3}>
          {displayed.map((item: ListBlockedUsersResponse) => (
            <BlockedUserItem key={item.id} item={item} onUnblock={unblockUser} />
          ))}
        </Box>
      )}

      {hasMore && (
        <Pressable onPress={openModal}>
          <ThemedText variant="mono" size="xs" color="textSecondary">
            ver todos ({count})
          </ThemedText>
        </Pressable>
      )}
    </Box>
  )
}
