import React from 'react'

import { useAtomValue } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'

import { UnathenticatedStackScreen } from './stacks/unauthenticated-stack'
import { TabsNavigator } from './tabs'

export const MainAppNavigator = () => {
  const isAuthenticated = useAtomValue(authStateAtom).isAuthenticated

  return <>{isAuthenticated ? <TabsNavigator /> : <UnathenticatedStackScreen />}</>
}
