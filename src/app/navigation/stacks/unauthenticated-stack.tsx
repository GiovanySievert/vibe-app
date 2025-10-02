import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { AuthFeatures } from '@src/features'

import { UnathenticatedStackParamList } from '../types'

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

      <UnathenticatedStack.Screen
        name="SignInScreen"
        component={AuthFeatures.SignInScreen}
        options={{
          headerShown: false,
          headerTransparent: false
        }}
      />
    </UnathenticatedStack.Navigator>
  )
}
