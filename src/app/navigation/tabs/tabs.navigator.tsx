import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { FeedFeatures, HomeFeatures } from '@src/features'
import { BottomTab } from '@src/shared/components'
import { useAppTranslation } from '@src/shared/i18n'

import { SocialStackNavigator } from '../social/social-stack.navigator'
import { PostStackNavigator } from '../stacks/post-stack'
import { UserMenuNavigator } from '../stacks/user-menu-stack'
import { TabsNavigatorParamsList } from '../types'

const Tab = createBottomTabNavigator<TabsNavigatorParamsList>()

export function TabsNavigator() {
  const { t } = useAppTranslation()

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
          tabBarLabel: t('common.tabs.map')
        }}
      />

      <Tab.Screen
        name="FeedScreen"
        component={FeedFeatures.FeedScreen}
        options={{
          tabBarLabel: t('common.tabs.feed')
        }}
      />

      <Tab.Screen
        name="PostScreen"
        component={PostStackNavigator}
        options={{
          tabBarLabel: t('common.tabs.post')
        }}
      />

      <Tab.Screen
        name="SocialScreen"
        component={SocialStackNavigator}
        options={{
          tabBarLabel: t('common.tabs.social')
        }}
      />

      <Tab.Screen
        name="UserMenuScreen"
        component={UserMenuNavigator}
        options={{
          tabBarLabel: t('common.tabs.you')
        }}
      />
    </Tab.Navigator>
  )
}
