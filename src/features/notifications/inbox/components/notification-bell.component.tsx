import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

import { Bell } from 'lucide-react-native'

import { Box, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'

import { useUnreadCount } from '../hooks/use-unread-count.hook'
import { NotificationsModal } from './notifications-modal.component'

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false)
  const { data } = useUnreadCount()
  const count = data?.count ?? 0

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.button} activeOpacity={0.7}>
        <Bell size={20} color={theme.colors.textPrimary} strokeWidth={1.5} />
        {count > 0 && (
          <Box style={styles.badge}>
            <ThemedText size="xs" color="background" weight="semibold">
              {count > 99 ? '99+' : count}
            </ThemedText>
          </Box>
        )}
      </TouchableOpacity>

      <NotificationsModal visible={open} onClose={() => setOpen(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: theme.colors.border
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4
  }
})
