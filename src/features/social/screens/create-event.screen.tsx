import React, { useEffect, useState } from 'react'
import { LayoutChangeEvent, StyleSheet, useWindowDimensions } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { ModalNavigatorParamsList } from '@src/app/navigation/types'
import { useToast } from '@src/app/providers/toast.provider'
import { Box, ThemedText, Touchable } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { theme } from '@src/shared/constants/theme'
import { GetUserByUsername } from '@src/shared/domain/users.model'
import { useUploadImage } from '@src/shared/hooks'
import { useAppTranslation } from '@src/shared/i18n'
import { triggerSuccessHaptic } from '@src/shared/utils'

import { CreateEventConfirmation } from '../components/create-event/create-event-confirmation.component'
import { CreateEventForm } from '../components/create-event/create-event-form.component'
import { CreateEventIntro } from '../components/create-event/create-event-intro.component'
import { CreateEventParticipants } from '../components/create-event/create-event-participants.component'
import { CreateEventSuccess } from '../components/create-event/create-event-success.component'
import { CreateEventPayload, CreateEventRequest, EventFormData } from '../domain/event.model'
import { EventService } from '../services/event.service'
import { eventPlacePickerAtom } from '../state/event-place-picker.state'

enum CREATE_EVENT_STEPS {
  INTRO = 0,
  FORM = 1,
  PARTICIPANTS = 2,
  CONFIRMATION = 3,
  SUCCESS = 4
}

type CreateEventScreenProps = NativeStackScreenProps<ModalNavigatorParamsList, 'CreateEventScreen'>

export const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ navigation }) => {
  const { t } = useAppTranslation()
  const { width } = useWindowDimensions()
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { upload, uploading } = useUploadImage()
  const setSelectedPlace = useSetAtom(eventPlacePickerAtom)
  const [currentStep, setCurrentStep] = useState(CREATE_EVENT_STEPS.INTRO)
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    date: '',
    time: '',
    description: '',
    place: null,
    imageUri: null
  })
  const [participants, setParticipants] = useState<GetUserByUsername[]>([])
  const [eventLink, setEventLink] = useState('')
  const [stepWidth, setStepWidth] = useState(width)

  useEffect(() => () => setSelectedPlace(null), [setSelectedPlace])

  const { mutate: saveEvent, isPending: isSavingEvent } = useMutation({
    mutationFn: async (payload: CreateEventPayload) => {
      const { imageUri, ...rest } = payload
      const requestPayload: CreateEventRequest = {
        ...rest,
        imageUrl: imageUri ? await upload(imageUri, 'uploads') : undefined
      }

      return EventService.create(requestPayload)
    },
    onSuccess: ({ data }) => {
      triggerSuccessHaptic()
      goToStep(CREATE_EVENT_STEPS.SUCCESS)
      setEventLink(`vibes://events/share/${data.id}`)
      queryClient.invalidateQueries({ queryKey: ['myEvents'] })
    },
    onError: () => {
      goToStep(CREATE_EVENT_STEPS.CONFIRMATION)
      showToast(t('social.createEvent.createFailed'), 'error')
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
    setFormData({
      name: '',
      date: '',
      time: '',
      description: '',
      place: null,
      imageUri: null
    })
    setParticipants([])
    setEventLink('')
    setSelectedPlace(null)
    navigation.goBack()
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animatedValue.value * -stepWidth }]
  }))

  const handleStepsLayout = (event: LayoutChangeEvent) => {
    setStepWidth(event.nativeEvent.layout.width)
  }

  const handleChange = (field: keyof EventFormData, value: EventFormData[keyof EventFormData]) => {
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
  const progressSteps = [
    t('social.createEvent.detailsStep'),
    t('social.createEvent.participantsStep'),
    t('social.createEvent.confirmStep')
  ]

  return (
    <Box flex={1} bg="background" style={styles.container}>
      <Box pl={5} pr={5} pt={5} pb={4} gap={4}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <ThemedText weight="semibold" size="lg">
            {t('social.createEvent.modalTitle')}
          </ThemedText>
          <Touchable onPress={handleClose} hitSlop={styles.closeHitSlop}>
            <ThemedIcon name="X" size={20} color="textSecondary" />
          </Touchable>
        </Box>

        {showProgress && (
          <Box flexDirection="row" gap={2}>
            {progressSteps.map((label, i) => (
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

      <Box flex={1} onLayout={handleStepsLayout}>
        <Animated.View style={[styles.stepsRow, animatedStyle]}>
          <Box p={5} style={[styles.step, { width: stepWidth }]}>
            {currentStep === CREATE_EVENT_STEPS.INTRO && (
              <CreateEventIntro onNext={() => goToStep(CREATE_EVENT_STEPS.FORM)} />
            )}
          </Box>
          <Box p={5} style={[styles.step, { width: stepWidth }]}>
            {currentStep === CREATE_EVENT_STEPS.FORM && (
              <CreateEventForm
                formData={formData}
                onChange={handleChange}
                onNext={() => goToStep(CREATE_EVENT_STEPS.PARTICIPANTS)}
              />
            )}
          </Box>
          <Box p={5} style={[styles.step, { width: stepWidth }]}>
            {currentStep === CREATE_EVENT_STEPS.PARTICIPANTS && (
              <CreateEventParticipants
                selected={participants}
                onToggle={handleToggleParticipant}
                onNext={() => goToStep(CREATE_EVENT_STEPS.CONFIRMATION)}
                onBack={() => goToStep(CREATE_EVENT_STEPS.FORM)}
              />
            )}
          </Box>
          <Box p={5} style={[styles.step, { width: stepWidth }]}>
            {currentStep === CREATE_EVENT_STEPS.CONFIRMATION && (
              <CreateEventConfirmation
                payload={{ ...formData, participants }}
                loading={uploading || isSavingEvent}
                onSave={handleSave}
                onBack={() => goToStep(CREATE_EVENT_STEPS.PARTICIPANTS)}
              />
            )}
          </Box>
          <Box p={5} style={[styles.step, { width: stepWidth }]}>
            {currentStep === CREATE_EVENT_STEPS.SUCCESS && (
              <CreateEventSuccess eventName={formData.name} eventLink={eventLink} onClose={handleClose} />
            )}
          </Box>
        </Animated.View>
      </Box>
    </Box>
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
    flexShrink: 0
  }
})
