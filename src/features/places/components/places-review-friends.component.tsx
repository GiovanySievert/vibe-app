import React, { useCallback, useState } from 'react'
import { Dimensions, FlatList, StyleSheet } from 'react-native'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Avatar, Box, SwipeableModal, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useNavigateToProfile } from '@src/shared/hooks'

import { usePlaceReviewFriends } from '../hooks/use-place-reviews.hook'
import { PlaceReviewFriend, PlaceReviewService } from '../services/place-review.service'

type PlacesReviewFriendsProps = {
  placeId: string
}

const MODAL_HEIGHT = Dimensions.get('window').height * 0.62

const formatNames = (friends: PlaceReviewFriend[]) => {
  const names = friends.slice(0, 3).map((friend) => friend.name || friend.username)
  if (names.length === 1) return names[0]
  if (names.length === 2) return `${names[0]} e ${names[1]}`
  return `${names[0]}, ${names[1]} e ${names[2]}`
}

export const PlacesReviewFriends: React.FC<PlacesReviewFriendsProps> = ({ placeId }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { data, isLoading, isError } = usePlaceReviewFriends(placeId)
  const navigateToProfile = useNavigateToProfile()

  const {
    data: modalData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['placeReviewFriendsModal', placeId],
    queryFn: ({ pageParam = 1 }) => PlaceReviewService.listFriendsByPlace(placeId, pageParam, 20).then((r) => r.data),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: modalVisible,
    staleTime: 5 * 60 * 1000
  })

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const handlePressFriend = useCallback(
    (userId: string) => {
      setModalVisible(false)
      navigateToProfile(userId)
    },
    [navigateToProfile]
  )

  const renderItem = useCallback(
    ({ item }: { item: PlaceReviewFriend }) => (
      <Touchable
        activeOpacity={0.7}
        onPress={() => handlePressFriend(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`Abrir perfil de ${item.username}`}
      >
        <Box flexDirection="row" alignItems="center" gap={3} pl={6} pr={6} pt={3} pb={3}>
          <Avatar size="sm" uri={item.image} fallbackLetter={item.name || item.username} />
          <Box flex={1} gap={1}>
            <ThemedText size="sm" weight="semibold" color="textPrimary" numberOfLines={1}>
              {item.name || item.username}
            </ThemedText>
            <ThemedText variant="mono" size="xs" color="textSecondary" numberOfLines={1}>
              @{item.username}
            </ThemedText>
          </Box>
        </Box>
      </Touchable>
    ),
    [handlePressFriend]
  )

  if (isLoading || isError || !data || data.total === 0) return null

  const previewFriends = data.data.slice(0, 3)
  const modalFriends = modalData?.pages.flatMap((page) => page.data) ?? []

  return (
    <>
      <Box pl={6} pr={6} pt={5} pb={5} style={styles.section}>
        <ThemedText variant="mono" size="sm" textTransform="uppercase">
          amigos que vieram nos últimos 90d
        </ThemedText>

        <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={4} mt={3}>
          <Box flexDirection="row" alignItems="center" flexShrink={1}>
            <Box flexDirection="row" alignItems="center" mr={3}>
              {previewFriends.map((friend, index) => (
                <Box key={friend.id} style={index > 0 ? styles.avatarOverlap : null}>
                  <Avatar size="xs" uri={friend.image} fallbackLetter={friend.username} />
                </Box>
              ))}
            </Box>
            <ThemedText color="textSecondary" weight="medium" numberOfLines={1} style={styles.names}>
              {formatNames(previewFriends)}
            </ThemedText>
          </Box>

          {data.total > 1 ? (
            <Touchable
              activeOpacity={0.7}
              onPress={() => setModalVisible(true)}
              accessibilityRole="button"
              accessibilityLabel={`Ver todos ${data.total} amigos que vieram`}
            >
              <ThemedText color="textPrimary" weight="semibold">
                ver todos {data.total}
              </ThemedText>
            </Touchable>
          ) : null}
        </Box>
      </Box>

      <SwipeableModal visible={modalVisible} onClose={() => setModalVisible(false)} height={MODAL_HEIGHT}>
        <Box pl={6} pr={6} pt={2} pb={3} style={styles.modalHeader}>
          <ThemedText variant="mono" size="sm" textTransform="uppercase">
            amigos que vieram
          </ThemedText>
        </Box>
        <FlatList
          data={modalFriends}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          contentContainerStyle={styles.listContent}
        />
      </SwipeableModal>
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 8
  },
  avatarOverlap: {
    marginLeft: -8
  },
  names: {
    flexShrink: 1
  },
  modalHeader: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border
  },
  listContent: {
    paddingBottom: 40
  }
})
