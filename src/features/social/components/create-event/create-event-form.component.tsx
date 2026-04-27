import React, { useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Box, Button, Input, ThemedText } from '@src/shared/components'
import { applyDateMask, applyTimeMask, validationMapErrors } from '@src/shared/utils'

import { EventFormData } from '../../domain/event.model'
import { createEventSchema } from '../../domain/event.schema'

type CreateEventFormProps = {
  formData: EventFormData
  onChange: (field: keyof EventFormData, value: string) => void
  onNext: () => void
}

const EMPTY_ERRORS: Record<keyof EventFormData, string> = {
  name: '',
  date: '',
  time: '',
  description: ''
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({ formData, onChange, onNext }) => {
  const [errors, setErrors] = useState(EMPTY_ERRORS)

  const handleNext = () => {
    const result = createEventSchema.safeParse(formData)
    if (!result.success) {
      setErrors(validationMapErrors(result.error, EMPTY_ERRORS))
      return
    }
    setErrors(EMPTY_ERRORS)
    onNext()
  }

  const handleChange = (field: keyof EventFormData, value: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
    onChange(field, value)
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
      <Box gap={4} pb={6}>
        <Input
          label="nome do evento"
          value={formData.name}
          onChangeText={(value) => handleChange('name', value)}
          errorMessage={errors.name}
          maxLength={60}
        />

        <Box flexDirection="row" gap={3}>
          <Box flex={1}>
            <Input
              label="data"
              value={formData.date}
              onChangeText={(value) => handleChange('date', applyDateMask(value))}
              errorMessage={errors.date}
              keyboardType="numeric"
              maxLength={10}
            />
          </Box>
          <Box flex={1}>
            <Input
              label="hora"
              value={formData.time}
              onChangeText={(value) => handleChange('time', applyTimeMask(value))}
              errorMessage={errors.time}
              keyboardType="numeric"
              maxLength={5}
            />
          </Box>
        </Box>

        <Input
          label="descrição"
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          errorMessage={errors.description}
          multiline
          maxLength={300}
        />

        <Button onPress={handleNext}>
          <ThemedText color="background" weight="semibold">
            Próximo
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
