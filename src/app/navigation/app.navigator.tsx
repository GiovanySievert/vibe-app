import React from 'react'

import { useAtomValue } from 'jotai'

import { authStateAtom } from '@src/features/auth/state'

import { AuthenticatedNavigator } from './stacks'
import { UnathenticatedStackScreen } from './stacks/unauthenticated-stack'

export const MainAppNavigator = () => {
  const isAuthenticated = useAtomValue(authStateAtom).isAuthenticated

  return <>{isAuthenticated ? <AuthenticatedNavigator /> : <UnathenticatedStackScreen />}</>
}
