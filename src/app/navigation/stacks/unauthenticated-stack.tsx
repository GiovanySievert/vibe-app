import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { UnathenticatedStackParamList } from '../types'
import { AuthFeatures } from '@src/features'

const UnathenticatedStack = createNativeStackNavigator<UnathenticatedStackParamList>()

export const UnathenticatedStackScreen = () => {
  return (
    <UnathenticatedStack.Navigator initialRouteName="AuthScreen">
      <UnathenticatedStack.Screen
        name="AuthScreen"
        component={AuthFeatures.AuthScreen}
        options={{
          headerShown: false,
          headerTransparent: false
        }}
      />
    </UnathenticatedStack.Navigator>
  )
}
