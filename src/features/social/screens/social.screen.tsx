import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { UserFavoritesPlacesCards } from '@src/features/user-favorites-places/components'
import { FollowRequestType } from '@src/features/users-profile/types'
import { Box, Button, ThemedText } from '@src/shared/components'
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
            <Box>
              <ThemedText variant="title">social</ThemedText>
              <ThemedText variant="mono">amigos · eventos ·</ThemedText>
              <ThemedText variant="mono">favoritos</ThemedText>
            </Box>
            <Box>
              <Button onPress={() => setIsCreateEventVisible(true)} style={styles.createEventButton}>
                <Box flexDirection="row" gap={2} alignItems="center">
                  <ThemedIcon name="CalendarPlus" size={18} color="background" />
                  <ThemedText size="sm" color="background" weight="semibold">
                    Criar evento
                  </ThemedText>
                </Box>
              </Button>
            </Box>
          </Box>
          <Box gap={5}>
            <UserFavoritesPlacesCards />
            <MyEventsList />
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
