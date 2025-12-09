import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { BlockedUsersScreen, FollowRequestsScreen, SocialScreen } from '@src/features/social/screens'
import { Header } from '@src/shared/components'

import { SocialStackParamList } from '../types'

const SocialStack = createNativeStackNavigator<SocialStackParamList>()

export function SocialStackNavigator() {
  return (
    <SocialStack.Navigator screenOptions={{ headerShown: false, header: (props) => <Header {...props} /> }}>
      <SocialStack.Screen name="SocialMain" component={SocialScreen} />
      <SocialStack.Screen
        name="FollowRequestsScreen"
        component={FollowRequestsScreen}
        options={{ headerShown: true, title: 'Solicitações' }}
      />
      <SocialStack.Screen
        name="BlockedUsersScreen"
        component={BlockedUsersScreen}
        options={{ headerShown: true, title: 'Bloqueados' }}
      />
    </SocialStack.Navigator>
  )
}
