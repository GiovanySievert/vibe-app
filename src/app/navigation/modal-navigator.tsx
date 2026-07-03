import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { PlacesDetailsScreen } from '@src/features/places'
import { SearchScreen } from '@src/features/search/screens/search.screen'
import { CreateEventScreen, EventDetailScreen, EventPlaceSearchScreen, FollowRequestsScreen } from '@src/features/social/screens'
import { BlockedUsersScreen } from '@src/features/user-menu/screens'
import { UsersProfileScreen } from '@src/features/users-profile'
import { FollowListScreen } from '@src/features/users-profile/screens/follow-list.screen'

import { ModalNavigatorParamsList } from './types'

const ModalStack = createNativeStackNavigator<ModalNavigatorParamsList>()

export function ModalNavigator() {
  return (
    <ModalStack.Navigator screenOptions={{ presentation: 'modal', headerShown: false }}>
      <ModalStack.Screen name="PlacesDetailsScreen" component={PlacesDetailsScreen} />
      <ModalStack.Screen name="UsersProfileScreen" component={UsersProfileScreen} />
      <ModalStack.Screen name="SearchScreen" component={SearchScreen} />
      <ModalStack.Screen name="CreateEventScreen" component={CreateEventScreen} />
      <ModalStack.Screen name="EventDetailScreen" component={EventDetailScreen} />
      <ModalStack.Screen name="EventPlaceSearchScreen" component={EventPlaceSearchScreen} />
      <ModalStack.Screen name="FollowRequestsScreen" component={FollowRequestsScreen} />
      <ModalStack.Screen name="BlockedUsersScreen" component={BlockedUsersScreen} />
      <ModalStack.Screen name="FollowListScreen" component={FollowListScreen} />
    </ModalStack.Navigator>
  )
}
