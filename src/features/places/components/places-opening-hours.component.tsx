import React from 'react'

import { Box, Card, ThemedText } from '@src/shared/components'
import { ThemedIcon } from '@src/shared/components/themed-icon'
import { useAppTranslation } from '@src/shared/i18n'

export const PlacesOpeningHours = () => {
  const { t } = useAppTranslation()

  return (
    <Box flex={1} mr={5} ml={5}>
      <Card gap={3} mb={2} flexDirection="row" alignItems="center">
        <ThemedIcon name="Clock" color="primary" />
        <Box>
          <ThemedText>{t('places.openingHours.title')}</ThemedText>
          <ThemedText size="sm">{t('places.openingHours.description')}</ThemedText>
        </Box>
      </Card>
    </Box>
  )
}
