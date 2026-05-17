import React from 'react'

import { useAtom, useSetAtom } from 'jotai'

import { Box, Button, SwipeableModal, ThemedText } from '@src/shared/components'
import { locationStateAtom } from '@src/shared/state/location.state'

import { locationGateModalVisibleAtom } from '../state'
import { CURITIBA_COORDS } from '../utils'

export const LocationGateModal: React.FC = () => {
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
          <ThemedText variant="subtitle">App disponível apenas em Curitiba</ThemedText>
          <ThemedText variant="secondary">
            Detectamos que você está fora da nossa região de cobertura. Por enquanto, o Vibes funciona somente em Curitiba.
          </ThemedText>
        </Box>

        <Box gap={3}>
          <Button variant="solid" type="primary" onPress={handleSetCuritiba}>
            <ThemedText variant="primary" weight="semibold" color="background">
              Colocar localização em Curitiba
            </ThemedText>
          </Button>

          <Button variant="outline" type="primary" onPress={handleClose}>
            <ThemedText variant="primary" weight="semibold" color="primary">
              Não fazer nada
            </ThemedText>
          </Button>
        </Box>
      </Box>
    </SwipeableModal>
  )
}
