import React from 'react'

import { LoadingApplication } from '@src/shared/components'

import { useInitializeI18n } from './use-initialize-i18n'

type I18nGateProps = {
  children: React.ReactNode
}

export function I18nGate({ children }: I18nGateProps) {
  const { isReady } = useInitializeI18n()

  if (!isReady) return <LoadingApplication isVisible />

  return <>{children}</>
}
