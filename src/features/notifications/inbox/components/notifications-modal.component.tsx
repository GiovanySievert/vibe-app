import React, { useMemo } from 'react'
import { ActivityIndicator, FlatList, Linking, StyleSheet, TouchableOpacity, View } from 'react-native'

import { BellOff } from 'lucide-react-native'

import { Box, SwipeableModal, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { useMarkAllAsRead, useMarkAsRead } from '../hooks/use-mark-as-read.hook'
import { useNotifications } from '../hooks/use-notifications.hook'
import { NotificationItem } from '../services/notification-inbox.service'
import { NotificationItemRow } from './notification-item.component'
import { NotificationSkeleton } from './notification-skeleton.component'

type Props = {
  visible: boolean
  onClose: () => void
}

export const NotificationsModal: React.FC<Props> = ({ visible, onClose }) => {
  const {
    data,
    isLoading,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useNotifications({ enabled: visible })
  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()

  const items = useMemo<NotificationItem[]>(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data]
  )
  const hasUnread = items.some((item) => item.readAt === null)
  const isInitialLoading = isLoading && items.length === 0

  const handlePress = async (item: NotificationItem) => {
    if (item.readAt === null) {
      markAsRead.mutate(item.id)
    }
    onClose()
    const url = typeof item.data?.url === 'string' ? item.data.url : null
    if (url) {
      await Linking.openURL(url)
    }
  }

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <SwipeableModal visible={visible} onClose={onClose} height={600}>
      <Box pl={5} pr={5} pb={3} flexDirection="row" alignItems="center" justifyContent="space-between">
        <ThemedText variant="title" size="lg">
          Notificacoes
        </ThemedText>
        <TouchableOpacity
          onPress={() => markAllAsRead.mutate()}
          disabled={!hasUnread || markAllAsRead.isPending}
        >
          <ThemedText size="sm" color={hasUnread ? 'primary' : 'textSecondary'}>
            Marcar todas
          </ThemedText>
        </TouchableOpacity>
      </Box>

      {isInitialLoading ? (
        <NotificationSkeleton />
      ) : items.length === 0 ? (
        <Box flex={1} alignItems="center" justifyContent="center" pl={5} pr={5} gap={3}>
          <Box style={styles.emptyIconWrap}>
            <BellOff size={32} color={theme.colors.textSecondary} strokeWidth={1.5} />
          </Box>
          <ThemedText weight="semibold">Tudo em dia por aqui</ThemedText>
          <ThemedText size="sm" color="textSecondary" style={styles.emptyDescription}>
            Quando alguem te convidar pra um evento ou pedir pra te seguir, voce vai ver aqui.
          </ThemedText>
        </Box>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={isFetching && !isFetchingNextPage}
          onRefresh={refetch}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          renderItem={({ item, index }) => (
            <NotificationItemRow
              item={item}
              isLast={index === items.length - 1}
              onPress={() => handlePress(item)}
            />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={
            isFetchingNextPage ? (
              <Box pt={4} pb={4} alignItems="center">
                <ActivityIndicator color={theme.colors.primary} />
              </Box>
            ) : null
          }
        />
      )}
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24
  },
  separator: {
    height: 0
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: theme.colors.border
  },
  emptyDescription: {
    textAlign: 'center'
  }
})
