import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { HomeFeatures, UserMenuFeatures } from '@src/features'
import { BottomTab } from '@src/shared/components'
import { Header } from '@src/shared/components/header'

import { AuthenticatedStackParamList, TabRoutesName } from '../types'

const Tab = createBottomTabNavigator<AuthenticatedStackParamList>()

export function TabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        header: (props) => <Header {...props} />
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeFeatures.HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: TabRoutesName.HOME
        }}
      />

      <Tab.Screen
        name="UserMenuScreen"
        component={UserMenuFeatures.UserMenuScreen}
        options={{
          headerShown: false,
          tabBarLabel: TabRoutesName.MENU
        }}
      />
    </Tab.Navigator>
  )
}
