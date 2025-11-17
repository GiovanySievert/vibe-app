import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PlacesDetailsScreen } from '@src/features/places'
import { SearchScreen } from '@src/features/search/screens/search.screen'

import { ModalNavigatorParamsList } from './types'

const ModalStack = createNativeStackNavigator<ModalNavigatorParamsList>()

export function ModalNavigator() {
  return (
    <ModalStack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
      <ModalStack.Screen name="PlacesDetailsScreen" component={PlacesDetailsScreen} />
      <ModalStack.Screen name="SearchScreen" component={SearchScreen} />
    </ModalStack.Navigator>
  )
}
