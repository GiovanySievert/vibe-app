import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { UserMenuFeatures } from '@src/features'

const UserMenuStack = createNativeStackNavigator()

export function UserMenuNavigator() {
  return (
    <UserMenuStack.Navigator screenOptions={{ headerShown: false }}>
      <UserMenuStack.Screen name="UserMenuMain" component={UserMenuFeatures.UserMenuScreen} />
      <UserMenuStack.Screen name="UserEditProfile" component={UserMenuFeatures.UserEditProfile} />
    </UserMenuStack.Navigator>
  )
}
