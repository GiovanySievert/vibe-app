import { NavigatorScreenParams } from '@react-navigation/native'

import type { StreakUpdateResponse } from '@src/features/users-profile/types'

export type UnathenticatedStackParamList = {
  AuthScreen: undefined
  SignInScreen: undefined
  ForgotPasswordScreen: {
    typedEmail?: string
  }
  TermsScreen: undefined
  PrivacyScreen: undefined
}

export type UserMenuStackParamList = {
  UserProfileMain: undefined
  UserMenuMain: undefined
  UserEditProfile: undefined
  ChangeUsernameScreen: undefined
  UserBadgesScreen: undefined
  UserDeleteAccountScreen: undefined
  TermsOfUseScreen: undefined
  NotificationPreferencesScreen: undefined
  UserPrivacyScreen: undefined
  LanguageSelectionScreen: undefined
}

export type PostPreselectedPlace = {
  id: string
  name: string
  type?: string
  neighborhood?: string
  location: {
    lat: number
    lon: number
  }
}

export type PostStackParamList = {
  PostMain: { preselectedPlace?: PostPreselectedPlace } | undefined
  PostReviewSuccess: {
    placeId: string
    placeName: string
    streakUpdate?: StreakUpdateResponse | null
  }
}

export type SocialStackParamList = {
  SocialMain: undefined
}

export type TabsNavigatorParamsList = {
  HomeScreen: undefined
  FeedScreen: undefined
  PostScreen: NavigatorScreenParams<PostStackParamList>
  SocialScreen: NavigatorScreenParams<SocialStackParamList>
  UserMenuScreen: NavigatorScreenParams<UserMenuStackParamList>
}

export type ModalNavigatorParamsList = {
  PlacesDetailsScreen: { placeId: string; isHot?: boolean }
  UsersProfileScreen: { userId: string }
  SearchScreen: undefined
  CreateEventScreen: undefined
  EventDetailScreen: { eventId: string }
  EventPlaceSearchScreen: undefined
  LocationModal: undefined
  FollowRequestsScreen: { type: 'received' | 'sent' }
  BlockedUsersScreen: undefined
  FollowListScreen: {
    userId: string
    username: string
    initialTab: 'followers' | 'followings'
  }
}

export type AuthenticatedStackParamList = {
  Tabs: NavigatorScreenParams<TabsNavigatorParamsList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
  SharedEventScreen: { token: string }
  SharedReviewScreen: { reviewId: string }
}

export type AppNavigatorRootParamsList = {
  TabsNavigator: NavigatorScreenParams<AuthenticatedStackParamList>
  UnathenticatedStack: NavigatorScreenParams<UnathenticatedStackParamList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
}
