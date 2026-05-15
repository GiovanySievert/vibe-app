import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, ScrollView, Share, StyleSheet, TouchableOpacity } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers'
import { authClient } from '@src/services/api/auth-client'
import { Avatar, Box, Button, Divider, FakeInput, Input, ThemedText } from '@src/shared/components'
import { SwipeableModal } from '@src/shared/components/swipeable-modal'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { useUploadImage } from '@src/shared/hooks'
import { formatEventDateTime } from '@src/shared/utils'

import { EventParticipantStatus } from '../domain/event.model'
import { EventResponse, EventService } from '../services/event.service'
import { eventPlacePickerAtom } from '../state/event-place-picker.state'
import { pickEventImageFromLibrary } from '../utils/pick-event-image'
import { EventCommentsSection } from './event-comments-section.component'
import { EventCoverImage } from './event-cover-image.component'
import { EventPhotoPicker } from './event-photo-picker.component'

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
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { upload, uploading } = useUploadImage()
  const { data: session } = authClient.useSession()
  const pickerPlace = useAtomValue(eventPlacePickerAtom)
  const setPickerPlace = useSetAtom(eventPlacePickerAtom)
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState('')
  const [imageUri, setImageUri] = useState<string | null>(null)

  useEffect(() => {
    setDescription(event?.description ?? '')
    setPickerPlace(event?.place ?? null)
    setImageUri(event?.imageUrl ?? null)
    setIsEditing(false)
  }, [event, setPickerPlace])

  const { mutate: updateEvent, isPending: isUpdatingEvent } = useMutation({
    mutationFn: async () => {
      const nextImageUrl =
        imageUri && imageUri !== event!.imageUrl && isLocalImageUri(imageUri) ? await upload(imageUri, 'uploads') : imageUri

      return EventService.update(event!.id, {
        description,
        placeId: pickerPlace?.id ?? null,
        imageUrl: nextImageUrl ?? null
      })
    },
    onMutate: () => {
      setIsEditing(false)
    },
    onSuccess: ({ data }) => {
      setDescription(data.description ?? '')
      setPickerPlace(data.place)
      setImageUri(data.imageUrl)
      queryClient.invalidateQueries({ queryKey: ['myEvents'] })
    },
    onError: () => {
      setIsEditing(true)
      showToast('não foi possível salvar o evento.', 'error')
    }
  })

  const handleCancelEdit = () => {
    setDescription(event?.description ?? '')
    setPickerPlace(event?.place ?? null)
    setImageUri(event?.imageUrl ?? null)
    setIsEditing(false)
  }

  const handleOpenPlaceSearch = () => {
    setPickerPlace(pickerPlace ?? event?.place ?? null)
    navigation.navigate('Modals', {
      screen: 'EventPlaceSearchScreen'
    })
  }

  const handleClearPlace = () => {
    setPickerPlace(null)
  }

  const handlePickImage = async () => {
    const nextImageUri = await pickEventImageFromLibrary()
    if (nextImageUri) {
      setImageUri(nextImageUri)
    }
  }

  const handleOpenPlace = () => {
    if (!pickerPlace) return

    navigation.navigate('Modals', {
      screen: 'PlacesDetailsScreen',
      params: { placeId: pickerPlace.id }
    })
  }

  const handleShare = async () => {
    if (!event) return
    await Share.share({ message: `vibes://events/share/${event.id}` })
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
    Alert.alert('Excluir evento', 'Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteEvent() }
    ])
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
            {imageUri && !isEditing && <EventCoverImage uri={imageUri} height={200} />}

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
                  <EventPhotoPicker uri={imageUri} onPick={handlePickImage} onClear={() => setImageUri(null)} />
                  <Input
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    multilineHeight={100}
                    maxLength={300}
                    autoFocus
                  />
                  <Box gap={1}>
                    <FakeInput
                      label="local"
                      value={pickerPlace?.name ?? ''}
                      placeholder="selecionar local"
                      startIconName="MapPin"
                      isClearable
                      onClear={handleClearPlace}
                      onPress={handleOpenPlaceSearch}
                    />
                    {!![pickerPlace?.type, pickerPlace?.neighborhood].filter(Boolean).length && (
                      <ThemedText size="xs" color="textSecondary">
                        {[pickerPlace?.type, pickerPlace?.neighborhood].filter(Boolean).join(' · ')}
                      </ThemedText>
                    )}
                  </Box>
                  <Box flexDirection="row" gap={3}>
                    <Box flex={1}>
                      <Button variant="ghost" onPress={handleCancelEdit}>
                        <ThemedText color="primary" weight="semibold">
                          Cancelar
                        </ThemedText>
                      </Button>
                    </Box>
                    <Box flex={1}>
                      <Button onPress={() => updateEvent()} loading={uploading || isUpdatingEvent}>
                        <ThemedText color="background" weight="semibold">
                          Salvar
                        </ThemedText>
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <ThemedText color={description ? 'textPrimary' : 'textSecondary'}>
                  {description || 'Sem descrição'}
                </ThemedText>
              )}
            </Box>

            <Box flexDirection="column" justifyContent="space-between" gap={1} mb={4}>
              <ThemedText size="sm" color="textSecondary" weight="semibold">
                Local
              </ThemedText>

              {pickerPlace ? (
                <TouchableOpacity activeOpacity={0.7} onPress={handleOpenPlace}>
                  <Box gap={1}>
                    <ThemedText>{pickerPlace.name}</ThemedText>
                    {!![pickerPlace.type, pickerPlace.neighborhood].filter(Boolean).length && (
                      <ThemedText size="sm" color="textSecondary">
                        {[pickerPlace.type, pickerPlace.neighborhood].filter(Boolean).join(' · ')}
                      </ThemedText>
                    )}
                  </Box>
                </TouchableOpacity>
              ) : (
                <ThemedText color="textSecondary">Sem local</ThemedText>
              )}
            </Box>

            <Box flexDirection="column" justifyContent="space-between" gap={1} mb={4}>
              <ThemedText size="sm" color="textSecondary" weight="semibold">
                Horário
              </ThemedText>

              <ThemedText color={description ? 'textPrimary' : 'textSecondary'}>
                {formatEventDateTime(event.date, event.time)}
              </ThemedText>
            </Box>

            <Box gap={3}>
              <ThemedText size="sm" color="textSecondary" weight="semibold">
                Participantes ({event.participants.length})
              </ThemedText>

              {event.participants.length === 0 ? (
                <ThemedText color="textSecondary" size="sm">
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

const isLocalImageUri = (uri: string) => uri.startsWith('file:') || uri.startsWith('content:')

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
