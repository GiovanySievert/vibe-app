import React, { useCallback } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Box, Button, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'

import { FollowService } from '../../services'
import { ListFollowersResponse } from '../../types'
import { UsersProfileFollowListItem } from './users-profile-follow-list-item.component'
import { UsersProfileFollowListLoading } from './users-profile-follow-list-loading.component'

type UsersProfileFollowListProps = {
  userId: string
  type: 'followers' | 'followings'
  visible: boolean
  isUserLoggedProfile: boolean
  onClose: () => void
}

export const UsersProfileFollowList: React.FC<UsersProfileFollowListProps> = ({
  userId,
  type,
  visible,
  onClose,
  isUserLoggedProfile
}) => {
  const fetchFollowList = async ({ pageParam = 1 }) => {
    const response =
      type === 'followers'
        ? await FollowService.listFollowers(userId, pageParam, 5)
        : await FollowService.listFollowings(userId, pageParam, 5)
    return response.data
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

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderItem = useCallback(
    ({ item }: { item: ListFollowersResponse }) => (
      <UsersProfileFollowListItem
        followRelation={item}
        type={type}
        onClose={onClose}
        isUserLoggedProfile={isUserLoggedProfile}
      />
    ),
    [type, onClose, isUserLoggedProfile]
  )

  const renderContent = () => {
    if (isLoading) {
      return <UsersProfileFollowListLoading />
    }

    const allData = data?.pages.flatMap((page) => page) ?? []

    return (
      <FlatList
        data={allData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
