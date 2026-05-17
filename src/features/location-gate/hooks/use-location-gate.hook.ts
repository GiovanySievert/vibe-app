import { useEffect } from 'react'

import { useAtomValue, useSetAtom } from 'jotai'

import { locationStateAtom } from '@src/shared/state/location.state'

import { locationGateModalVisibleAtom } from '../state'
import { LOCATION_GATE_DELAY_MS, isOutsideCuritiba } from '../utils'

type UseLocationGateParams = {
  enabled: boolean
}

export const useLocationGate = ({ enabled }: UseLocationGateParams) => {
  const location = useAtomValue(locationStateAtom)
  const setModalVisible = useSetAtom(locationGateModalVisibleAtom)

  useEffect(() => {
    if (!enabled) return

    const timer = setTimeout(() => {
      if (!location) return
      if (isOutsideCuritiba(location)) {
        setModalVisible(true)
      }
    }, LOCATION_GATE_DELAY_MS)

    return () => clearTimeout(timer)
  }, [enabled, location, setModalVisible])
}
