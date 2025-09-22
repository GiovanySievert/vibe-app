import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { TabRoutesName } from '../types'
import { HomeFeatures } from '@src/features'
import { Header } from '@src/shared/components/header'
import { BottomTab } from '@src/shared/components'

const Tab = createBottomTabNavigator()

export function TabsNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        header: ({ navigation, route, options }) => <Header navigation={navigation} route={route} options={options} />
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeFeatures.HomeScreen}
        options={{
          tabBarLabel: TabRoutesName.HOME
        }}
      />
    </Tab.Navigator>
  )
}
