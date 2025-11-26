import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { HomeFeatures, SocialFeatures } from '@src/features'
import { BottomTab } from '@src/shared/components'

import { UserMenuNavigator } from '../stacks/user-menu-stack'
import { TabRoutesName, TabsNavigatorParamsList } from '../types'

const Tab = createBottomTabNavigator<TabsNavigatorParamsList>()

export function TabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeFeatures.HomeScreen}
        options={{
          tabBarLabel: TabRoutesName.HOME
        }}
      />

      <Tab.Screen
        name="SocialScreen"
        component={SocialFeatures.SocialScreen}
        options={{
          tabBarLabel: TabRoutesName.SOCIAL
        }}
      />

      <Tab.Screen
        name="UserMenuScreen"
        component={UserMenuNavigator}
        options={{
          tabBarLabel: TabRoutesName.MENU
        }}
      />
    </Tab.Navigator>
  )
}
