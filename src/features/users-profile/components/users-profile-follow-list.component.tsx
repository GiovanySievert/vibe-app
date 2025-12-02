import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Avatar, Box, Button, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'

import { FollowService } from '../services'
import { UsersProfileFollowListLoading } from './users-profile-follow-list-loading.component'

type UsersProfileFollowListProps = {
  userId: string
  type: 'followers' | 'followings'
  visible: boolean
  onClose: () => void
}

export const UsersProfileFollowList: React.FC<UsersProfileFollowListProps> = ({ userId, type, visible, onClose }) => {
  const navigation = useNavigation<any>()

  const fetchFollowList = async ({ pageParam = 1 }) => {
    const response =
      type === 'followers'
        ? await FollowService.listFollowers(userId, pageParam, 5)
        : await FollowService.listFollowings(userId, pageParam, 5)

    return response.data || []
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['followList', userId, type],
    queryFn: fetchFollowList,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage) return undefined
      return lastPage.length === 5 ? allPages.length + 1 : undefined
    },
    initialPageParam: 1,
    retry: false,
    staleTime: 0,
    enabled: visible
  })

  const handlePressUser = (userItemId: string) => {
    onClose()
    navigation.navigate('UsersProfileScreen', { userId: userItemId })
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <UsersProfileFollowListLoading />
    }

    const allData = data?.pages.flatMap((page) => page) ?? []

    if (allData.length === 0) {
      return (
        <Box alignItems="center" justifyContent="center" p={4}>
          <ThemedText variant="secondary">
            {type === 'followers' ? 'Nenhum seguidor ainda' : 'Não está seguindo ninguém'}
          </ThemedText>
        </Box>
      )
    }

    return (
      <FlatList
        data={allData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.userItem} onPress={() => handlePressUser(item.id)}>
            <Box flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box flexDirection="row" alignItems="center" gap={5}>
                <Avatar size="sm" />
                <ThemedText variant="primary" weight="semibold">
                  {item.username}
                </ThemedText>
              </Box>
              {type === 'followers' ? (
                <Button variant="soft" type="danger">
                  <ThemedText variant="primary" weight="medium">
                    Remover
                  </ThemedText>
                </Button>
              ) : (
                <Button variant="soft">
                  <ThemedText variant="primary" weight="medium">
                    Seguindo
                  </ThemedText>
                </Button>
              )}
            </Box>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        style={styles.flatList}
        ListFooterComponent={
          hasNextPage ? (
            <Box mt={4} mb={4}>
              <Button variant="soft" onPress={handleLoadMore} loading={isFetchingNextPage}>
                <ThemedText variant="primary" weight="medium" size="md">
                  Carregar mais
                </ThemedText>
              </Button>
            </Box>
          ) : null
        }
      />
    )
  }

  return (
    <SwipeableModal visible={visible} height={530} onClose={onClose}>
      <Box style={styles.container}>
        <ThemedText variant="primary" weight="bold" size="xl" style={styles.title}>
          {type === 'followers' ? 'Seguidores' : 'Seguindo'}
        </ThemedText>
        {renderContent()}
      </Box>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    padding: 20
  },
  flatList: {
    flex: 1
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  userItem: {
    paddingVertical: 12
  }
})
