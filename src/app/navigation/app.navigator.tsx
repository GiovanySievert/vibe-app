import React from 'react'

import { UnathenticatedStackScreen } from './stacks/unauthenticated-stack'
import { TabsNavigator } from './tabs'

export const MainAppNavigator = () => {
  const islogged = false

  return <>{islogged ? <TabsNavigator /> : <UnathenticatedStackScreen />}</>
}
