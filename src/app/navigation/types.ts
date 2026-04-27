import { NavigatorScreenParams } from '@react-navigation/native'

export enum TabRoutesName {
  HOME = 'Home',
  FEED = 'Feed',
  SOCIAL = 'Social',
  MENU = 'Perfil'
}

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
  UserMenuMain: undefined
  UserEditProfile: undefined
  UserDeleteAccountScreen: undefined
  TermsOfUseScreen: undefined
}

export type SocialStackParamList = {
  SocialMain: undefined
  FollowRequestsScreen: { type: 'received' | 'sent' }
  BlockedUsersScreen: undefined
}

export type TabsNavigatorParamsList = {
  HomeScreen: undefined
  FeedScreen: undefined
  SocialScreen: NavigatorScreenParams<SocialStackParamList>
  UserMenuScreen: NavigatorScreenParams<UserMenuStackParamList>
}

export type ModalNavigatorParamsList = {
  PlacesDetailsScreen: { placeId: string }
  UsersProfileScreen: { userId: string }
  SearchScreen: undefined
  LocationModal: undefined
  PlaceReviewCameraScreen: { placeId: string }
  PlaceReviewPostScreen: { placeId: string; photoUri: string }
}

export type AuthenticatedStackParamList = {
  Tabs: NavigatorScreenParams<TabsNavigatorParamsList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
  SharedEventScreen: { token: string }
}

export type AppNavigatorRootParamsList = {
  TabsNavigator: NavigatorScreenParams<AuthenticatedStackParamList>
  UnathenticatedStack: NavigatorScreenParams<UnathenticatedStackParamList>
  Modals: NavigatorScreenParams<ModalNavigatorParamsList>
}
