import React from 'react'
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

import { useQuery } from '@tanstack/react-query'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Card, Divider, ThemedText } from '@src/shared/components'
import { theme } from '@src/shared/constants/theme'
import { formatEventDateTime } from '@src/shared/utils'

import { EventParticipantStatus } from '../domain/event.model'
import { EventResponse, EventService } from '../services/event.service'

type Nav = NativeStackNavigationProp<AuthenticatedStackParamList>

const STATUS_META: Record<
  EventParticipantStatus,
  { label: string; color: keyof typeof theme.colors; backgroundColor: string; borderColor: string }
> = {
  [EventParticipantStatus.PENDING]: {
    label: 'Pendente',
    color: 'primary',
    backgroundColor: theme.colors.primaryGlow,
    borderColor: theme.colors.primary
  },
  [EventParticipantStatus.ACCEPTED]: {
    label: 'Confirmado',
    color: 'success',
    backgroundColor: theme.colors.backgroundSecondary,
    borderColor: theme.colors.success
  },
  [EventParticipantStatus.DECLINED]: {
    label: 'Recusado',
    color: 'error',
    backgroundColor: theme.colors.backgroundSecondary,
    borderColor: theme.colors.error
  }
}

const EventInvitationItem = ({
  item,
  index,
  total,
  currentUserId
}: {
  item: EventResponse
  index: number
  total: number
  currentUserId?: string
}) => {
  const navigation = useNavigation<Nav>()
  const invitationStatus =
    item.participants.find((participant) => participant.userId === currentUserId)?.status ??
    EventParticipantStatus.PENDING
  const statusMeta = STATUS_META[invitationStatus]

  return (
    <TouchableOpacity onPress={() => navigation.navigate('SharedEventScreen', { token: item.id })} activeOpacity={0.7}>
      <Box>
        <Box flexDirection="row" alignItems="center" gap={3} mb={2}>
          <Box flex={1}>
            <ThemedText weight="semibold">{item.name}</ThemedText>
            <ThemedText size="sm" color="textSecondary">
              {formatEventDateTime(item.date, item.time)}
            </ThemedText>
          </Box>
        </Box>

        {item.participants.length > 0 && (
          <Box flexDirection="row" alignItems="center" gap={2}>
            <Box flexDirection="row">
              {item.participants.slice(0, 3).map((p, i) => (
                <Box key={p.id} style={[styles.avatarWrapper, { marginLeft: i > 0 ? -8 : 0 }]}>
                  <Avatar size="xs" uri={p.avatar} />
                </Box>
              ))}
            </Box>
            <ThemedText size="xs" color="textSecondary">
              {item.participants.length} participante{item.participants.length !== 1 ? 's' : ''}
            </ThemedText>
          </Box>
        )}

        <Box
          style={[
            styles.badge,
            {
              backgroundColor: statusMeta.backgroundColor,
              borderColor: statusMeta.borderColor
            }
          ]}
          alignItems="center"
          justifyContent="center"
          mt={3}
        >
          <ThemedText size="xs" color={statusMeta.color} weight="semibold">
            {statusMeta.label}
          </ThemedText>
        </Box>

        {index !== total - 1 && (
          <Box mt={4}>
            <Divider />
          </Box>
        )}
      </Box>
    </TouchableOpacity>
  )
}

export const EventInvitationsList = () => {
  const { data: session } = authClient.useSession()
  const { data: invitations } = useQuery({
    queryKey: ['eventInvitations'],
    queryFn: async () => {
      const { data } = await EventService.listInvitations()
      return data
    }
  })

  if (!invitations?.length) return null

  const visible = invitations

  return (
    <Box mr={5} ml={5} gap={3}>
      <ThemedText weight="semibold">Eventos convidados</ThemedText>
      <Card pr={5} pl={5} pt={5} pb={5}>
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <EventInvitationItem item={item} index={index} total={visible.length} currentUserId={session?.user.id} />
          )}
        />
      </Card>
    </Box>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryGlow,
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  avatarWrapper: {
    borderWidth: 2,
    borderColor: theme.colors.background,
    borderRadius: 999
  }
})
