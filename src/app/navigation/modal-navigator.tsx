import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PlacesDetailsScreen } from '@src/features/places'

import { ModalNavigatorParamsList } from './types'

const ModalStack = createNativeStackNavigator<ModalNavigatorParamsList>()

export function ModalNavigator() {
  return (
    <ModalStack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
      <ModalStack.Screen name="PlacesDetailsScreen" component={PlacesDetailsScreen} />
    </ModalStack.Navigator>
  )
}
