// navigation/root.tsx
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ModalNavigator } from '../modal-navigator'
import { TabsNavigator } from '../tabs'
import { AuthenticatedStackParamList } from '../types'

const AuthenticatedStack = createNativeStackNavigator<AuthenticatedStackParamList>()

export function AuthenticatedNavigator() {
  return (
    <AuthenticatedStack.Navigator>
      <AuthenticatedStack.Screen name="Tabs" component={TabsNavigator} options={{ headerShown: false }} />
      <AuthenticatedStack.Screen
        name="Modals"
        component={ModalNavigator}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </AuthenticatedStack.Navigator>
  )
}
