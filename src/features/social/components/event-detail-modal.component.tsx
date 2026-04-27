import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, ScrollView, Share, StyleSheet, TouchableOpacity } from 'react-native'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Button, Divider, Input, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { formatEventDateTime } from '@src/shared/utils'

import { EventParticipantStatus } from '../domain/event.model'
import { EventResponse, EventService } from '../services/event.service'
import { EventCommentsSection } from './event-comments-section.component'

const MODAL_HEIGHT = Dimensions.get('window').height * 0.85

const STATUS_LABEL: Record<EventParticipantStatus, string> = {
  [EventParticipantStatus.PENDING]: 'Pendente',
  [EventParticipantStatus.ACCEPTED]: 'Presença confirmada',
  [EventParticipantStatus.DECLINED]: 'Convite recusado'
}

const STATUS_COLOR: Record<EventParticipantStatus, keyof typeof theme.colors> = {
  [EventParticipantStatus.PENDING]: 'primary',
  [EventParticipantStatus.ACCEPTED]: 'success',
  [EventParticipantStatus.DECLINED]: 'error'
}

type EventDetailModalProps = {
  event: EventResponse | null
  visible: boolean
  onClose: () => void
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, visible, onClose }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { data: session } = authClient.useSession()
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState('')

  useEffect(() => {
    setDescription(event?.description ?? '')
    setIsEditing(false)
  }, [event])

  const { mutate: updateDescription } = useMutation({
    mutationFn: () => EventService.update(event!.id, { description }),
    onMutate: () => {
      setIsEditing(false)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEvents'] })
    },
    onError: () => {
      setIsEditing(true)
      showToast('não foi possível salvar a descrição.', 'error')
    }
  })

  const handleCancelEdit = () => {
    setDescription(event?.description ?? '')
    setIsEditing(false)
  }

  const handleShare = async () => {
    if (!event) return
    await Share.share({ message: `myapp://events/share/${event.id}` })
  }

  const { mutate: deleteEvent } = useMutation({
    mutationFn: () => EventService.delete(event!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myEvents'] })
      onClose()
    },
    onError: () => {
      showToast('não foi possível excluir o evento.', 'error')
    }
  })

  const handleDelete = () => {
    Alert.alert(
      'Excluir evento',
      'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteEvent() }
      ]
    )
  }

  return (
    <SwipeableModal visible={visible} onClose={onClose} height={MODAL_HEIGHT}>
      {event && (
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
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <ThemedIcon name="Trash2" size={20} color="error" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <ThemedIcon name="Share2" size={20} color="primary" />
            </TouchableOpacity>
          </Box>

          <Divider />

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Box gap={1} mb={4}>
              <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <ThemedText size="sm" color="textSecondary" weight="semibold">
                  Descrição
                </ThemedText>
                {!isEditing && (
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.iconButton}>
                    <ThemedIcon name="Pencil" size={16} color="textSecondary" />
                  </TouchableOpacity>
                )}
              </Box>

              {isEditing ? (
                <Box gap={3}>
                  <Input
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    multilineHeight={100}
                    maxLength={300}
                    autoFocus
                  />
                  <Box flexDirection="row" gap={3}>
                    <Box flex={1}>
                      <Button variant="ghost" onPress={handleCancelEdit}>
                        <ThemedText color="primary" weight="semibold">
                          Cancelar
                        </ThemedText>
                      </Button>
                    </Box>
                    <Box flex={1}>
                      <Button onPress={() => updateDescription()}>
                        <ThemedText color="background" weight="semibold">
                          Salvar
                        </ThemedText>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <ThemedText color={description ? 'textPrimary' : 'textTertiary'}>
                  {description || 'Sem descrição'}
                </ThemedText>
              )}
            </Box>

            <Box flexDirection="column" justifyContent="space-between" gap={1} mb={4}>
              <ThemedText size="sm" color="textSecondary" weight="semibold">
                Horário
              </ThemedText>

              <ThemedText color={description ? 'textPrimary' : 'textTertiary'}>
                {formatEventDateTime(event.date, event.time)}
              </ThemedText>
            </Box>

            <Box gap={3}>
              <ThemedText size="sm" color="textSecondary" weight="semibold">
                Participantes ({event.participants.length})
              </ThemedText>

              {event.participants.length === 0 ? (
                <ThemedText color="textTertiary" size="sm">
                  Nenhum participante
                </ThemedText>
              ) : (
                event.participants.map((participant, index) => (
                  <Box key={participant.id}>
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" gap={3}>
                      <Box flexDirection="row" alignItems="center" gap={3} flex={1}>
                        <Avatar size="sm" uri={participant.avatar} />
                        <ThemedText>{participant.username}</ThemedText>
                      </Box>
                      <ThemedText size="xs" color={STATUS_COLOR[participant.status]}>
                        {STATUS_LABEL[participant.status]}
                      </ThemedText>
                    </Box>
                    {index < event.participants.length - 1 && (
                      <Box mt={3}>
                        <Divider />
                      </Box>
                    )}
                  </Box>
                ))
              )}
            </Box>

            {session?.user.id && (
              <Box mt={4}>
                <EventCommentsSection eventId={event.id} eventOwnerId={event.ownerId} currentUserId={session.user.id} />
              </Box>
            )}
          </ScrollView>
        </Box>
      )}
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingTop: 8
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
  ownerCard: {
    marginTop: 24
  }
})
