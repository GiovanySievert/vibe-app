import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { TabsNavigator } from './tabs'
import { AppNavigatorRootParamsList, ModalNavigatorParamsList } from './types'

import { UnathenticatedStackScreen } from './stacks/unauthenticated-stack'

const MainStack = createNativeStackNavigator<AppNavigatorRootParamsList>()

export const MainAppNavigator = () => {
  const islogged = true

  return (
    <>
      {islogged ? (
        <TabsNavigator />
      ) : (
        <MainStack.Navigator
          screenOptions={{
            headerShown: false,
            presentation: 'card'
          }}
        >
          <MainStack.Screen name="UnathenticatedStack" component={UnathenticatedStackScreen} />
        </MainStack.Navigator>
      )}
    </>
  )
}
