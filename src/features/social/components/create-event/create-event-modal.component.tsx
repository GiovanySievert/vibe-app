import React, { useState } from 'react'
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useToast } from '@src/app/providers'
import { Box, SwipeableModal, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { GetUserByUsername } from '@src/shared/domain/users.model'

import { CreateEventPayload, EventFormData } from '../../domain/event.model'
import { EventService } from '../../services/event.service'
import { CreateEventConfirmation } from './create-event-confirmation.component'
import { CreateEventForm } from './create-event-form.component'
import { CreateEventIntro } from './create-event-intro.component'
import { CreateEventParticipants } from './create-event-participants.component'
import { CreateEventSuccess } from './create-event-success.component'

enum CREATE_EVENT_STEPS {
  INTRO = 0,
  FORM = 1,
  PARTICIPANTS = 2,
  CONFIRMATION = 3,
  SUCCESS = 4
}

const PROGRESS_STEPS = ['Detalhes', 'Participantes', 'Confirmar']

const screenWidth = Dimensions.get('window').width
const MODAL_HEIGHT = Dimensions.get('window').height * 0.9

type CreateEventModalProps = {
  visible: boolean
  onClose: () => void
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({ visible, onClose }) => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const [currentStep, setCurrentStep] = useState(CREATE_EVENT_STEPS.INTRO)
  const [formData, setFormData] = useState<EventFormData>({ name: '', date: '', time: '', description: '' })
  const [participants, setParticipants] = useState<GetUserByUsername[]>([])
  const [eventLink, setEventLink] = useState('')

  const { mutate: saveEvent } = useMutation({
    mutationFn: (payload: CreateEventPayload) => EventService.create(payload),
    onMutate: () => {
      goToStep(CREATE_EVENT_STEPS.SUCCESS)
    },
    onSuccess: ({ data }) => {
      setEventLink(`myapp://events/share/${data.id}`)
      queryClient.invalidateQueries({ queryKey: ['myEvents'] })
    },
    onError: () => {
      goToStep(CREATE_EVENT_STEPS.CONFIRMATION)
      showToast('não foi possível criar o evento.', 'error')
    }
  })

  const animatedValue = useSharedValue(0)

  const goToStep = (step: CREATE_EVENT_STEPS) => {
    animatedValue.value = withTiming(step, { duration: 300 })
    setCurrentStep(step)
  }

  const handleClose = () => {
    animatedValue.value = 0
    setCurrentStep(CREATE_EVENT_STEPS.INTRO)
    setFormData({ name: '', date: '', time: '', description: '' })
    setParticipants([])
    setEventLink('')
    onClose()
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value * -screenWidth }]
  }))

  const handleChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleToggleParticipant = (user: GetUserByUsername) => {
    setParticipants((prev) =>
      prev.some((p) => p.id === user.id) ? prev.filter((p) => p.id !== user.id) : [...prev, user]
    )
  }

  const handleSave = () => {
    saveEvent({ ...formData, participants })
  }

  const progressIndex = currentStep - CREATE_EVENT_STEPS.FORM
  const showProgress = currentStep > CREATE_EVENT_STEPS.INTRO && currentStep < CREATE_EVENT_STEPS.SUCCESS

  return (
    <SwipeableModal visible={visible} onClose={handleClose} height={MODAL_HEIGHT}>
      <Box flex={1} style={styles.container}>
        <Box pl={5} pr={5} pt={2} pb={4} gap={4}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <ThemedText weight="semibold" size="lg">
              Crie seu evento
            </ThemedText>
            <TouchableOpacity onPress={handleClose} hitSlop={styles.closeHitSlop}>
              <ThemedIcon name="X" size={20} color="textSecondary" />
            </TouchableOpacity>
          </Box>

          {showProgress && (
            <Box flexDirection="row" gap={2}>
              {PROGRESS_STEPS.map((label, i) => (
                <Box key={i} flex={1} gap={1}>
                  <Box style={[styles.progressBar, i <= progressIndex && styles.progressBarActive]} />
                  <ThemedText size="xs" color={i <= progressIndex ? 'primary' : 'textSecondary'}>
                    {label}
                  </ThemedText>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Animated.View style={[styles.stepsRow, animatedStyle]}>
          <Box p={5} style={styles.step}>
            {currentStep === CREATE_EVENT_STEPS.INTRO && (
              <CreateEventIntro onNext={() => goToStep(CREATE_EVENT_STEPS.FORM)} />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === CREATE_EVENT_STEPS.FORM && (
              <CreateEventForm
                formData={formData}
                onChange={handleChange}
                onNext={() => goToStep(CREATE_EVENT_STEPS.PARTICIPANTS)}
              />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === CREATE_EVENT_STEPS.PARTICIPANTS && (
              <CreateEventParticipants
                selected={participants}
                onToggle={handleToggleParticipant}
                onNext={() => goToStep(CREATE_EVENT_STEPS.CONFIRMATION)}
                onBack={() => goToStep(CREATE_EVENT_STEPS.FORM)}
              />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === CREATE_EVENT_STEPS.CONFIRMATION && (
              <CreateEventConfirmation
                payload={{ ...formData, participants }}
                onSave={handleSave}
                onBack={() => goToStep(CREATE_EVENT_STEPS.PARTICIPANTS)}
              />
            )}
          </Box>
          <Box p={5} style={styles.step}>
            {currentStep === CREATE_EVENT_STEPS.SUCCESS && (
              <CreateEventSuccess eventName={formData.name} eventLink={eventLink} onClose={handleClose} />
            )}
          </Box>
        </Animated.View>
      </Box>
    </SwipeableModal>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  closeHitSlop: {
    top: 8,
    bottom: 8,
    left: 8,
    right: 8
  },
  progressBar: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.border
  },
  progressBarActive: {
    backgroundColor: theme.colors.primary
  },
  stepsRow: {
    flexDirection: 'row',
    flex: 1
  },
  step: {
    width: '100%'
  }
})
