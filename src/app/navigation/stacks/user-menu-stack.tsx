import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { UserMenuFeatures } from '@src/features'

import { UserMenuStackParamList } from '../types'

const UserMenuStack = createNativeStackNavigator<UserMenuStackParamList>()

export function UserMenuNavigator() {
  return (
    <UserMenuStack.Navigator screenOptions={{ headerShown: false }}>
      <UserMenuStack.Screen name="UserMenuMain" component={UserMenuFeatures.UserMenuScreen} />
      <UserMenuStack.Screen name="UserEditProfile" component={UserMenuFeatures.UserEditProfile} />
      <UserMenuStack.Screen name="UserDeleteAccountScreen" component={UserMenuFeatures.UserDeleteAccountScreen} />
      <UserMenuStack.Screen name="TermsOfUseScreen" component={UserMenuFeatures.TermsOfUseScreen} />
    </UserMenuStack.Navigator>
  )
}
