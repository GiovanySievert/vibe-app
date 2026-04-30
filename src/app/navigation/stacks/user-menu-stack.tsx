import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { NotificationPreferencesScreen } from '@src/features/notifications/preferences'
import { UserMenuFeatures } from '@src/features'
import { Header } from '@src/shared/components'

import { UserMenuStackParamList } from '../types'

const UserMenuStack = createNativeStackNavigator<UserMenuStackParamList>()

export function UserMenuNavigator() {
  return (
    <UserMenuStack.Navigator screenOptions={{ headerShown: false, header: (props) => <Header {...props} /> }}>
      <UserMenuStack.Screen
        name="UserProfileMain"
        component={UserMenuFeatures.UserOwnProfileScreen}
        options={{ headerShown: false }}
      />
      <UserMenuStack.Screen
        name="UserMenuMain"
        component={UserMenuFeatures.UserMenuScreen}
        options={{ headerShown: false }}
      />
      <UserMenuStack.Screen
        name="UserEditProfile"
        component={UserMenuFeatures.UserEditProfile}
        options={{ headerShown: true, title: 'Editar Perfil' }}
      />
      <UserMenuStack.Screen
        name="UserDeleteAccountScreen"
        component={UserMenuFeatures.UserDeleteAccountScreen}
        options={{ headerShown: true, title: 'Deletar Conta' }}
      />
      <UserMenuStack.Screen
        name="TermsOfUseScreen"
        component={UserMenuFeatures.TermsOfUseScreen}
        options={{ headerShown: true, title: 'Termos de Uso' }}
      />
      <UserMenuStack.Screen
        name="NotificationPreferencesScreen"
        component={NotificationPreferencesScreen}
        options={{ headerShown: true, title: 'Notificacoes' }}
      />
    </UserMenuStack.Navigator>
  )
}
