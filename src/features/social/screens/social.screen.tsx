import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { NotificationBell } from '@src/features/notifications/inbox'
import { UserFavoritesPlacesCards } from '@src/features/user-favorites-places/components'
import { FollowRequestType } from '@src/features/users-profile/types'
import { Box, Button, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'

import { EventInvitationsList, FollowRequestsList, MyEventsList } from '../components'

export const SocialScreen = () => {
  const { t } = useAppTranslation()
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()

  const handleCreateEvent = () => {
    navigation.navigate('Modals', {
      screen: 'CreateEventScreen'
    })
  }

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box pr={5} pl={5} mt={5} mb={5} flexDirection="row" justifyContent="space-between" alignItems="center">
          <Box>
            <ThemedText variant="title">{t('social.title')}</ThemedText>
            <ThemedText variant="mono">{t('social.subtitle')}</ThemedText>
          </Box>
          <Box flexDirection="row" alignItems="center" gap={2}>
            <NotificationBell />
          </Box>
        </Box>
        <Box gap={5}>
          <UserFavoritesPlacesCards />
          <MyEventsList />
          <EventInvitationsList />
          <FollowRequestsList type={FollowRequestType.RECEIVED} limit={1} />
          <FollowRequestsList type={FollowRequestType.SENT} limit={1} />
          <Button onPress={handleCreateEvent} style={styles.createEventButton}>
            <Box flexDirection="row" gap={2} alignItems="center">
              <ThemedIcon name="CalendarPlus" size={18} color="background" />
              <ThemedText size="sm" color="background" weight="semibold">
                {t('social.createEventBtn')}
              </ThemedText>
            </Box>
          </Button>
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: theme.colors.background },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    marginHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary
  }
})
