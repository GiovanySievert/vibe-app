import React, { useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'

import { UserFavoritesPlacesCards } from '@src/features/user-favorites-places/components'
import { FollowRequestType } from '@src/features/users-profile/types'
import { Box, Divider, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'

import {
  BlockedUsersList,
  CreateEventModal,
  EventInvitationsList,
  FollowRequestsList,
  MyEventsList
} from '../components'

export const SocialScreen = () => {
  const [isCreateEventVisible, setIsCreateEventVisible] = useState(false)

  return (
    <>
      <ScrollView style={styles.scroll}>
        <Screen>
          <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" justifyContent="space-between" alignItems="center">
            <ThemedText variant="subtitle">Social</ThemedText>
            <TouchableOpacity onPress={() => setIsCreateEventVisible(true)} style={styles.createEventButton}>
              <ThemedIcon name="CalendarPlus" size={18} color="primary" />
              <ThemedText size="sm" color="primary" weight="semibold">
                Crie seu evento
              </ThemedText>
            </TouchableOpacity>
          </Box>
          <Box gap={5}>
            <MyEventsList />
            <UserFavoritesPlacesCards />
            <Box pr={5} pl={5}>
              <Divider />
            </Box>
            <EventInvitationsList />
            <FollowRequestsList type={FollowRequestType.RECEIVED} limit={3} />
            <FollowRequestsList type={FollowRequestType.SENT} limit={3} />
            <BlockedUsersList limit={3} />
          </Box>
        </Screen>
      </ScrollView>

      <CreateEventModal visible={isCreateEventVisible} onClose={() => setIsCreateEventVisible(false)} />
    </>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary
  }
})
