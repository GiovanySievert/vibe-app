import React, { useCallback, useRef, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Box, Input, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

import { UsersProfileFollowListItem } from '../components/user-follow-list/users-profile-follow-list-item.component'
import { FollowStatsService } from '../services'
import { FollowService } from '../services/follow.service'
import { ListFollowersResponse } from '../types'

type Props = NativeStackScreenProps<ModalNavigatorParamsList, 'FollowListScreen'>

export const FollowListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { userId, username, initialTab } = route.params
  const { data: session } = authClient.useSession()
  const isUserLoggedProfile = session?.user.id === userId

  const [activeTab, setActiveTab] = useState<'followers' | 'followings'>(initialTab)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => setDebouncedQuery(value), 400)
  }

  const { data: statsData } = useQuery({
    queryKey: ['fetchFollowersStats', userId],
    queryFn: async () => (await FollowStatsService.fetchUsersFollowStats(userId)).data,
    staleTime: 0
  })

  const isSearching = debouncedQuery.trim().length > 0

  const fetchList = async ({ pageParam = 1 }) => {
    if (isSearching) {
      const res =
        activeTab === 'followers'
          ? await FollowService.searchFollowers(userId, debouncedQuery, pageParam)
          : await FollowService.searchFollowings(userId, debouncedQuery, pageParam)
      return res.data
    }
    const res =
      activeTab === 'followers'
        ? await FollowService.listFollowers(userId, pageParam)
        : await FollowService.listFollowings(userId, pageParam)
    return res.data
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['followList', userId, activeTab, debouncedQuery],
    queryFn: fetchList,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 20) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
    staleTime: 0
  })

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const allData = data?.pages.flatMap((page) => page) ?? []

  const renderItem = useCallback(
    ({ item }: { item: ListFollowersResponse }) => (
      <UsersProfileFollowListItem
        followRelation={item}
        type={activeTab}
        isUserLoggedProfile={isUserLoggedProfile}
      />
    ),
    [activeTab, isUserLoggedProfile]
  )

  return (
    <Screen>
      <Box style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ThemedIcon name="ArrowLeft" size={22} color="textPrimary" />
        </TouchableOpacity>
        <ThemedText weight="semibold" size="md" color="textPrimary">
          @{username}
        </ThemedText>
        <Box style={styles.headerSpacer} />
      </Box>

      <Box style={styles.tabs}>
        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('followers')}>
          <ThemedText
            weight={activeTab === 'followers' ? 'semibold' : 'regular'}
            color={activeTab === 'followers' ? 'textPrimary' : 'textSecondary'}
            size="sm"
          >
            seguidores {statsData?.followersCount ?? 0}
          </ThemedText>
          {activeTab === 'followers' && <Box style={styles.tabUnderline} />}
        </TouchableOpacity>

        <TouchableOpacity style={styles.tab} onPress={() => setActiveTab('followings')}>
          <ThemedText
            weight={activeTab === 'followings' ? 'semibold' : 'regular'}
            color={activeTab === 'followings' ? 'textPrimary' : 'textSecondary'}
            size="sm"
          >
            seguindo {statsData?.followingCount ?? 0}
          </ThemedText>
          {activeTab === 'followings' && <Box style={styles.tabUnderline} />}
        </TouchableOpacity>
      </Box>

      <Box pl={5} pr={5} pt={3} pb={2}>
        <Input
          placeholder="buscar"
          startIconName="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          isClearable
          onClear={() => handleSearch('')}
        />
      </Box>

      {!isLoading && (
        <FlatList
          data={allData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14
  },
  headerSpacer: {
    width: 22
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.textPrimary
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40
  }
})
