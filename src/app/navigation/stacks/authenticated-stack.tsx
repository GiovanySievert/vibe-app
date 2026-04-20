import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SharedEventScreen } from '@src/features/social/screens'
import { Header } from '@src/shared/components'

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
      <AuthenticatedStack.Screen
        name="SharedEventScreen"
        component={SharedEventScreen}
        options={{ headerShown: true, title: 'Convite do evento', header: (props) => <Header {...props} /> }}
      />
    </AuthenticatedStack.Navigator>
  )
}
