import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Button, Card, Divider, LoadingPage, ThemedText } from '@src/shared/components'
import { Screen } from '@src/shared/components/screen'
import { theme } from '@src/shared/constants/theme'
import { formatEventDateTime } from '@src/shared/utils'

import { EventCommentsSection } from '../components/event-comments-section.component'
import { EventParticipantStatus } from '../domain/event.model'
import { EventService } from '../services/event.service'

type SharedEventScreenProps = NativeStackScreenProps<AuthenticatedStackParamList, 'SharedEventScreen'>

const STATUS_LABEL: Record<EventParticipantStatus, string> = {
  [EventParticipantStatus.PENDING]: 'Pendente',
  [EventParticipantStatus.ACCEPTED]: 'Presenca confirmada',
  [EventParticipantStatus.DECLINED]: 'Convite recusado'
}

export const SharedEventScreen: React.FC<SharedEventScreenProps> = ({ route }) => {
  const { token } = route.params
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  const { data: event, isLoading, isError, refetch } = useQuery({
    queryKey: ['sharedEvent', token],
    queryFn: async () => {
      const { data } = await EventService.getById(token)
      return data
    },
    enabled: !!session?.user.id,
    retry: false
  })

  const currentUserId = session?.user.id
  const participant = event?.participants.find((item) => item.userId === currentUserId)
  const isOwner = event?.ownerId === currentUserId
  const canAccessEvent = !!event && (isOwner || !!participant)

  const respondToInvitationMutation = useMutation({
    mutationFn: (status: EventParticipantStatus.ACCEPTED | EventParticipantStatus.DECLINED) =>
      EventService.respondToInvitation(token, status),
    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: ['sharedEvent', token] })
      const previous = queryClient.getQueryData(['sharedEvent', token])

      queryClient.setQueryData(['sharedEvent', token], (old: typeof event) => {
        if (!old) return old
        return {
          ...old,
          participants: old.participants.map((p) =>
            p.userId === currentUserId ? { ...p, status } : p
          )
        }
      })

      return { previous }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['eventInvitations'] }),
        queryClient.invalidateQueries({ queryKey: ['myEvents'] })
      ])
      showToast('Resposta enviada com sucesso.')
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['sharedEvent', token], context.previous)
      }
      showToast('Não foi possível responder ao convite.', 'error')
    }
  })

  if (isLoading || !session?.user.id) {
    return (
      <Screen>
        <Box mt={6} ml={5} mr={5}>
          <LoadingPage />
        </Box>
      </Screen>
    )
  }

  if (isError || !event) {
    return (
      <Screen>
        <Box flex={1} justifyContent="center" alignItems="center" ml={5} mr={5} gap={4}>
          <ThemedText weight="semibold" size="lg">
            Não foi possível abrir este evento.
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.centerText}>
            Verifique se o link ainda é válido e tente novamente.
          </ThemedText>
          <Button onPress={() => refetch()}>
            <ThemedText color="background" weight="semibold">
              Tentar novamente
            </ThemedText>
          </Button>
        </Box>
      </Screen>
    )
  }

  if (!canAccessEvent) {
    return (
      <Screen>
        <Box flex={1} justifyContent="center" alignItems="center" ml={5} mr={5} gap={4}>
          <ThemedText weight="semibold" size="lg">
            Você não tem permissão para acessar este evento.
          </ThemedText>
          <ThemedText color="textSecondary" style={styles.centerText}>
            Esse convite está disponível apenas para participantes autenticados.
          </ThemedText>
        </Box>
      </Screen>
    )
  }

  return (
    <ScrollView style={styles.scroll}>
      <Screen>
        <Box mr={5} ml={5} mt={5} mb={5} gap={4}>
          <Box gap={1}>
            <ThemedText variant="subtitle">{event.name}</ThemedText>
            <ThemedText color="textSecondary">{formatEventDateTime(event.date, event.time)}</ThemedText>
          </Box>

          <Card gap={4}>
            {event.description ? (
              <Box gap={1}>
                <ThemedText size="sm" color="textSecondary" weight="semibold">
                  Descrição
                </ThemedText>
                <ThemedText>{event.description}</ThemedText>
              </Box>
            ) : null}

            <Divider />

            <Box gap={2}>
              <ThemedText size="sm" color="textSecondary" weight="semibold">
                Participantes ({event.participants.length})
              </ThemedText>

              {event.participants.map((item) => (
                <Box key={item.id} flexDirection="row" alignItems="center" justifyContent="space-between" gap={3}>
                  <Box flexDirection="row" alignItems="center" gap={3} flex={1}>
                    <Avatar size="sm" uri={item.avatar} />
                    <ThemedText>{item.username}</ThemedText>
                  </Box>
                  <ThemedText size="xs" color="textSecondary">
                    {STATUS_LABEL[item.status]}
                  </ThemedText>
                </Box>
              ))}
            </Box>
          </Card>

          {isOwner ? (
            <Card gap={2}>
              <ThemedText weight="semibold">Você criou este evento.</ThemedText>
              <ThemedText color="textSecondary">
                Os participantes podem abrir este link no app para responder ao convite.
              </ThemedText>
            </Card>
          ) : participant ? (
            <Card gap={3}>
              <ThemedText weight="semibold">Sua resposta</ThemedText>
              <ThemedText color="textSecondary">{STATUS_LABEL[participant.status]}</ThemedText>

              {participant.status === EventParticipantStatus.PENDING ? (
                <Box gap={3}>
                  <Button
                    onPress={() => respondToInvitationMutation.mutate(EventParticipantStatus.ACCEPTED)}
                  >
                    <ThemedText color="background" weight="semibold">
                      Confirmar presença
                    </ThemedText>
                  </Button>

                  <Button
                    variant="outline"
                    onPress={() => respondToInvitationMutation.mutate(EventParticipantStatus.DECLINED)}
                  >
                    <ThemedText color="primary" weight="semibold">
                      Recusar convite
                    </ThemedText>
                  </Button>
                </Box>
              ) : null}
            </Card>
          ) : null}

          {currentUserId && (
            <EventCommentsSection
              eventId={event.id}
              eventOwnerId={event.ownerId}
              currentUserId={currentUserId}
            />
          )}
        </Box>
      </Screen>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  centerText: {
    textAlign: 'center'
  }
})
