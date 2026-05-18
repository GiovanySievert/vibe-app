import React from 'react'

import { useAtom, useSetAtom } from 'jotai'

import { Box, Button, SwipeableModal, ThemedText } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'
import { locationStateAtom } from '@src/shared/state/location.state'

import { locationGateModalVisibleAtom } from '../state'
import { CURITIBA_COORDS } from '../utils'

export const LocationGateModal: React.FC = () => {
  const { t } = useAppTranslation()
  const [visible, setVisible] = useAtom(locationGateModalVisibleAtom)
  const setLocation = useSetAtom(locationStateAtom)

  const handleClose = () => setVisible(false)

  const handleSetCuritiba = () => {
    setLocation({
      latitude: CURITIBA_COORDS.lat,
      longitude: CURITIBA_COORDS.lng,
      neighborhood: 'Curitiba'
    })
    setVisible(false)
  }

  return (
    <SwipeableModal visible={visible} height={340} onClose={handleClose}>
      <Box p={5} flex={1} justifyContent="space-between" gap={5}>
        <Box gap={3}>
          <ThemedText variant="subtitle">{t('locationGate.title')}</ThemedText>
          <ThemedText variant="secondary">{t('locationGate.description')}</ThemedText>
        </Box>

        <Box gap={3}>
          <Button variant="solid" type="primary" onPress={handleSetCuritiba}>
            <ThemedText variant="primary" weight="semibold" color="background">
              {t('locationGate.setCuritibaBtn')}
            </ThemedText>
          </Button>

          <Button variant="outline" type="primary" onPress={handleClose}>
            <ThemedText variant="primary" weight="semibold" color="primary">
              {t('locationGate.skipBtn')}
            </ThemedText>
          </Button>
        </Box>
      </Box>
    </SwipeableModal>
  )
}
