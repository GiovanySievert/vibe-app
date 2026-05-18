import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Button, Card, Divider, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { formatShortEventDateTime, triggerLightHaptic } from '@src/shared/utils'

import { EventParticipantStatus } from '../domain/event.model'
import { EventResponse, EventService } from '../services/event.service'

type Nav = NativeStackNavigationProp<AuthenticatedStackParamList>

const EventInvitationItem = ({ item, currentUserId }: { item: EventResponse; currentUserId?: string }) => {
  const { t } = useAppTranslation()
  const navigation = useNavigation<Nav>()
  const queryClient = useQueryClient()

  const invitationStatus =
    item.participants.find((participant) => participant.userId === currentUserId)?.status ??
    EventParticipantStatus.PENDING

  const respond = useMutation({
    mutationFn: (status: EventParticipantStatus.ACCEPTED | EventParticipantStatus.DECLINED) =>
      EventService.respondToInvitation(item.id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['eventInvitations'] })
  })

  const handleRespond = (status: EventParticipantStatus.ACCEPTED | EventParticipantStatus.DECLINED) => {
    triggerLightHaptic()
    respond.mutate(status)
  }

  return (
    <Card pr={4} pl={4} pt={4} pb={4} gap={3}>
      <Touchable onPress={() => navigation.navigate('SharedEventScreen', { token: item.id })} activeOpacity={0.7}>
        <Box gap={1}>
          <ThemedText weight="bold" size="md">
            {item.name}
          </ThemedText>
          <ThemedText variant="mono" size="xs">
            {formatShortEventDateTime(item.date, item.time)}
          </ThemedText>
        </Box>
      </Touchable>

      {item.participants.length > 0 && (
        <Box flexDirection="row" alignItems="center" gap={2}>
          <Box flexDirection="row">
            {item.participants.slice(0, 3).map((p, i) => (
              <Box key={p.id} style={[styles.avatarWrapper, { marginLeft: i > 0 ? -8 : 0 }]}>
                <Avatar size="xs" uri={p.avatar} />
              </Box>
            ))}
          </Box>
          <ThemedText variant="mono" size="xs">
            {t('social.eventInvitations.people', {
              count: item.participants.length
            })}
          </ThemedText>
        </Box>
      )}

      <Divider />

      {invitationStatus === EventParticipantStatus.ACCEPTED && (
        <Box flexDirection="row" alignItems="center" gap={2}>
          <ThemedIcon name="CircleCheck" size={18} color="primary" />
          <ThemedText color="primary" weight="semibold">
            {t('social.eventInvitations.accepted')}
          </ThemedText>
        </Box>
      )}

      {invitationStatus === EventParticipantStatus.DECLINED && (
        <Box flexDirection="row" alignItems="center" gap={2}>
          <ThemedIcon name="CircleX" size={18} color="error" />
          <ThemedText color="error" weight="semibold">
            {t('social.eventInvitations.declined')}
          </ThemedText>
        </Box>
      )}

      {invitationStatus === EventParticipantStatus.PENDING && (
        <Box flexDirection="row" gap={3}>
          <Button
            flex={1}
            size="sm"
            loading={respond.isPending}
            onPress={() => handleRespond(EventParticipantStatus.ACCEPTED)}
          >
            <ThemedText color="background" weight="bold">
              {t('social.eventInvitations.yesBtn')}
            </ThemedText>
          </Button>
          <Button
            flex={1}
            size="sm"
            variant="outline"
            type="secondary"
            loading={respond.isPending}
            onPress={() => handleRespond(EventParticipantStatus.DECLINED)}
          >
            <ThemedText color="textPrimary" weight="bold">
              {t('social.eventInvitations.noBtn')}
            </ThemedText>
          </Button>
        </Box>
      )}
    </Card>
  )
}

export const EventInvitationsList = () => {
  const { t } = useAppTranslation()
  const { data: session } = authClient.useSession()
  const { data: invitations } = useQuery({
    queryKey: ['eventInvitations'],
    queryFn: async () => {
      const { data } = await EventService.listInvitations()
      return data
    }
  })

  if (!invitations?.length) return null

  const count = invitations.length.toString().padStart(2, '0')

  return (
    <Box mr={5} ml={5} gap={3}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <ThemedText variant="mono" size="xs" textTransform="uppercase" letterSpacing="wider">
          {t('social.eventInvitations.label')}
        </ThemedText>
        <ThemedText variant="mono" size="xs" letterSpacing="wider">
          {count}
        </ThemedText>
      </Box>

      <Box gap={3}>
        {invitations.map((item) => (
          <EventInvitationItem key={item.id} item={item} currentUserId={session?.user.id} />
        ))}
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  avatarWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.backgroundSecondary,
    borderRadius: 999
  }
})
