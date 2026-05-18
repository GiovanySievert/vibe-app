import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers/toast.provider'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Button, Card, Divider, LoadingPage, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useAppTranslation } from '@src/shared/i18n'
import { formatEventDateTime, triggerLightHaptic } from '@src/shared/utils'

import { EventCommentsSection } from '../components/event-comments-section.component'
import { EventCoverImage } from '../components/event-cover-image.component'
import { EventParticipantStatus } from '../domain/event.model'
import { EventService } from '../services/event.service'

type SharedEventScreenProps = NativeStackScreenProps<AuthenticatedStackParamList, 'SharedEventScreen'>

const AVATAR_SIZE = 32
const AVATAR_OVERLAP = 10
const MAX_VISIBLE_AVATARS = 5

export const SharedEventScreen: React.FC<SharedEventScreenProps> = ({ route, navigation }) => {
  const { t } = useAppTranslation()
  const { token } = route.params
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  const {
    data: event,
    isLoading,
    isError,
    refetch
  } = useQuery({
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

  const handleOpenPlace = () => {
    if (!event?.place) return

    navigation.navigate('Modals', {
      screen: 'PlacesDetailsScreen',
      params: { placeId: event.place.id }
    })
  }

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
          participants: old.participants.map((p) => (p.userId === currentUserId ? { ...p, status } : p))
        }
      })

      return { previous }
    },
    onSuccess: async (response) => {
      queryClient.setQueryData(['sharedEvent', token], response.data)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['eventInvitations'] }),
        queryClient.invalidateQueries({ queryKey: ['myEvents'] })
      ])
      showToast(t('social.sharedEvent.responseSuccess'))
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['sharedEvent', token], context.previous)
      }
      showToast(t('social.sharedEvent.responseFailed'), 'error')
    }
  })

  const handleRespondToInvitation = (status: EventParticipantStatus.ACCEPTED | EventParticipantStatus.DECLINED) => {
    triggerLightHaptic()
    respondToInvitationMutation.mutate(status)
  }

  if (isLoading || !session?.user.id) {
    return (
      <Box flex={1} style={styles.container} justifyContent="center" alignItems="center">
        <LoadingPage />
      </Box>
    )
  }

  if (isError || !event) {
    return (
      <Box flex={1} style={styles.container} justifyContent="center" alignItems="center" ml={5} mr={5} gap={4}>
        <ThemedText weight="semibold" size="lg">
          {t('social.sharedEvent.openFailedTitle')}
        </ThemedText>
        <ThemedText color="textSecondary" style={styles.centerText}>
          {t('social.sharedEvent.openFailedMsg')}
        </ThemedText>
        <Button onPress={() => refetch()}>
          <ThemedText color="background" weight="semibold">
            {t('common.retry')}
          </ThemedText>
        </Button>
      </Box>
    )
  }

  if (!canAccessEvent) {
    return (
      <Box flex={1} style={styles.container} justifyContent="center" alignItems="center" ml={5} mr={5} gap={4}>
        <ThemedText weight="semibold" size="lg">
          {t('social.sharedEvent.accessDeniedTitle')}
        </ThemedText>
        <ThemedText color="textSecondary" style={styles.centerText}>
          {t('social.sharedEvent.accessDeniedMsg')}
        </ThemedText>
      </Box>
    )
  }

  return (
    <Box style={styles.container}>
      <Box
        style={styles.header}
        pl={5}
        pr={5}
        pb={4}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box flex={1} gap={1}>
          <ThemedText weight="semibold" size="lg">
            {event.name}
          </ThemedText>
        </Box>
        <Touchable onPress={() => navigation.goBack()} style={styles.iconButton}>
          <ThemedIcon name="X" size={20} color="textSecondary" />
        </Touchable>
      </Box>

      <Divider />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {event.imageUrl && <EventCoverImage uri={event.imageUrl} />}

        <Box gap={1} mb={4}>
          <ThemedText size="sm" color="textSecondary" weight="semibold">
            {t('social.eventDetail.descLabel')}
          </ThemedText>
          <ThemedText color={event.description ? 'textPrimary' : 'textSecondary'}>
            {event.description || t('social.eventDetail.noDesc')}
          </ThemedText>
        </Box>

        <Box flexDirection="column" justifyContent="space-between" gap={1} mb={4}>
          <ThemedText size="sm" color="textSecondary" weight="semibold">
            {t('social.eventDetail.timeLabel')}
          </ThemedText>
          <ThemedText>{formatEventDateTime(event.date, event.time)}</ThemedText>
        </Box>

        <Box flexDirection="column" justifyContent="space-between" gap={1} mb={4}>
          <ThemedText size="sm" color="textSecondary" weight="semibold">
            {t('social.eventDetail.placeLabel')}
          </ThemedText>
          {event.place ? (
            <Touchable activeOpacity={0.7} onPress={handleOpenPlace}>
              <Box gap={1}>
                <ThemedText>{event.place.name}</ThemedText>
                {!![event.place.type, event.place.neighborhood].filter(Boolean).length && (
                  <ThemedText size="sm" color="textSecondary">
                    {[event.place.type, event.place.neighborhood].filter(Boolean).join(' · ')}
                  </ThemedText>
                )}
              </Box>
            </Touchable>
          ) : (
            <ThemedText color="textSecondary">{t('social.eventDetail.noPlace')}</ThemedText>
          )}
        </Box>

        <Box gap={2} mb={4}>
          <ThemedText size="sm" color="textSecondary" weight="semibold">
            {t('social.sharedEvent.guestsLabel', {
              count: event.participants.length
            })}
          </ThemedText>
          <Box flexDirection="row" alignItems="center" gap={2}>
            <Box
              style={[
                styles.avatarRow,
                {
                  width:
                    Math.min(event.participants.length, MAX_VISIBLE_AVATARS) * (AVATAR_SIZE - AVATAR_OVERLAP) +
                    AVATAR_OVERLAP
                }
              ]}
            >
              {event.participants.slice(0, MAX_VISIBLE_AVATARS).map((item, index) => (
                <Box key={item.id} style={[styles.avatarWrapper, { left: index * (AVATAR_SIZE - AVATAR_OVERLAP) }]}>
                  <Avatar size="sm" uri={item.avatar} />
                </Box>
              ))}
            </Box>
            {event.participants.length > MAX_VISIBLE_AVATARS && (
              <ThemedText size="sm" color="textSecondary">
                +{' '}
                {t('social.sharedEvent.morePeople', {
                  count: event.participants.length - MAX_VISIBLE_AVATARS
                })}
              </ThemedText>
            )}
          </Box>
        </Box>

        <Box mt={4} gap={3}>
          {isOwner ? (
            <Card gap={2}>
              <Box flexDirection="row" alignItems="center" gap={2}>
                <ThemedIcon name="Crown" size={16} color="primary" />
                <ThemedText weight="semibold" size="sm">
                  {t('social.sharedEvent.ownerTitle')}
                </ThemedText>
              </Box>
              <ThemedText color="textSecondary" size="sm">
                {t('social.sharedEvent.ownerDescription')}
              </ThemedText>
            </Card>
          ) : participant && participant.status === EventParticipantStatus.PENDING ? (
            <Card gap={3}>
              <ThemedText weight="semibold">{t('social.sharedEvent.yourResponse')}</ThemedText>
              <Box gap={3}>
                <Button onPress={() => handleRespondToInvitation(EventParticipantStatus.ACCEPTED)}>
                  <ThemedText color="background" weight="semibold">
                    {t('social.sharedEvent.confirmPresence')}
                  </ThemedText>
                </Button>
                <Button variant="outline" onPress={() => handleRespondToInvitation(EventParticipantStatus.DECLINED)}>
                  <ThemedText color="primary" weight="semibold">
                    {t('social.sharedEvent.declineInvite')}
                  </ThemedText>
                </Button>
              </Box>
            </Card>
          ) : participant && participant.status === EventParticipantStatus.DECLINED ? (
            <Card gap={3}>
              <ThemedText weight="semibold">{t('social.sharedEvent.declinedTitle')}</ThemedText>
              <ThemedText color="textSecondary" size="sm">
                {t('social.sharedEvent.declinedDescription')}
              </ThemedText>
              <Button onPress={() => handleRespondToInvitation(EventParticipantStatus.ACCEPTED)}>
                <ThemedText color="background" weight="semibold">
                  {t('social.sharedEvent.confirmPresence')}
                </ThemedText>
              </Button>
            </Card>
          ) : null}

          {currentUserId && participant?.status !== EventParticipantStatus.DECLINED && (
            <EventCommentsSection eventId={event.id} eventOwnerId={event.ownerId} currentUserId={currentUserId} />
          )}

          {participant?.status === EventParticipantStatus.ACCEPTED && (
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Box flexDirection="row" alignItems="center" gap={2}>
                <ThemedIcon name="CircleCheck" size={14} color="success" />
                <ThemedText size="sm" color="success" weight="semibold">
                  {t('social.eventDetail.statusAccepted')}
                </ThemedText>
              </Box>
              <Touchable onPress={() => handleRespondToInvitation(EventParticipantStatus.DECLINED)}>
                <ThemedText size="xs" color="textSecondary">
                  {t('social.sharedEvent.declineInvite')}
                </ThemedText>
              </Touchable>
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background
  },
  header: {
    paddingTop: 16
  },
  iconButton: {
    padding: 8
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16
  },
  centerText: {
    textAlign: 'center'
  },
  avatarRow: {
    height: AVATAR_SIZE,
    position: 'relative'
  },
  avatarWrapper: {
    position: 'absolute',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: theme.colors.background,
    overflow: 'hidden'
  }
})
