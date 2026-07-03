import React, { useCallback, useState } from 'react'
import { Dimensions, FlatList, StyleSheet } from 'react-native'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Avatar, Box, Divider, SwipeableModal, ThemedText, Touchable } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { useNavigateToProfile } from '@src/shared/hooks'

import { ReviewInteractionUser } from '../domain'
import { FeedService } from '../services'

type ReviewInteractionsModalProps = {
  reviewId: string
  onCount: number
  offCount: number
  visible: boolean
  onClose: () => void
}

const MODAL_HEIGHT = Dimensions.get('window').height * 0.6

export const ReviewInteractionsModal: React.FC<ReviewInteractionsModalProps> = ({
  reviewId,
  onCount,
  offCount,
  visible,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'on' | 'off'>('on')
  const navigateToProfile = useNavigateToProfile()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['reviewInteractions', reviewId, activeTab],
    queryFn: ({ pageParam = 1 }) => FeedService.listInteractions(reviewId, activeTab, pageParam).then((r) => r.data),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < 20) return undefined
      return allPages.length + 1
    },
    initialPageParam: 1,
    enabled: visible,
    staleTime: 0,
    gcTime: 0
  })

  const allUsers = data?.pages.flatMap((p) => p) ?? []

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const renderItem = useCallback(
    ({ item }: { item: ReviewInteractionUser }) => (
      <Touchable
        activeOpacity={0.7}
        onPress={() => {
          onClose()
          navigateToProfile(item.id)
        }}
      >
        <Box flexDirection="row" alignItems="center" gap={4} pl={5} pr={5} pt={3} pb={3}>
          <Avatar size="sm" uri={item.image ?? undefined} placeholderIcon="User" />
          <Box flex={1}>
            <ThemedText color="textPrimary" weight="medium" size="lg">
              {item.username}
            </ThemedText>
            <ThemedText color="textSecondary" variant="mono" weight="medium" size="xs" letterSpacing="wider">
              @{item.username}
            </ThemedText>
          </Box>
        </Box>
      </Touchable>
    ),
    [navigateToProfile, onClose]
  )

  return (
    <SwipeableModal visible={visible} onClose={onClose} height={MODAL_HEIGHT}>
      <Box style={styles.tabs}>
        <Touchable style={styles.tab} onPress={() => setActiveTab('on')}>
          <ThemedText
            size="sm"
            weight={activeTab === 'on' ? 'semibold' : 'regular'}
            color={activeTab === 'on' ? 'textPrimary' : 'textSecondary'}
          >
            on {onCount}
          </ThemedText>
          {activeTab === 'on' && <Box style={styles.tabUnderline} />}
        </Touchable>

        <Touchable style={styles.tab} onPress={() => setActiveTab('off')}>
          <ThemedText
            size="sm"
            weight={activeTab === 'off' ? 'semibold' : 'regular'}
            color={activeTab === 'off' ? 'textPrimary' : 'textSecondary'}
          >
            off {offCount}
          </ThemedText>
          {activeTab === 'off' && <Box style={styles.tabUnderline} />}
        </Touchable>
      </Box>

      <FlatList
        data={allUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Divider}
      />
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
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
    paddingBottom: 40
  }
})
