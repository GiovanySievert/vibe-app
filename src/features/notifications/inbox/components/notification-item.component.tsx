import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Bell, CalendarPlus, UserPlus } from 'lucide-react-native'

import { Box, Divider, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { NotificationItem as NotificationItemModel } from '../services/notification-inbox.service'

const formatRelative = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(iso).toLocaleDateString('pt-BR')
}

const iconForType = (type: string) => {
  if (type === 'event_invitation') return CalendarPlus
  if (type === 'follow_request_created') return UserPlus
  return Bell
}

type Props = {
  item: NotificationItemModel
  isLast: boolean
  onPress: () => void
}

export const NotificationItemRow: React.FC<Props> = ({ item, isLast, onPress }) => {
  const Icon = iconForType(item.type)
  const isUnread = item.readAt === null

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Box flexDirection="row" gap={3} pt={3} pb={3} alignItems="flex-start">
        <Box style={[styles.iconWrap, isUnread && styles.iconWrapUnread]}>
          <Icon
            size={18}
            color={isUnread ? theme.colors.primary : theme.colors.textSecondary}
            strokeWidth={1.8}
          />
        </Box>
        <Box flex={1} gap={1}>
          <ThemedText weight={isUnread ? 'semibold' : 'regular'}>{item.title}</ThemedText>
          <ThemedText size="sm" color="textSecondary">
            {item.body}
          </ThemedText>
          <ThemedText size="xs" color="textSecondary">
            {formatRelative(item.createdAt)}
          </ThemedText>
        </Box>
        {isUnread && <Box style={styles.unreadDot} />}
      </Box>
      {!isLast && <Divider />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 0.5,
    borderColor: theme.colors.border
  },
  iconWrapUnread: {
    borderColor: theme.colors.primary
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 8
  }
})
