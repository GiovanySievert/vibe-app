import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { HomeFeatures, UserMenuFeatures } from '@src/features'
import { BottomTab } from '@src/shared/components'
import { Header } from '@src/shared/components/header'

import { TabRoutesName, TabsNavigatorParamsList } from '../types'

const Tab = createBottomTabNavigator<TabsNavigatorParamsList>()

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
        name="SocialScreen"
        component={UserMenuFeatures.UserMenuScreen}
        options={{
          headerShown: false,
          tabBarLabel: TabRoutesName.SOCIAL
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
