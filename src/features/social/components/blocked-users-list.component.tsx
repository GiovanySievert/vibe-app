import React from 'react'
import { FlatList } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { SocialStackParamList } from '@src/app/navigation/types'
import { ListBlockedUsersResponse } from '@src/features/users-profile/types'
import { Box, Button, ThemedText } from '@src/shared/components'

import { useBlockActions } from '../hooks/use-block-actions'
import { useBlockedUsers } from '../hooks/use-blocked-users'
import { BlockedUserItem } from './blocked-user-item.component'

interface BlockedUsersListProps {
  limit?: number
}

export const BlockedUsersList = ({ limit }: BlockedUsersListProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<SocialStackParamList>>()
  const { unblockUser } = useBlockActions()
  const { data: blockedUsersData, isLoading } = useBlockedUsers()

  if (!blockedUsersData?.length || isLoading) {
    return
  }

  const displayedUsers = limit ? blockedUsersData.slice(0, limit) : blockedUsersData
  const hasMore = limit && blockedUsersData.length > limit

  const handleSeeMore = () => {
    navigation.navigate('BlockedUsersScreen')
  }

  const renderItem = ({ item, index }: { item: ListBlockedUsersResponse; index: number }) => (
    <BlockedUserItem item={item} index={index} totalItems={displayedUsers.length} onUnblock={unblockUser} />
  )

  const renderFooter = () => {
    if (!hasMore) return null

    return (
      <Box mt={3}>
        <Button onPress={handleSeeMore} type="secondary">
          <ThemedText variant="primary" weight="medium" size="lg">
            Ver mais
          </ThemedText>
        </Button>
      </Box>
    )
  }

  return (
    <Box mr={5} ml={5} gap={3}>
      <ThemedText>Usuários Bloqueados</ThemedText>
      <FlatList
        data={displayedUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ListFooterComponent={renderFooter}
      />
    </Box>
  )
}
