import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { NavigationProp, useNavigation } from '@react-navigation/native'

import { useAtomValue, useSetAtom } from 'jotai'

import { AuthenticatedStackParamList } from '@src/app/navigation/types'
import { Box, Button, FakeInput, Input, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { applyDateMask, applyTimeMask, triggerLightHaptic, validationMapErrors } from '@src/shared/utils'

import { EventFormData } from '../../domain/event.model'
import { createEventSchema } from '../../domain/event.schema'
import { eventPlacePickerAtom } from '../../state/event-place-picker.state'
import { pickEventImageFromLibrary } from '../../utils/pick-event-image'
import { EventPhotoPicker } from '../event-photo-picker.component'

type CreateEventFormProps = {
  formData: EventFormData
  onChange: (field: keyof EventFormData, value: EventFormData[keyof EventFormData]) => void
  onNext: () => void
}

type CreateEventFieldErrors = {
  name: string
  date: string
  time: string
  description: string
}

const EMPTY_ERRORS: CreateEventFieldErrors = {
  name: '',
  date: '',
  time: '',
  description: ''
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ formData, onChange, onNext }) => {
  const { t } = useAppTranslation()
  const navigation = useNavigation<NavigationProp<AuthenticatedStackParamList>>()
  const selectedPlace = useAtomValue(eventPlacePickerAtom)
  const setSelectedPlace = useSetAtom(eventPlacePickerAtom)
  const [errors, setErrors] = useState(EMPTY_ERRORS)

  useEffect(() => {
    if (selectedPlace && selectedPlace.id !== formData.place?.id) {
      onChange('place', selectedPlace)
    }
  }, [formData.place, onChange, selectedPlace])

  const handleNext = () => {
    const result = createEventSchema.safeParse(formData)
    if (!result.success) {
      setErrors(validationMapErrors(result.error, EMPTY_ERRORS))
      return
    }
    setErrors(EMPTY_ERRORS)
    onNext()
  }

  const handleChange = (field: keyof EventFormData, value: EventFormData[keyof EventFormData]) => {
    if (field in errors && errors[field as keyof CreateEventFieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    onChange(field, value)
  }

  const handleOpenPlaceSearch = () => {
    setSelectedPlace(formData.place)
    navigation.navigate('Modals', {
      screen: 'EventPlaceSearchScreen'
    })
  }

  const handleClearPlace = () => {
    setSelectedPlace(null)
    onChange('place', null)
  }

  const handlePickImage = async () => {
    const imageUri = await pickEventImageFromLibrary()
    if (imageUri) {
      triggerLightHaptic()
      onChange('imageUri', imageUri)
    }
  }

  const placeMeta = [formData.place?.type, formData.place?.neighborhood].filter(Boolean).join(' · ')

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
      <Box gap={4} pb={6}>
        <EventPhotoPicker
          label={t('social.createEvent.photoLabel')}
          uri={formData.imageUri}
          onPick={handlePickImage}
          onClear={() => onChange('imageUri', null)}
        />

        <Input
          label={t('social.createEvent.nameLabel')}
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          errorMessage={errors.name}
          maxLength={60}
        />

        <Box flexDirection="row" gap={3}>
          <Box flex={1}>
            <Input
              label={t('social.createEvent.dateLabel')}
              value={formData.date}
              onChangeText={(value) => handleChange('date', applyDateMask(value))}
              errorMessage={errors.date}
              keyboardType="numeric"
              maxLength={10}
            />
          </Box>
          <Box flex={1}>
            <Input
              label={t('social.createEvent.timeLabel')}
              value={formData.time}
              onChangeText={(value) => handleChange('time', applyTimeMask(value))}
              errorMessage={errors.time}
              keyboardType="numeric"
              maxLength={5}
            />
          </Box>
        </Box>

        <Input
          label={t('social.createEvent.descriptionLabel')}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          errorMessage={errors.description}
          multiline
          maxLength={300}
        />

        <Box gap={1}>
          <FakeInput
            label={t('social.createEvent.placeLabel')}
            value={formData.place?.name ?? ''}
            placeholder={t('social.createEvent.placeSelect')}
            startIconName="MapPin"
            isClearable
            onClear={handleClearPlace}
            onPress={handleOpenPlaceSearch}
          />
          {!!placeMeta && (
            <ThemedText size="xs" color="textSecondary">
              {placeMeta}
            </ThemedText>
          )}
        </Box>

        <Button onPress={handleNext}>
          <ThemedText color="background" weight="semibold">
            {t('social.createEvent.nextBtn')}
          </ThemedText>
        </Button>
      </Box>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1
  }
})
